const puppeteer = require("puppeteer");

const startBrowser = async () => {
    let browser;
    try {
        console.log("Open the browser ...");
        browser = await puppeteer.launch({
            headless: false,
            //  mean browser will run with interface
            args: ["--disable-setuid-sandbox"],
            ignoreHTTPSErrors: true,
        });
    } catch (error) {
        console.log("Could not create a browser instance => : ", error);
    }
    return browser;
};

module.exports = {
    startBrowser,
};
