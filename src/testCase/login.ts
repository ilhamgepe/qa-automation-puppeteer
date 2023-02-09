import type { Page } from "puppeteer";
import { delay } from "../utils/times/time";
export default async function login(page: Page) {
  try {
    await page.click("xpath/" + '//*[@id="navbarNav"]/ul/li[1]/a/p');
    await delay(2000);

    // input email dan password
    await page.type("#form-email", process.env.email!);
    await page.type("#form-password", process.env.password!);

    // ss login
    await page.screenshot({
      path: `./screenshot/2loginPage.jpeg`,
      type: "jpeg",
    });
    await delay(200);

    // submit form
    await page.click('button[type="submit"]');
    await delay(200);
    const url = await page.url();
    if (url !== "https://purwantara.id/dashboard")
      throw new Error("url dashboard tidak sesuai");
    await page.screenshot({
      path: `./screenshot/3dashboard.jpeg`,
      type: "jpeg",
    });
  } catch (error) {
    throw new Error("ada yg salah di login case dengan error : " + error);
  }
}
