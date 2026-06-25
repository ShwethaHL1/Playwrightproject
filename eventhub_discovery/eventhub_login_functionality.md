# EventHub Login Functionality Discovery

**Discovery Date**: 2026-06-24T05:38:45.250Z

## Overview
- **Application**: EventHub (https://eventhub.rahulshettyacademy.com/)
- **Functionality**: User Login/Authentication
- **Status**: completed

## Login Flow

### Preconditions
- User is on login page

### Steps
1. **Navigate to login page**
   - Element: N/A
   - Expected: Login form is displayed with email and password fields

2. **Enter valid email**
   - Element: email_input
   - Expected: Email appears in email field

3. **Enter valid password**
   - Element: password_input
   - Expected: Password field shows masked input

4. **Click Sign In button**
   - Element: signin_button
   - Expected: User is redirected to dashboard/events page

## Expected Outcome
User successfully logged in

## Test Data

### Valid Credentials
- **Email**: manish123@gmail.com
- **Password**: Manish9@@

### Invalid Test Cases
- **Invalid Email**: invalidemail@
- **Invalid Password**: WrongPassword123

## Form Elements Discovered

### Email Input (`email_input`)
- **Type**: input
- **Action**: fill
- **Locators**:
  - **CSS** (Stability: 2/4): `input[type="email"]`
    - Email input field
  - **role** (Stability: 1/4): `getByRole('textbox', {name: /email/i})`
    - Role-based
  - **xpath** (Stability: 2/4): `//input[@type='email']`
    - XPath by type

### Password Input (`password_input`)
- **Type**: input
- **Action**: fill
- **Locators**:
  - **CSS** (Stability: 2/4): `input[type="password"]`
    - Password input field
  - **CSS** (Stability: 2/4): `input[type='password']`
    - Type-based selector
  - **xpath** (Stability: 3/4): `//input[@type='password']`
    - XPath by type

### Sign In Button (`signin_button`)
- **Type**: button
- **Action**: click
- **Locators**:
  - **text** (Stability: 2/4): `button:has-text("Sign In")`
    - Sign In button
  - **xpath** (Stability: 3/4): `//button[contains(text(), 'Sign In')] | //button[contains(text(), 'Login')]`
    - XPath with text
  - **role** (Stability: 1/4): `getByRole('button', {name: /sign in|login/i})`
    - Role-based


## Error Scenarios

### Scenario 1: Invalid email format
- **Trigger**: User enters invalid email (e.g., 'notanemail')
- **Expected Error**: Validation error message appears

### Scenario 2: Empty email field
- **Trigger**: User tries to login with empty email
- **Expected Error**: Validation error: "Email is required"

### Scenario 3: Empty password field
- **Trigger**: User tries to login with empty password
- **Expected Error**: Validation error: "Password is required"

### Scenario 4: Incorrect password
- **Trigger**: User enters wrong password
- **Expected Error**: Error message: "Invalid credentials" or similar


## Screenshots
- `01_landing_page.png` - Initial EventHub landing page
- `02_login_page.png` - Login form page
- `03_post_login_page.png` - Page after login attempt

---

**Generated**: 24/6/2026, 11:08:45 am
