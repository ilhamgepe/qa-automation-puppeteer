import colors from "colors";
import dotenv from "dotenv";
import puppeteer from "puppeteer";
import createPaymentLink from "./testCase/createPaymentlink";
import login from "./testCase/login";
import createChannel from "./utils/createChannel/createChannel";
import sendErrorMessage from "./utils/sendMessage";
import { success } from "./utils/step/logs";
import { delay } from "./utils/times/time";

dotenv.config();

const errorMessages: any[] = [];

async function main() {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      executablePath:
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      defaultViewport: null,
      args: ["--start-maximized"],
      timeout: 10000,
    });

    console.log("Browser successfully launched".green);

    const page = await browser.newPage();
    await page.setViewport({ width: 0, height: 0 });

    await page.goto(process.env.url!);
    await delay(1000);
    await page.screenshot({
      path: `./screenshot/1landingPage.jpeg`,
      type: "jpeg",
    });
    success("URL successfully opened");

    // Login
    await login(page);
    success("Login successful");

    // Create payment link
    await createPaymentLink(page);
    await delay(1000);

    // Create channel
    const urlOpenPL: string | null = await page.$eval(
      "#main-container>div>div>div:nth-child(1)>div>div>ul>li:nth-child(1)>div>div.col-6.text-right>a",
      (el) => el.getAttribute("href")
    );

    await delay(1000);

    const page2 = await browser.newPage();
    await page2.setViewport({ width: 0, height: 0 });
    await page2.goto(urlOpenPL!);
    await createChannel(page2, browser);

    await delay(1000);
    success("Test finished with " + errorMessages.length + " errors");

    const errorMessage = errorMessages.join("\n\n");

    await sendErrorMessage(
      errorMessage + "\n\n\n" + `Test finished with ${errorMessages.length} errors`,
      true
    );
    await delay(1000);
    await browser.close();
  } catch (error) {
    console.log(error);
    errorMessages.push(error.message);
  }
}

main();