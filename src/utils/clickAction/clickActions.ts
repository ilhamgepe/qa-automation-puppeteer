import { Page } from "puppeteer";
export async function clickByHref(page: Page, href: string) {
  try {
    const elemen = await page.$(`[href="${href}"]`);
    await elemen?.click({ delay: 1000 });
  } catch (error) {
    const message = `gagal mendapatkan link ${href}, error: ${error}`;
    throw new Error(message);
  }
}

export async function clickBySelector(page: Page, selector: string) {
  try {
    await page.click(selector);
  } catch (error) {
    throw new Error("gaga click by attribut" + error);
  }
}
