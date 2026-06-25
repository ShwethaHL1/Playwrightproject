Feature: EventHub Login Functionality

  Background:
    Given I navigate to the EventHub login page
    And the login page has loaded successfully

  @eventhub @authentication @smoke @valid_data
  Scenario: User successfully logs in with valid credentials
    Given I am on the login page
    And the email input field is visible
    And the password input field is visible
    And the "Sign In" button is visible
    When I enter email "manish123@gmail.com"
    And I enter password "Manish9@@"
    And I click the "Sign In" button
    Then I should be redirected to the EventHub dashboard
    And the login page should no longer be displayed
    And I should see the logout button

  @eventhub @authentication @regression @invalid_data
  Scenario: Login fails with invalid email format
    Given I am on the login page
    And the email input field is visible
    And the password input field is visible
    When I enter email "invalidemail@"
    And I enter password "Manish9@@"
    And I click the "Sign In" button
    Then an error message should be displayed
    And the error message should contain "valid email" or "invalid"
    And I should remain on the login page
    And the email field should retain focus

  @eventhub @authentication @regression @boundary
  Scenario: Login fails when email field is empty
    Given I am on the login page
    And the email input field is visible
    And the password input field is visible
    When I leave the email field empty
    And I enter password "Manish9@@"
    And I click the "Sign In" button
    Then an error message should be displayed
    And the error message should contain "valid email" or "Password must be"
    And I should remain on the login page
    And the Sign In button should be disabled or an error should show
