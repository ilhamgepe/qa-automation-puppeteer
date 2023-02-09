import { Page } from "puppeteer";
import { errors } from "../../../main";
import { clickByHref } from "../../clickAction/clickActions";
import { failed, success } from "../../step/logs";
import { delay } from "../../times/time";
import { urlCheckIncludes } from "../../urlCheck/urlCheck";

export default async function qris(page: Page) {
  await page.click("#payments > ul > li:nth-child(4) > a");
  await urlCheckIncludes(page, "#tab-qris", "at click tab qris");
  success("berhasil click tab qris");

  await page.waitForSelector("#tab-qris > div > div").catch(async () => {
    await page.click("body");
    const message = `page QRIS list gagal di load`;
    failed(message);
    errors.push(message);
    await page.goBack();
    return;
  });

  const elQRs = await page.$("#tab-qris > div > div");
  const QRs: any[] = [];
  await elQRs?.$$("div").then(async (el) => {
    for (let i = 0; i < el.length; i++) {
      const element = el[i];
      const href = await element.$eval("a", (a) => a.getAttribute("href"));
      const name = await element.$eval("img", (img) => img.getAttribute("alt"));
      QRs.push([href, name]);
    }
  });

  for (let i = 0; i < QRs.length; i++) {
    const element = QRs[i];
    await clickByHref(page, element[0]);
    await page
      .waitForSelector(
        "#payments > div.block-content > div:nth-child(1) > div.col-md-4.text-center > div > svg > rect",
        { timeout: 5000 }
      )
      .then(() => success(`qris ${element[1]} berhasil di buat`))
      .catch(async (e) => {
        const message = `QRIS ${element[1]} gagal di load : ${e.message}`;
        failed(message);
        errors.push(message);
        return;
      });
    await delay(3000);
    await page.goBack();
  }
}
