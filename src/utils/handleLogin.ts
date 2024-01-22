import type {ElementHandle, NodeFor, Page} from 'puppeteer'


async function clickXPathButton(page: Page, selector: string) {
  // const cookieButtonXPath = "//span[contains(text(), 'Next')]";
  await page.waitForXPath(selector)
  const [button] = await page.$x(selector)

  if (button) {
    const btn = button as unknown as ElementHandle<Element>;
    await btn.click();
    await page.waitForNavigation({ waitUntil: 'networkidle0' }); // Wait for cookies to be set
  } else {
    console.log(`button for selector ${selector} not found`);
  }

}

function checkIfExists(name: string, value?: string){
  if(typeof value !== 'string'){
    throw new Error(`Make sure to fill in ${name} in the .env file`)
  }
}

async function fillInputField(page: Page, selector: string, value: string) {
  await page.$eval(selector, (element, newValue) => {
    (element as HTMLInputElement).value = newValue; // Type assertion here
    const event = new Event('change');
    element.dispatchEvent(event);
  }, value);
}


async function performLogin(page: Page){
  const user = {
    email: process.env.META_EMAIL as string,
    password: process.env.META_PASSWORD as string
  }

  checkIfExists('META_EMAIL', user.email)
  checkIfExists('META_PASSWORD', user.password)

  const emailInputSelector = 'input[inputmode="email"]'
  const passwordInputSelector = 'input[type="password"]'

  await clickXPathButton(page, "//span[contains(text(), 'Continue with email address')]")

  await fillInputField(page, emailInputSelector, user.email)

  await clickXPathButton(page, "//span[contains(text(), 'Next')]")
  await clickXPathButton(page, "//span[contains(text(), 'Enter password instead')]")

  await fillInputField(page, passwordInputSelector, user.password)

  await clickXPathButton(page, "//span[contains(text(), 'Log in')]")
}

async function handleLogin(page: Page){

  const loginButtonXPath = "//span[contains(text(), 'Log in to Meta account')]"

  await page.waitForXPath(loginButtonXPath);
  const [loginButton] = await page.$x(loginButtonXPath);


  if (loginButton) {
    const btn = loginButton as unknown as ElementHandle<Element>;
    await btn.click();
    await page.waitForNavigation({ waitUntil: 'networkidle0' }); // Wait for cookies to be set

    await performLogin(page)

  } else {
    console.log('User already logged in');
  }

}

export default handleLogin
