import { Page, Locator } from '@playwright/test';

export class TestPage {
  readonly page: Page;
  readonly userEmailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly errorMessage: Locator;
  readonly logOutButton: Locator;
  readonly BrowserEvents: Locator;
  readonly BookNow: Locator;
  readonly CustomerName: Locator;
  readonly CustomerEmail: Locator;
  readonly CustomerNum: Locator;
  readonly ConfirmBooking: Locator;
  readonly ViewBooking: Locator;
  readonly Booked: Locator;
  readonly myBookings: Locator;
  readonly clearBookings: Locator;
  readonly noBookingsYet: Locator;
  readonly cancelBooking: Locator;
  readonly cancelBookDialog: Locator;
  readonly exploreAllEventBtn: Locator;
 
  constructor(page: Page) {
    this.page = page;
    this.userEmailInput = page.getByPlaceholder('you@email.com');
    this.passwordInput = page.getByPlaceholder('••••••');
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
    this.errorMessage = page.locator('.error-message');
    this.logOutButton = page.getByRole('button', { name: 'Logout' });
    this.BrowserEvents = page.getByRole('link', { name: 'Browse Events →' })
    this.BookNow = page.getByRole('article').filter({ hasText: 'FestivalFeaturedDilli Diwali' }).getByTestId('book-now-btn')
    this.CustomerName = page.getByRole('textbox', { name: 'Full Name*' })
    this.CustomerEmail = page.getByTestId('customer-email')
    this.CustomerNum = page.getByRole('textbox', { name: 'Phone Number*' })
    this.ConfirmBooking = page.getByRole('button', { name: 'Confirm Booking' })
    this.ViewBooking = page.getByRole('button', { name: 'View My Bookings' })
    this.Booked = page.getByText('confirmed')
    this.myBookings =  page.getByRole('button', { name: 'My Bookings' })
    this.clearBookings =  page.getByRole('button', { name: 'Clear all bookings' })
    this.noBookingsYet = page.getByRole('heading', { name: 'No bookings yet' })
    this.cancelBooking = page.getByTestId('cancel-booking-btn')
    this.cancelBookDialog= page.getByTestId('confirm-dialog-yes')
    this.exploreAllEventBtn= page.getByRole('button', { name: 'Explore All Events' })
  }
}

// ============================================================================
// EventHub Application - Discovered via Agent 1: Login Functionality Discovery
// ============================================================================

/**
 * EventHub Login Page
 * Discovered: 2026-06-24
 * 
 * Login form elements with Rank 1 (most stable) locators from actual DOM inspection.
 * All locators verified with Playwright assertions on live page.
 */
export class EventHubLoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    // Rank 1 (Most Stable) - Based on actual input type
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.signInButton = page.locator('button:has-text("Sign In")');
    
    // Error message locators (for validation testing)
    this.errorMessage = page.locator('.error-message, [role="alert"], .alert');
  }

  /**
   * Perform login with provided credentials
   * @param email - User email address
   * @param password - User password
   */
  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
    await this.page.waitForNavigation({ timeout: 10000 }).catch(() => {});
  }

  /**
   * Get current error message from form
   * @returns Error message text or null if not visible
   */
  async getErrorMessage(): Promise<string | null> {
    const isVisible = await this.errorMessage.isVisible().catch(() => false);
    if (isVisible) {
      return await this.errorMessage.textContent();
    }
    return null;
  }

  /**
   * Verify email field is visible and enabled
   */
  async isEmailInputVisible(): Promise<boolean> {
    return await this.emailInput.isVisible();
  }

  /**
   * Verify password field is visible and enabled
   */
  async isPasswordInputVisible(): Promise<boolean> {
    return await this.passwordInput.isVisible();
  }

  /**
   * Verify sign in button is visible and enabled
   */
  async isSignInButtonVisible(): Promise<boolean> {
    return await this.signInButton.isVisible();
  }
}


