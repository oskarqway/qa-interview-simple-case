import { test, expect } from '@playwright/test'
import { existingUsers } from '../../test-setup/localstorage.setup'
import { loginFill } from '../../test-helpers/login'

// Serial is not needed in this test, better to use parallel runs if possible
// test.describe.configure({ mode: 'serial' })

test.describe('login form tests', () => {
  test('logging in works with existing account', async ({ page }) => {
    await page.goto('/login')

    const existingUser = existingUsers[0] // this works but we might want to select a user by email to make the code more comprehensible, or randomize the user depending on what we want to achieve.

    await loginFill(page, existingUser.email, existingUser.password)

    await page.getByRole('button', { name: "Login"}).click()

    await expect(page.getByText('Log out')).toBeVisible()
    await expect(page.getByText(`Welcome ${existingUser.firstName} ${existingUser.lastName}`)).toBeVisible();
  })
})

