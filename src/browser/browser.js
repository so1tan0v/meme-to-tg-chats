const puppeteer = require('puppeteer');

async function fetchPageContent(url) {
    const browser = await puppeteer.launch({
        executablePath: process.env.CHROME_PATH ?? null,
        headless       : true,
        args           : ['--no-sandbox', '--disable-dev-shm-usage'],
    });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2' });
    const content = await page.content();
    await browser.close();

    return content;
}

module.exports = {
    fetchPageContent
}