import type {ElementHandle, Page} from 'puppeteer'

async function handleCookies(page: Page){
  // Wait for the cookie banner and accept cookies
  const cookieButtonXPath = "//span[contains(text(), 'Allow all cookies')]";
  await page.waitForXPath(cookieButtonXPath);
  const [cookieButton] = await page.$x(cookieButtonXPath);

  if (cookieButton) {
    const btn = cookieButton as unknown as ElementHandle<Element>;
    await btn.click();
    await page.waitForNavigation({ waitUntil: 'networkidle0' }); // Wait for cookies to be set
  } else {
    console.log('Cookie button not found');
  }
}

export default handleCookies
