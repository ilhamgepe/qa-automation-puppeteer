import { Page } from "puppeteer";
import { errors } from "../../../main";
import { failed, success } from "../../step/logs";
import { delay } from "../../times/time";
import { urlCheckIncludes } from "../../urlCheck/urlCheck";

export default async function virtualAccount(page: Page) {
  // move tab to bank transfer
  await page.click("#payments > ul > li:nth-child(2) > a");
  await urlCheckIncludes(
    page,
    "#tab-payment_method-bank_transfer",
    "at click tab bank transfer virtual account"
  );
  success("berhasil click tab bank");

  await page
    .waitForSelector("#tab-payment_method-bank_transfer > div > div")
    .catch(async () => {
      await page.click("body");
      failed("tab virtual account tidak di temukan / error");
      const message = `page VA list gagal di load`;
      errors.push(message);
      await page.goBack();
      return;
    });

  const elVirtualAccounts = await page.$(
    "#tab-payment_method-bank_transfer > div > div.row"
  );
  const virtualAccounts: any[] = [];
  await elVirtualAccounts?.$$("div").then(async (el) => {
    for (let i = 0; i < el.length; i++) {
      const element = el[i];
      const href = await element.$eval("a", (a) => a.getAttribute("href"));
      const name = await element.$eval("img", (img) => img.getAttribute("alt"));
      virtualAccounts.push([href, name]);
    }
  });
  await delay(2000);
  for (let i = 0; i < virtualAccounts.length; i++) {
    const element = virtualAccounts[i];
    await page.click(`[href="${element[0]}"]`);
    await delay(2000);
    await page
      .waitForSelector("#va_number", { timeout: 5000 })
      .then(() => success(`VA ${element[1]} berhasil di buat`))
      .catch(async (e) => {
        failed(`VA ${element[1]} GAGAL! di load`);
        const message = `VA ${element[1]} GAGAL! di load : ${e.message}`;
        errors.push(message);
        return;
      });
    await delay(1000);
    await page.goBack();
  }
}
