import puppeteer from 'puppeteer'

type Id = string

async function capturePDFs(ids: Id[]) {
  const browser = await puppeteer.launch()
  for (const id of ids) {
    const page = await browser.newPage()
    await page.goto(`https://www.meta.com/order/digital/${id}`)
    await page.pdf({ path: `invoices/invoice-${id}.pdf` })
    await page.close()
  }
  await browser.close()
}

const ids: Id[] = [
  '1718786898603631',
  '1718334041982250',
  '1718273681988286',
  '1717496575399330',
  '1716978238784497',
  '1716974835451504',
  '1716971672118487',
  '1716966802118974',
  '1714417052373949',
  '1713329192482735',
  '1707725939709727',
  '1706334303182224',
  '1693873164428338',
  '1548748395607483',
  '959099641239031',
  '853893585092971',
  '837854546696875',
  '837492350066428',
]

capturePDFs(ids).then(() => console.log('PDFs captured'))
