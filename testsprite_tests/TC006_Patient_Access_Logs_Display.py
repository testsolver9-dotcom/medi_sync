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
        

        # Input patient username 'Abhinav' in Phone or Patient ID field and click Send OTP.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Abhinav')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Input OTP and click Verify OTP button to complete login.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('123456')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Assert that Access Logs section is visible and contains entries
        access_logs_section = frame.locator('text=Access Logs')
        assert await access_logs_section.is_visible(), 'Access Logs section should be visible'
        # Locate all access log entries
        access_log_entries = frame.locator('xpath=//div[contains(@class, "access-log-entry")]')
        count = await access_log_entries.count()
        assert count > 0, 'There should be at least one access log entry'
        # Verify each access log entry has correct user info and timestamp
        expected_logs = [
            {"Date-Time": "2025-06-10 14:23", "Action": "view", "By": "doctor123"},
            {"Date-Time": "2025-06-09 11:05", "Action": "download", "By": "patient999"}
         ]
        for i in range(count):
            entry = access_log_entries.nth(i)
            date_time_text = await entry.locator('.date-time').inner_text()
            action_text = await entry.locator('.action').inner_text()
            by_text = await entry.locator('.by').inner_text()
            expected = expected_logs[i]
            assert date_time_text == expected['Date-Time'], f"Access log entry {i} has incorrect Date-Time"
            assert action_text == expected['Action'], f"Access log entry {i} has incorrect Action"
            assert by_text == expected['By'], f"Access log entry {i} has incorrect By"
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    