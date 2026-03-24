import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        try:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            await page.goto("http://localhost:3006")
            title = await page.title()
            print(f"Title: {title}")
            await browser.close()
        except Exception as e:
            print(f"Error: {e}")

asyncio.run(run())
