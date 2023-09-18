require("dotenv").config();
const { pageScraperCategory, pageScraperProducts } = require("./pageScraper");

async function scrapeAll(browserInstance) {
    let browser;
    const url = "https://fptshop.com.vn/may-tinh-xach-tay";

    try {
        browser = await browserInstance;
        await pageScraperProducts(url, browser);
        await browser.close();
    } catch (err) {
        console.log("Could not resolve the browser instance => ", err);
    }
}

module.exports = (browserInstance) => scrapeAll(browserInstance);
