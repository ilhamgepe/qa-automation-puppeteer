import moment from "moment";
import { Page } from "puppeteer";
import { clickByHref } from "../utils/clickAction/clickActions";
import createPL from "../utils/paymentlink/createPL";
import { success } from "../utils/step/logs";
import { delay } from "../utils/times/time";
import { urlCheck } from "../utils/urlCheck/urlCheck";

const getCurrentTime = () => moment().format("YYYY-MM-DD HH:mm");
const getExpirationTime = () => moment().add(3, "hour").format("YYYY-MM-DD HH:mm");

export default async function paymentlink(page: Page) {
  const paymentLinkUrl = "https://purwantara.id/payment-links";
  const createPaymentLinkUrl = "https://purwantara.id/payment-links/create";
  const paymentLinkTitle = `automation ${getCurrentTime()}`;

  await clickByHref(page, paymentLinkUrl);
  await delay(1000);
  await page.screenshot({
    path: `./screenshot/4listOfPaymentLinks.jpeg`,
    type: "jpeg",
  });
  success("berhasil membuka list paymentlink");

  await clickByHref(page, createPaymentLinkUrl);
  await delay(500);
  urlCheck(page, createPaymentLinkUrl, "at click button create paymentlink");
  success("berhasil membuka create paymentlink");

  const tokenCSRF: string = await page.$eval("input[name=_token]", (el: any) =>
    el.getAttribute("value")
  );
  success("berhasil ambil token csrf");

  const cookies = await page.cookies();
  const [secureCookies, xsrf] = cookies.map((cookie) => cookie.value);
  success("berhasil ambil cookies");

  const urlPostPL: string | null = await page.$eval("#main-container > div > form", (el) =>
    el.getAttribute("action")
  );
  success("berhasil ambil url post data paymentlink");

  const body = {
    title: paymentLinkTitle,
    amount: 10000,
    expires_at: getExpirationTime(),
    description: paymentLinkTitle,
    _token: tokenCSRF,
  };
  const header = {
    Cookie: `__Secure-ppn-session=${secureCookies};XSRF-TOKEN=${xsrf}`,
    Accept: "application/json",
    "Content-Type": "application/json",
    Cache: "no-cache",
  };
  await createPL(urlPostPL, body, header);
  await delay(500);

  await page.goBack();
  await page.reload();
  await delay(500);

  await page.screenshot({
    path: `./screenshot/5listOfPaymentLinkssetelahcreate.jpeg`,
    type: "jpeg",
  });
  await page.click(
    "#main-container > div > div > div:nth-child(2) > div > table > tbody > tr:nth-child(1) > td:nth-child(1) > a > span"
  );
  await page.screenshot({
    path: `./screenshot/6detailpaymentlink.jpeg`,
    type: "jpeg",
  });

  await delay(1000);
}