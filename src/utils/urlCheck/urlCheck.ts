import { Page } from "puppeteer";
export async function urlCheck(page: Page, expectUrl: string, step: string) {
  if (page.url() != expectUrl)
    throw new Error("direct tidak sesuai flow :" + step);
  return true;
}

export async function urlCheckIncludes(page: Page, url: string, step: string) {
  if (!page.url().includes(url))
    throw new Error(`direct tidak sesuai flow : ${step}`);
  return true;
}
