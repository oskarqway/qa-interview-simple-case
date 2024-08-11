import { test, expect } from '@playwright/test'
import { PayloadRegisterAccount, registerAccountFill } from '../../test-helpers/register';
import { loginFill } from '../../test-helpers/login';

test.describe("Register", () => {
   // We could also use faker to generate random data
   
   test.beforeEach(async ({ page }) => {
      await page.goto("/signup")
      await expect(page.locator("h2")).toHaveText("Become a member")
   });

   test("Register a user", { tag: "@integration" }, async ({ page }) => {
      let payload: PayloadRegisterAccount = {
         firstName: "oskar",
         lastName: "test",
         email: "oskar@test.com",
         password: "oskar123123"
      }  

      await registerAccountFill(page, payload)
      await page.getByRole("button", { name: "Submit" }).click();

      // Verify that the user is logged in
      await expect(page.getByRole("button", { name: "log out" })).toBeVisible();
      await expect(
         page.getByText(`Welcome ${payload.firstName} ${payload.lastName}`)
      ).toBeVisible();

      // Expect our user to exist in database (localstorage)
      let ls = await page.evaluate(() => localStorage.getItem("users"))
      let parse:JSON = JSON.parse(ls!)
      expect(parse["users"]).toEqual(expect.arrayContaining([payload]))
   });

   test("Password requirement not fulfilled", { tag: "@functional" }, async ({ page }) => {
      let payload: PayloadRegisterAccount = {
         firstName: "oskar",
         lastName: "test",
         email: "oskar@test.com",
         password: "oskar"
      }

      await registerAccountFill(page, payload)
      await expect(page.getByRole("button", { name: "Submit" })).toBeDisabled();
   })

   test("Register and login", { tag: "@e2e" }, async ({ page }) => {
      let payload: PayloadRegisterAccount = {
         firstName: "oskar2",
         lastName: "test2",
         email: "oskar2@test.com",
         password: "oskar123123"
      }

      await test.step("Register account", async () => {
         await registerAccountFill(page, payload)
         await page.getByRole("button", { name: "Submit" }).click();

         await expect(page.getByRole("button", { name: "log out" })).toBeVisible();
         await expect(page.getByText(`Welcome ${payload.firstName} ${payload.lastName}`)).toBeVisible();

         await page.getByRole("button", { name: "log out" }).click();
         await expect(page).toHaveURL(/login$/)
      })
       
      await test.step("login to newly registerd account", async () => {
         await loginFill(page, payload.email, payload.password) 

         // Submit button
         await page.getByRole('button', { name: "Login"}).click()

         // Verify that user i logged in 
         await expect(page.getByText('Log out')).toBeVisible()
         await expect(page.getByText(`Welcome ${payload.firstName} ${payload.lastName}`)).toBeVisible();
      });
   });
});

