Feature: Login

  Scenario: User opens login page
    Given I open the login page
    Then the page title should contain "Login" 

@test
  Scenario: User creates booking
    Given user login into the app
    Then the page title should contain "EventHub — Discover & Book Events"          