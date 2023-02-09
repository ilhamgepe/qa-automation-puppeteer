import { Browser, Page } from "puppeteer";
import { success } from "../step/logs";
import { delay } from "../times/time";
import counter from "./channels/counter";
import creditCard from "./channels/creditCard";
import eWallet from "./channels/eWallet";
import paylater from "./channels/paylater";
import qris from "./channels/qris";
import virtualAccount from "./channels/virtualAccount";

export default async function createChannel(page: Page, browser: Browser) {
  //create cc
  await creditCard(page);
  await delay(1000);
  success("test create credit card selesai");

  // // create VA
  await virtualAccount(page);
  success("test create VA selesai");
  await delay(1000);

  // // create wallet

  await eWallet(page, browser);
  success("test create ewallet selesai");
  await delay(1000);

  // create qris
  await qris(page);
  success("test create qris selesai");
  await delay(1000);

  // create counter
  await counter(page);
  success("test create counter selesai");
  await delay(1000);

  // create paylater
  await paylater(page);
  success("test create paylater selesai");
  await delay(1000);

  await page.close();
}
