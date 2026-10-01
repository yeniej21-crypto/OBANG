import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); pg=await b.new_page()
    await pg.goto('http://localhost:8766/dohwa.html'); await pg.wait_for_timeout(500)
    print(await pg.evaluate("JSON.stringify([saju(1996,3,27,6,'음력'),saju(1996,5,14,6,'양력')])"))
    await b.close()
asyncio.run(main())
