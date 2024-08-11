import { Page } from "@playwright/test";

export type PayloadRegisterAccount = {
   firstName: string;
   lastName: string;
   email: string;
   password: string;
}

export async function registerAccountFill(page: Page, payload: PayloadRegisterAccount) {
   await page.locator("#firstName").fill(payload.firstName);
   await page.locator("#lastName").fill(payload.lastName);
   await page.locator("#email").fill(payload.email);
   await page.locator("#password").fill(payload.password);
}