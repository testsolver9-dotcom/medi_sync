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
        # Click on Doctor Login to proceed to doctor login page.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/a[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Input Doctor ID 'Abhinav' and click Get OTP button.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Abhinav')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Input OTP and click Verify & Continue button.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('123456')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Select the 'Hospital' location and click the Continue button to proceed to the Doctor Dashboard.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Input a valid Patient ID and click the Request Consent button to proceed.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('patient123')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Assert the page title is 'MediSync'.
        assert await page.title() == 'MediSync'
        # Assert navigation links are present.
        nav_links = await page.locator('nav >> text=Dashboard').count()
        assert nav_links > 0
        nav_links = await page.locator('nav >> text=New Record').count()
        assert nav_links > 0
        nav_links = await page.locator('nav >> text=Access History').count()
        assert nav_links > 0
        nav_links = await page.locator('nav >> text=Logout').count()
        assert nav_links > 0
        # Assert patient name is displayed correctly.
        patient_name_text = await page.locator('text=John Smith').count()
        assert patient_name_text > 0
        # Assert location is displayed as 'hospital'.
        location_text = await page.locator('text=hospital').count()
        assert location_text > 0
        # Assert actions include 'New Consultation'.
        actions_text = await page.locator('text=New Consultation').count()
        assert actions_text > 0
        # Assert records list contains correct dates and symptoms.
        record1 = await page.locator('text=2025-06-20').count()
        assert record1 > 0
        record1_symptoms = await page.locator('text=Fever, cough').count()
        assert record1_symptoms > 0
        record2 = await page.locator('text=2025-05-11').count()
        assert record2 > 0
        record2_symptoms = await page.locator('text=Headache').count()
        assert record2_symptoms > 0
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    