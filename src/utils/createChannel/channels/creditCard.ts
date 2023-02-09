import { Page } from "puppeteer";
import { errors } from "../../../main";
import { failed, success } from "../../step/logs";
import { delay } from "../../times/time";

export default async function creditCard(page: Page) {
  await page.click(
    "#tab-payment_method-card > div > div > div > div:nth-child(1) > div > a"
  );
  await delay(3000);
  await page
    .waitForSelector(
      "#tab-payment_method-card > div > div > div > div.card-body.text-center > div > iframe",
      { timeout: 3000 }
    )
    .then(() => success("iframe cc doku berhasil di load"))
    .catch(async (e) => {
      failed(`iframe cc doku gagal di load  : ${e.message}`);
      await page.click("body");
      const message = `iframe cc doku gagal di load`;
      errors.push(message);
      return;
    });
}
