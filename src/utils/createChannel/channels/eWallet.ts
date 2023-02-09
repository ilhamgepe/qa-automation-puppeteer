import { Browser, Page } from "puppeteer";
import { errors } from "../../../main";
import { clickByHref } from "../../clickAction/clickActions";
import { failed, success } from "../../step/logs";
import { delay } from "../../times/time";
import { urlCheckIncludes } from "../../urlCheck/urlCheck";

export default async function eWallet(page: Page, browser: Browser) {
  await page.click("#payments > ul > li:nth-child(3) > a");
  await page
    .waitForSelector("#tab-payment_method-wallet > div > div")
    .catch(async () => {
      await page.click("body");
      failed("tab virtual account tidak di temukan / error");
      const message = `page ewallet gagal di load`;
      errors.push(message);
      await page.goBack();
      return;
    });

  const urlWallets = await page.url();
  const wallets: any[] = [];
  const elWallets = await page.$("#tab-payment_method-wallet > div > div");

  await elWallets?.$$("div").then(async (el) => {
    for (let i = 0; i < el.length; i++) {
      const element = el[i];
      const href = await element.$eval("a", (a) => a.getAttribute("href"));
      const name = await element.$eval("img", (img) => img.getAttribute("alt"));
      wallets.push([href, name]);
    }
  });

  // shopeepay
  const shopee = wallets.filter((wallets) => wallets[1] === "Shopeepay");
  await clickByHref(page, shopee[0][0]!);
  await delay(1000);
  await page
    .waitForSelector("#form-customer-phone")
    .then(() => success("berhasil create shopeepay wallet"))
    .catch(async (e) => {
      failed("tidak bisa membuka page shopee wallet");
      await page.click("body");
      const message = `tidak bisa membuka page shopee wallet`;
      errors.push(message);
      await page.goBack();
      return;
    });
  await delay(1000);
  await page.type("#form-customer-phone", "089675544501");
  await page.click("#submit");
  success("submit shopeepay");
  await delay(1000);
  await page
    .waitForSelector("body > main > div.es-contents", { timeout: 30000 })
    .catch(async (e) => {
      await page.click("body");
      failed("gagal masuk ke web shopee, pas create shopee wallet");
      const message = `gagal masuk ke web shopee, pas create shopee wallet`;
      errors.push(message);
      await page.goto(urlWallets);
      return;
    });
  await page.goto(urlWallets);

  // ovo
  const ovo = wallets.filter((wallets) => wallets[1] === "OVO");
  await clickByHref(page, ovo[0][0]!);
  await delay(1000);
  await page
    .waitForSelector("#form-customer-phone", { timeout: 2000 })
    .catch(async (e) => {
      failed("tidak bisa membuka page ovo");
      await page.click("body");
      const message = `tidak bisa membuka page ovo`;
      errors.push(message);
      await page.goBack();
      return;
    });
  await delay(1000);
  await page.type("#form-customer-phone", "089675544501");
  await page.click("#submit");
  await delay(1000);
  await page
    .waitForSelector(
      "#payments > div.block-content > div.block.row.align-items-center > div.col-md-8 > a",
      { timeout: 3000 }
    )
    .then(() => success("berhasil create OVO wallet"))
    .catch(async (e) => {
      await page.click("body");
      failed("setelah submit ovo, error ges");
      const message = `setelah submit ovo, error ges`;
      errors.push(message);
      await page.goto(urlWallets);
      return;
    });
  await delay(1000);
  await page.goto(urlWallets);

  // dana wallet
  const dana = wallets.filter((wallets) => wallets[1] === "WALLET_DANA");
  const context = browser.defaultBrowserContext();
  await page.setViewport({ width: 0, height: 0 });
  await clickByHref(page, dana[0][0]!);
  await delay(1000);
  await urlCheckIncludes(
    page,
    "https://m.dana.id/",
    "redirect ke halaman dana wallet"
  );

  await context.overridePermissions(page.url(), ["geolocation"]);

  await page.setGeolocation({
    latitude: -6.262030077592485,
    longitude: 106.789096812769,
  });
  await delay(1000);

  await page.reload();
  await page
    .waitForSelector(
      "#app > div > div > div.web-checkout-wrapper > div > div > div.ipg-input-phone-container > div > div.input-border.ipg-input-phone > label > input"
    )
    .then(async () => {
      await delay(1000);
      await page.goto(urlWallets);
    })
    .catch(async (error) => {
      await page.click("body");
      failed("page dana gagal di load, kemungkinan website dana rusak");
      const message = `page dana gagal di load, kemungkinan website dana rusak`;
      errors.push(message);
      await page.goto(urlWallets);
      return;
    });
}
