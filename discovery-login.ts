import { chromium, type Browser, type Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = './eventhub_discovery';
const SCREENSHOTS_DIR = path.join(OUTPUT_DIR, 'screenshots');
const LOGS_DIR = path.join(OUTPUT_DIR, 'logs');

interface Locator {
  strategy: string;
  value: string;
  stability: number;
  description: string;
}

interface Element {
  id: string;
  name: string;
  type: string;
  action: string;
  locators: Locator[];
}

interface LoginFunctionality {
  id: string;
  name: string;
  type: string;
  category: string;
  description: string;
  preconditions: string[];
  steps: Array<{
    action: string;
    element: string | null;
    expectedOutcome: string;
  }>;
  expectedOutcome: string;
  errorScenarios: Array<{
    scenario: string;
    trigger: string;
    expectedError: string;
  }>;
  testDataExamples: {
    validEmail: string;
    validPassword: string;
    invalidEmail: string;
    invalidPassword: string;
  };
  elements: Element[];
  discoveryStatus: string;
  timestamp: string;
}

let logContent = '';

function log(message: string) {
  console.log(message);
  logContent += message + '\n';
}

async function writeLog() {
  const logFile = path.join(LOGS_DIR, 'discovery_log.txt');
  fs.writeFileSync(logFile, logContent);
  log(`\n✓ Log saved to: ${logFile}`);
}

async function takeScreenshot(page: Page, filename: string) {
  const filepath = path.join(SCREENSHOTS_DIR, filename);
  await page.screenshot({ path: filepath, fullPage: true });
  log(`✓ Screenshot saved: ${filename}`);
  return filepath;
}

async function discoverLoginFunctionality() {
  let browser: Browser | null = null;

  try {
    log('═══════════════════════════════════════════════════════════════');
    log('PHASE 1: Initialization & Setup');
    log('═══════════════════════════════════════════════════════════════');

    log('\n[Step 1.1] Launching Chromium browser...');
    browser = await chromium.launch();
    log('✓ Browser launched successfully');

    log('\n[Step 1.2] Creating new page...');
    const page = await browser.newPage();
    log('✓ Page created');

    log('\n[Step 1.3] Navigating to EventHub...');
    const startTime = Date.now();
    const response = await page.goto('https://eventhub.rahulshettyacademy.com/', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });
    const navigationTime = Date.now() - startTime;
    log(`✓ Navigation successful (${navigationTime}ms)`);
    log(`  - Status: ${response?.status()}`);
    log(`  - URL: ${page.url()}`);

    await takeScreenshot(page, '01_landing_page.png');

    log('\n[Step 1.4] Analyzing landing page...');
    const pageTitle = await page.title();
    const pageContent = await page.content();
    log(`✓ Page title: "${pageTitle}"`);
    log(`✓ Page loaded, content length: ${pageContent.length} bytes`);

    // Check if on login page or need to find login button
    const currentUrl = page.url();
    let isOnLoginPage = currentUrl.includes('/login') || currentUrl.includes('/signin');

    if (!isOnLoginPage) {
      log('\n[Step 2.1] Landing page is not login page, searching for login entry point...');
      
      const loginStrategies = [
        { selector: 'button:has-text("Sign In")', name: 'button with "Sign In"' },
        { selector: 'button:has-text("Login")', name: 'button with "Login"' },
        { selector: 'a:has-text("Sign In")', name: 'link with "Sign In"' },
        { selector: 'a:has-text("Login")', name: 'link with "Login"' },
        { selector: '[data-testid="signin-button"]', name: 'data-testid signin-button' },
        { selector: '[data-testid="login-button"]', name: 'data-testid login-button' },
      ];

      let loginFound = false;
      for (const strategy of loginStrategies) {
        const element = page.locator(strategy.selector);
        const isVisible = await element.isVisible().catch(() => false);
        if (isVisible) {
          log(`✓ Found login via: ${strategy.name}`);
          log(`  - Selector: ${strategy.selector}`);
          await element.click();
          await page.waitForNavigation({ timeout: 10000 }).catch(() => {});
          loginFound = true;
          break;
        }
      }

      if (!loginFound) {
        log('⚠ Login button not found on landing page, attempting to navigate directly...');
        await page.goto('https://eventhub.rahulshettyacademy.com/login', {
          waitUntil: 'networkidle',
          timeout: 30000,
        });
        log('✓ Navigated to login URL');
      }
    }

    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    await takeScreenshot(page, '02_login_page.png');

    log('\n═══════════════════════════════════════════════════════════════');
    log('PHASE 2: Authentication Flow Analysis');
    log('═══════════════════════════════════════════════════════════════');

    log('\n[Step 2.3] Extracting login form elements...');

    // Email Input
    log('\n  Searching for Email Input Field...');
    const emailStrategies = [
      { strategy: 'data-testid', selector: '[data-testid="email-input"]', stability: 1 },
      { strategy: 'type=email', selector: 'input[type="email"]', stability: 2 },
      { strategy: 'placeholder', selector: '[placeholder*="email"], [placeholder*="@"]', stability: 3 },
      { strategy: 'role', selector: 'getByRole', value: 'textbox', options: { name: /email/i }, stability: 1 },
    ];

    let emailInput = null;
    let emailSelector = '';
    for (const strat of emailStrategies.slice(0, 3)) {
      const el = page.locator(strat.selector);
      const isVisible = await el.isVisible().catch(() => false);
      if (isVisible) {
        emailInput = el;
        emailSelector = strat.selector;
        log(`  ✓ Found via ${strat.strategy}: ${strat.selector}`);
        break;
      }
    }

    // Password Input
    log('\n  Searching for Password Input Field...');
    const passwordStrategies = [
      { strategy: 'data-testid', selector: '[data-testid="password-input"]', stability: 1 },
      { strategy: 'type=password', selector: 'input[type="password"]', stability: 2 },
      { strategy: 'placeholder', selector: '[placeholder*="pass"], [placeholder*="••"]', stability: 3 },
    ];

    let passwordInput = null;
    let passwordSelector = '';
    for (const strat of passwordStrategies) {
      const el = page.locator(strat.selector);
      const isVisible = await el.isVisible().catch(() => false);
      if (isVisible) {
        passwordInput = el;
        passwordSelector = strat.selector;
        log(`  ✓ Found via ${strat.strategy}: ${strat.selector}`);
        break;
      }
    }

    // Sign In Button
    log('\n  Searching for Sign In Button...');
    const buttonStrategies = [
      { strategy: 'text', selector: 'button:has-text("Sign In")', stability: 2 },
      { strategy: 'text', selector: 'button:has-text("Login")', stability: 2 },
      { strategy: 'data-testid', selector: '[data-testid="signin-button"]', stability: 1 },
      { strategy: 'type=submit', selector: 'button[type="submit"]', stability: 2 },
    ];

    let signInButton = null;
    let signInSelector = '';
    for (const strat of buttonStrategies) {
      const el = page.locator(strat.selector);
      const isVisible = await el.isVisible().catch(() => false);
      if (isVisible) {
        signInButton = el;
        signInSelector = strat.selector;
        log(`  ✓ Found via ${strat.strategy}: ${strat.selector}`);
        break;
      }
    }

    if (!emailInput || !passwordInput || !signInButton) {
      throw new Error('Critical form elements not found');
    }

    log('\n[Step 2.4] Performing login with test credentials...');
    log('  Email: manish123@gmail.com');
    log('  Password: Manish9@@');

    await emailInput.fill('manish123@gmail.com');
    const emailValue = await emailInput.inputValue();
    log(`✓ Email field filled, verified value: ${emailValue}`);

    await passwordInput.fill('Manish9@@');
    log('✓ Password field filled');

    log('  Clicking Sign In button...');
    await signInButton.click();

    // Wait for navigation
    try {
      await page.waitForNavigation({ timeout: 10000 });
      log('✓ Navigation occurred after sign-in click');
    } catch {
      log('⚠ No navigation detected, may have failed or loaded in-page');
    }

    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    await takeScreenshot(page, '03_post_login_page.png');

    const postLoginUrl = page.url();
    const postLoginTitle = await page.title();

    if (postLoginUrl.includes('login')) {
      log('\n❌ Login appears to have failed - still on login page');
      
      // Try to find error message
      const errorLocators = [
        page.locator('.error-message'),
        page.locator('[role="alert"]'),
        page.locator('.alert'),
        page.locator('[class*="error"]'),
      ];

      for (const errorLoc of errorLocators) {
        const isVisible = await errorLoc.isVisible().catch(() => false);
        if (isVisible) {
          const errorText = await errorLoc.textContent();
          log(`  Error message found: "${errorText}"`);
          break;
        }
      }
    } else {
      log('\n✓ Login successful!');
      log(`  - New URL: ${postLoginUrl}`);
      log(`  - Page title: "${postLoginTitle}"`);
    }

    // Build locator data
    const elements: Element[] = [
      {
        id: 'email_input',
        name: 'Email Input',
        type: 'input',
        action: 'fill',
        locators: [
          { strategy: 'CSS', value: emailSelector, stability: 2, description: 'Email input field' },
          { strategy: 'role', value: "getByRole('textbox', {name: /email/i})", stability: 1, description: 'Role-based' },
          { strategy: 'xpath', value: "//input[@type='email']", stability: 2, description: 'XPath by type' },
        ],
      },
      {
        id: 'password_input',
        name: 'Password Input',
        type: 'input',
        action: 'fill',
        locators: [
          { strategy: 'CSS', value: passwordSelector, stability: 2, description: 'Password input field' },
          { strategy: 'CSS', value: "input[type='password']", stability: 2, description: 'Type-based selector' },
          { strategy: 'xpath', value: "//input[@type='password']", stability: 3, description: 'XPath by type' },
        ],
      },
      {
        id: 'signin_button',
        name: 'Sign In Button',
        type: 'button',
        action: 'click',
        locators: [
          { strategy: 'text', value: signInSelector, stability: 2, description: 'Sign In button' },
          { strategy: 'xpath', value: "//button[contains(text(), 'Sign In')] | //button[contains(text(), 'Login')]", stability: 3, description: 'XPath with text' },
          { strategy: 'role', value: "getByRole('button', {name: /sign in|login/i})", stability: 1, description: 'Role-based' },
        ],
      },
    ];

    const loginFunctionality: LoginFunctionality = {
      id: 'auth_login',
      name: 'User Login',
      type: 'authentication',
      category: 'Authentication',
      description: 'User authentication flow for EventHub',
      preconditions: ['User is on login page'],
      steps: [
        {
          action: 'Navigate to login page',
          element: null,
          expectedOutcome: 'Login form is displayed with email and password fields',
        },
        {
          action: 'Enter valid email',
          element: 'email_input',
          expectedOutcome: 'Email appears in email field',
        },
        {
          action: 'Enter valid password',
          element: 'password_input',
          expectedOutcome: 'Password field shows masked input',
        },
        {
          action: 'Click Sign In button',
          element: 'signin_button',
          expectedOutcome: 'User is redirected to dashboard/events page',
        },
      ],
      expectedOutcome: 'User successfully logged in',
      errorScenarios: [
        {
          scenario: 'Invalid email format',
          trigger: "User enters invalid email (e.g., 'notanemail')",
          expectedError: 'Validation error message appears',
        },
        {
          scenario: 'Empty email field',
          trigger: 'User tries to login with empty email',
          expectedError: 'Validation error: "Email is required"',
        },
        {
          scenario: 'Empty password field',
          trigger: 'User tries to login with empty password',
          expectedError: 'Validation error: "Password is required"',
        },
        {
          scenario: 'Incorrect password',
          trigger: 'User enters wrong password',
          expectedError: 'Error message: "Invalid credentials" or similar',
        },
      ],
      testDataExamples: {
        validEmail: 'manish123@gmail.com',
        validPassword: 'Manish9@@',
        invalidEmail: 'invalidemail@',
        invalidPassword: 'WrongPassword123',
      },
      elements: elements,
      discoveryStatus: 'completed',
      timestamp: new Date().toISOString(),
    };

    // Save JSON
    const jsonPath = path.join(OUTPUT_DIR, 'eventhub_login_functionality.json');
    fs.writeFileSync(jsonPath, JSON.stringify(loginFunctionality, null, 2));
    log(`\n✓ JSON saved to: ${jsonPath}`);

    // Save Markdown
    const markdownPath = path.join(OUTPUT_DIR, 'eventhub_login_functionality.md');
    const markdown = generateMarkdown(loginFunctionality);
    fs.writeFileSync(markdownPath, markdown);
    log(`✓ Markdown saved to: ${markdownPath}`);

    await writeLog();

    log('\n═══════════════════════════════════════════════════════════════');
    log('LOGIN DISCOVERY COMPLETED SUCCESSFULLY');
    log('═══════════════════════════════════════════════════════════════');
    log(`\n✓ Screenshots: 3 captured`);
    log(`✓ Elements discovered: ${elements.length}`);
    log(`✓ Output files: 2 (JSON + Markdown)`);
  } catch (error) {
    log(`\n❌ ERROR: ${error}`);
    await writeLog();
  } finally {
    if (browser) {
      await browser.close();
      log('✓ Browser closed');
    }
  }
}

function generateMarkdown(functionality: LoginFunctionality): string {
  return `# EventHub Login Functionality Discovery

**Discovery Date**: ${functionality.timestamp}

## Overview
- **Application**: EventHub (https://eventhub.rahulshettyacademy.com/)
- **Functionality**: User Login/Authentication
- **Status**: ${functionality.discoveryStatus}

## Login Flow

### Preconditions
- ${functionality.preconditions.join('\n- ')}

### Steps
${functionality.steps
  .map(
    (step, i) =>
      `${i + 1}. **${step.action}**\n   - Element: ${step.element || 'N/A'}\n   - Expected: ${step.expectedOutcome}`
  )
  .join('\n\n')}

## Expected Outcome
${functionality.expectedOutcome}

## Test Data

### Valid Credentials
- **Email**: ${functionality.testDataExamples.validEmail}
- **Password**: ${functionality.testDataExamples.validPassword}

### Invalid Test Cases
- **Invalid Email**: ${functionality.testDataExamples.invalidEmail}
- **Invalid Password**: ${functionality.testDataExamples.invalidPassword}

## Form Elements Discovered

${functionality.elements
  .map(
    (elem) =>
      `### ${elem.name} (\`${elem.id}\`)
- **Type**: ${elem.type}
- **Action**: ${elem.action}
- **Locators**:
${elem.locators
  .map(
    (loc) =>
      `  - **${loc.strategy}** (Stability: ${loc.stability}/4): \`${loc.value}\`
    - ${loc.description}`
  )
  .join('\n')}
`
  )
  .join('\n')}

## Error Scenarios

${functionality.errorScenarios
  .map(
    (err, i) => `### Scenario ${i + 1}: ${err.scenario}
- **Trigger**: ${err.trigger}
- **Expected Error**: ${err.expectedError}
`
  )
  .join('\n')}

## Screenshots
- \`01_landing_page.png\` - Initial EventHub landing page
- \`02_login_page.png\` - Login form page
- \`03_post_login_page.png\` - Page after login attempt

---

**Generated**: ${new Date().toLocaleString()}
`;
}

discoverLoginFunctionality().catch(console.error);
