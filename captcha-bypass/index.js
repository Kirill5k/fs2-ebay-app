const puppeteer = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth')
const userAgent = require('user-agents');
puppeteer.use(stealthPlugin());

const unwantedResources = ['stylesheet', 'font', 'image'];

const chromeOptions = {
    args: ['--no-sandbox'],
    headless: true,
    defaultViewport: null,
    slowMo: 10
};

(async function main() {
    const browser = await puppeteer.launch(chromeOptions);
    const page = await browser.newPage();
    await page.setViewport({
        width: 1920 + Math.floor(Math.random() * 100),
        height: 3000 + Math.floor(Math.random() * 100),
        deviceScaleFactor: 1,
        hasTouch: false,
        isLandscape: false,
        isMobile: false,
    });
    await page.setUserAgent(userAgent.toString());
    await page.setJavaScriptEnabled(true);
    await page.setDefaultNavigationTimeout(0);
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (unwantedResources.includes(req.resourceType())) {
            req.abort();
        } else {
            req.continue();
        }
    });
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', {get: () => false,});
    });
    await page.evaluateOnNewDocument(() => {
        window.chrome = {runtime: {}};
    });
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'plugins', {get: () => [1, 2, 3, 4, 5]});
    });
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'languages', {get: () => ['en-GB', 'en']});
    });

    await page.goto('https://www.scan.co.uk', {waitUntil: 'networkidle2', timeout: 0});
    await page.waitForSelector('.logo', { visible: true, timeout: 0 });
    await page.title().then(t => console.log(t));
    await page.content().then(c => console.log(c))
    await browser.close();
})()