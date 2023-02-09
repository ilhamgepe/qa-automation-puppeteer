import { Page } from "puppeteer";
import { errors } from "../../../main";
import { failed, success } from "../../step/logs";
import { delay } from "../../times/time";
import { urlCheckIncludes } from "../../urlCheck/urlCheck";

export default async function paylater(page: Page) {
  await page.click("#payments > ul > li:nth-child(6) > a");
  await urlCheckIncludes(page, "#tab-paylater", "at click tab paylater");
  success("berhasil click tab paylater");

  await page.waitForSelector("#tab-paylater > div > div").catch(async () => {
    await page.click("body");
    const message = `page paylater list gagal di load`;
    failed(message);
    errors.push(message);
    await page.goBack();
    return;
  });

  const elPaylaters = await page.$("#tab-paylater > div > div.row");
  const paylaters: any[] = [];

  await elPaylaters?.$$("div").then(async (el) => {
    for (let i = 0; i < el.length; i++) {
      const element = el[i];
      const href = await element.$eval("a", (a) => a.getAttribute("href"));
      const name = await element.$eval("img", (img) => img.getAttribute("alt"));
      paylaters.push([href, name]);
    }
  });

  // akulaku
  const akulaku = paylaters.filter((paylaters) => paylaters[1] === "Akulaku");
  await page.click("#tab-paylater > div > div.row > div > a");
  await delay(2000);

  await page
    .waitForSelector("#qrcode")
    .then(async () => {
      await delay(1000);
      await page.goBack();
    })
    .catch(async (error) => {
      await page.click("body");
      const message = `page akulaku gagal di load, kemungkinan website akulaku rusak`;
      errors.push(message);
      await page.goBack();
      return;
    });
}
