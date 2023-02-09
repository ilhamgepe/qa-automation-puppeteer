import moment from "moment";
import { Page } from "puppeteer";
import { clickByHref } from "../utils/clickAction/clickActions";
import createPL from "../utils/paymentlink/createPL";
import { success } from "../utils/step/logs";
import { delay } from "../utils/times/time";
import { urlCheck } from "../utils/urlCheck/urlCheck";

const currentTime: string = moment().format("YYYY-MM-DD HH:mm");
const expires_at: string = moment().add(3, "hour").format("YYYY-MM-DD HH:mm");
export default async function paymentlink(page: Page) {
  // click paymentlink
  await clickByHref(page, "https://purwantara.id/payment-links");
  await delay(1000);
  await page.screenshot({
    path: `./screenshot/4listOfPaymentLinks.jpeg`,
    type: "jpeg",
  });
  success("berhasil membuka list paymentlink");

  // click button create
  await clickByHref(page, "https://purwantara.id/payment-links/create");
  await delay(500);
  urlCheck(
    page,
    "https://purwantara.id/payment-links/create",
    "at click button create paymentlink"
  );
  success("berhasil membuka create paymentlink");

  // ambil token csrf
  const tokenCSRF: string = await page.$eval("input[name=_token]", (el: any) =>
    el.getAttribute("value")
  );
  success("berhasil ambil token csrf");

  // ambil cookies
  const getCookie = await page.cookies();
  const [secureCookies, xsrf] = getCookie.map((cookie) => {
    return cookie.value;
  });
  success("berhasil ambil cookies");

  //   ambil url post paymentlink
  const urlPostPL: string | null = await page.$eval(
    "#main-container > div > form",
    (el) => el.getAttribute("action")
  );
  success("berhasil ambil url post data paymentlink");

  const body = {
    title: `automation ${currentTime ?? currentTime}`,
    amount: 10000,
    expires_at: expires_at,
    description: `automation ${currentTime ?? currentTime}`,
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
