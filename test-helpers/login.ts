import { Page } from "@playwright/test"

export async function loginFill(page: Page,email: string, password: string) {
   await page
      .locator('#email')
      .fill(email)

    await page
      .locator('#password')
      .fill(password)
}