const puppeteer = require('puppeteer-extra');
const userAgent = require('user-agents');

const chromeOptions = {
    args: ['--no-sandbox'],
    headless: true,
    defaultViewport: null,
    slowMo: 10
};

(async function main() {
    const browser = await puppeteer.launch(chromeOptions);
    const page = await browser.newPage();
    await page.setUserAgent(userAgent.toString());
    await page.goto('https://www.scan.co.uk');
    await page.title().then(t => console.log(t));
    await browser.close();
})()