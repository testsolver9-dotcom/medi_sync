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
        # Click on 'Doctor Login' to navigate to the doctor login/registration page.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/a[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Click on 'Register as Doctor' to navigate to the doctor registration form.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/p/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Fill in Full Name, Email, NMC Registration No., and Phone Number fields with valid data.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Abhinav')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/input[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('abhinav@example.com')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/input[3]').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('NMC123456')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/input[4]').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('9876543210')
        

        # Check the 'I accept the Terms & Conditions' checkbox and click the 'Register' button to request OTP.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/label/input').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Input the received OTP and click 'Verify & Continue' to complete registration.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('123456')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Assertion: Verify that the doctor is registered successfully and redirected to the location selection page.
        frame = context.pages[-1]
        # Check that the page title is 'MediSync'
        assert await frame.title() == 'MediSync'
        # Check that the location selection form label is present and correct
        form_label = await frame.locator('xpath=//label[contains(text(),"Select Practice Location")]').text_content()
        assert form_label == 'Select Practice Location'
        # Check that the expected options are present in the location dropdown or selection
        options = await frame.locator('xpath=//label[contains(text(),"Select Practice Location")]/following-sibling::select/option').all_text_contents()
        expected_options = ['Hospital', 'Hospital-based practice', 'Home Clinic', 'Private clinic practice']
        assert all(option in options for option in expected_options)
        # Check that the 'Continue' button is visible
        continue_button = frame.locator('xpath=//button[contains(text(),"Continue")]')
        assert await continue_button.is_visible()
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    