import { Page } from "puppeteer";
import { errors } from "../../../main";
import { clickByHref } from "../../clickAction/clickActions";
import { failed, success } from "../../step/logs";
import { delay } from "../../times/time";
import { urlCheckIncludes } from "../../urlCheck/urlCheck";

export default async function counter(page: Page) {
  await page.click("#payments > ul > li:nth-child(5) > a");
  await urlCheckIncludes(page, "#tab-counter", "at click tab counter");
  success("berhasil click tab counter");

  await page.waitForSelector("#tab-counter > div > div").catch(async () => {
    await page.click("body");
    const message = `page Counter list gagal di load`;
    failed(message);
    errors.push(message);
    await page.goBack();
    return;
  });

  const elCounters = await page.$("#tab-counter > div > div");
  const counters: any[] = [];
  function containsNumber(value: string) {
    return /\d/.test(value);
  }

  await elCounters?.$$("div").then(async (el) => {
    for (let i = 0; i < el.length; i++) {
      const element = el[i];
      const href = await element.$eval("a", (a) => a.getAttribute("href"));
      const name = await element.$eval("img", (img) => img.getAttribute("alt"));
      counters.push([href, name]);
    }
  });

  for (let i = 0; i < counters.length; i++) {
    const element = counters[i];
    await clickByHref(page, element[0]);
    await page
      .waitForSelector("#counter", { timeout: 5000 })
      .then(async () => {
        await delay(1000);
        const numberCode = await page.$eval("#counter", (el) => el.textContent);
        const newNumber = numberCode?.slice(0, 7);

        if (!containsNumber(newNumber!)) {
          console.log(`number code kosong ${element[1]}`, numberCode);
          failed("kode pembayaran tidak ada");
          errors.push(`kode pembayaran ${element[1]} tidak ada`);
        }
        if (containsNumber(newNumber!)) {
          console.log(`number code ada ${element[1]}`, numberCode);
          success(`Counter ${element[1]} berhasil di buat`);
        }
      })
      .catch(async (e) => {
        console.log(`Counter ${element[1]} GAGAL! di load: ${e.message}`);
        const message = `Counter ${element[1]} GAGAL! di load`;
        failed(message);
        errors.push(message);
        return;
      });

    await delay(2000);
    await page.goBack();
  }
}
