const browserObject = require("./src/browser");
const scraperController = require("./src/pageController");

let browserInstance = browserObject.startBrowser();

scraperController(browserInstance);
