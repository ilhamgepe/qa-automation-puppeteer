import colors from "colors";
colors.enable();
import * as dotEnv from "dotenv";
import puppeteer from "puppeteer";
import paymentlink from "./testCase/createPaymentlink";
import login from "./testCase/login";
import createChannel from "./utils/createChannel/createChannel";
import sendErrorMessage from "./utils/sendMessage";
import { success } from "./utils/step/logs";
import { delay } from "./utils/times/time";
dotEnv.config();

export const errors: any[] = [];

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    defaultViewport: null,
    args: ["--start-maximized"],
    timeout: 10000,
  });
  console.log("berhasil membuat browser".green);

  const page = await browser.newPage();
  await page.setViewport({ width: 0, height: 0 });

  await page.goto(process.env.url!);
  await delay(1000);
  await page.screenshot({
    path: `./screenshot/1landingPage.jpeg`,
    type: "jpeg",
  });
  success("berhasil membuka url");

  // #login case
  await login(page);
  success("berhasil login");

  // #paymentlink case
  await paymentlink(page);
  await delay(1000);
  // #create channel
  const urlOpenPL: string | null = await page.$eval(
    "#main-container>div>div>div:nth-child(1)>div>div>ul>li:nth-child(1)>div>div.col-6.text-right>a",
    (el) => el.getAttribute("href")
  );

  await delay(1000);
  // create new page for create channel
  const page2 = await browser.newPage();
  await page2.setViewport({ width: 0, height: 0 });
  await page2.goto(urlOpenPL!);
  await createChannel(page2, browser);

  await delay(1000);
  success("test selesai dengan " + errors.length + "errors");
  const newError = errors.join("\n\n");

  await sendErrorMessage(
    newError + "\n\n\n" + `test selesai dengan ${errors.length} errors`,
    true
  );
  await delay(1000);
  await browser.close();
})();
