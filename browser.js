const puppeteer = require("puppeteer");

const startBrowser = async () => {
    let browser;
    try {
        console.log("Open the browser ...");
        browser = await puppeteer.launch({
            headless: "new",
            //  mean browser will run with interface
            args: ["--disable-setuid-sandbox"],
            ignoreHTTPSErrors: true,
            // slowMo: 10,
        });
    } catch (error) {
        console.log("Could not create a browser instance => : ", error);
    }
    return browser;
};

module.exports = {
    startBrowser,
};
