require("dotenv").config();
const { pageScraperCategory } = require("./pageScraper");

async function scrapeAll(browserInstance) {
    let browser;
    const url = process.env.URL;
    try {
        browser = await browserInstance;
        await pageScraperCategory(url, browser);
    } catch (err) {
        console.log("Could not resolve the browser instance => ", err);
    }
}

module.exports = (browserInstance) => scrapeAll(browserInstance);
