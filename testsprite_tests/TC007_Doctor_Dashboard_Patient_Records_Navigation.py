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
        # Click on Doctor Login to proceed with doctor authentication.
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
        

        # Select 'Hospital' as the practice location and click Continue to proceed to the doctor dashboard.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Input a valid Patient ID and click Request Consent to proceed.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('patient123')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Select the first patient record's 'View Details' link to view detailed medical records and consultation history.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/main/div[2]/div/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Test navigation by clicking the 'Dashboard' link to return to the main doctor dashboard.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/nav/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Click on 'New Record' navigation link to verify navigation to the new consultation creation page.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/nav/a[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Click on the 'Access History' navigation link to verify navigation to the patient's access history page.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/nav/a[3]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Click on the 'Dashboard' link to verify navigation back to the main doctor dashboard.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/nav/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Click on the '+ New Consultation' button to verify it opens the consultation creation workflow.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/main/a/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Input sample data into 'Describe symptoms' and 'Medicines prescribed' fields, then click 'Save & Finish' to save the new consultation.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/main/div/textarea').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Patient reports mild fever and headache.')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/main/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Paracetamol 500mg twice daily.')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/main/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Assert the page title is correct
        assert await frame.title() == 'MediSync'
        # Assert navigation links are present and correct
        nav_links = await frame.locator('xpath=//nav/a').all_text_contents()
        assert nav_links == ['Dashboard', 'New Record', 'Access History', 'Logout']
        # Assert patient name and location are displayed correctly
        patient_name_text = await frame.locator('xpath=//main//h1').text_content()
        assert 'John Smith' in patient_name_text
        patient_location_text = await frame.locator('xpath=//main//p[contains(text(),"hospital")]').text_content()
        assert 'hospital' in patient_location_text
        # Assert patient records are displayed with correct dates and symptoms
        record_dates = await frame.locator('xpath=//main//div[contains(@class,"record")]/div[contains(@class,"date")]').all_text_contents()
        record_symptoms = await frame.locator('xpath=//main//div[contains(@class,"record")]/div[contains(@class,"symptoms")]').all_text_contents()
        assert '2025-06-20' in record_dates
        assert 'Fever, cough' in record_symptoms
        assert '2025-05-11' in record_dates
        assert 'Headache' in record_symptoms
        # Assert 'New Consultation' action button is visible
        new_consultation_button = await frame.locator('xpath=//main//a/button[contains(text(),"New Consultation")]').is_visible()
        assert new_consultation_button
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    