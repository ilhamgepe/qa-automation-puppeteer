import type { Page } from "puppeteer";

export default async function formInput(
  page: Page,
  selector: string,
  value: string
) {
  await page.type(selector, value).catch((e: Error) => {
    throw new Error("gagal mengisi form :" + e);
  });
}
