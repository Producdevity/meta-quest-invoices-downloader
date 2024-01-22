import 'dotenv/config'
import puppeteer from 'puppeteer'

import handleCookies from './utils/handleCookies'
import handleLogin from './utils/handleLogin'
import invoiceIds, {type InvoiceId} from './invoiceIds'

const baseUrl = 'https://www.meta.com'
// const localizedBaseUrl = `${baseUrl}/nl/en`
// https://www.meta.com/order/digital/1718786898603631


const state = {
  cookieConcentHandled: false,
  loginHandled: false
}


console.log('ENVVVV', process.env.META_EMAIL)

async function capturePDFs(ids: InvoiceId[]) {
  const browser = await puppeteer.launch({headless: 'new'})

  for (const id of ids) {
    const page = await browser.newPage()
    await page.goto(`${baseUrl}/order/digital/${id}`)

    if(!state.cookieConcentHandled){
      await handleCookies(page)
      state.cookieConcentHandled = true
    }

    if(!state.loginHandled){
      await handleLogin(page)
      state.loginHandled = true
    }


    await page.pdf({ path: `invoices/invoice-${id}.pdf` })
    await page.close()
  }

  await browser.close()
}



capturePDFs(invoiceIds).then(() => console.log('PDFs captured'))
