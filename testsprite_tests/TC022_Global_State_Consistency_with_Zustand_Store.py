import asyncio
from playwright import async_api

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:3000", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # Click on Patient Login to proceed to patient login page.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Input patient ID 'Abhinav' and click Send OTP.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Abhinav')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Input OTP '123456' and click Verify OTP.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('123456')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Navigate to 'My Records' tab to verify user state consistency.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/nav/ul/li[2]/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Click on 'Path Reports' tab to verify global state persistence.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/nav/ul/li[3]/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Click on 'Access Logs' tab to verify global state persistence.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/nav/ul/li[4]/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Click on 'Dashboard' tab to verify global state persistence and user session data.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/nav/ul/li/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Click on the Logout tab to initiate logout and verify user data reset.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/nav/ul/li[5]/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Assert user info is stored in global state after login
        user_info = await frame.evaluate('window.__GLOBAL_STATE__.user')
        assert user_info is not None, "User info should be present in global state after login"
        assert user_info.get('username') == 'Abhinav', "Username in global state should be 'Abhinav'"
        assert user_info.get('isLoggedIn') is True, "User should be marked as logged in in global state"
          
        # Navigate through dashboard pages and assert global state consistency
        pages_to_check = ["My Records", "Path Reports", "Access Logs", "Dashboard"]
        for page_name in pages_to_check:
            elem = frame.locator(f"xpath=//nav//ul//li//a[contains(text(), '{page_name}')]" if page_name != "Dashboard" else "xpath=html/body/div/div/nav/ul/li/a")
            await elem.click(timeout=5000)
            await page.wait_for_timeout(3000)
            # Check user info remains consistent
            user_info_after_nav = await frame.evaluate('window.__GLOBAL_STATE__.user')
            assert user_info_after_nav == user_info, f"User info should remain consistent after navigating to {page_name}"
          
        # Click logout and assert user data is reset
        logout_elem = frame.locator('xpath=html/body/div/div/nav/ul/li[5]/a')
        await logout_elem.click(timeout=5000)
        await page.wait_for_timeout(3000)
        user_info_after_logout = await frame.evaluate('window.__GLOBAL_STATE__.user')
        assert user_info_after_logout is None or user_info_after_logout == {}, "User data should be reset on logout"
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    