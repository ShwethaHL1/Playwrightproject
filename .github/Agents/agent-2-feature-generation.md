# Agent 2: Feature File Generation & Gherkin Scenario Creation

**Status**: Agent Configuration  
**Version**: 1.0  
**Input**: {domain}_functionalities.json + {domain}_functionalities.md (from Agent 1)  
**Output Files**: features/test.feature, Gherkin validation report, Coverage analysis  

---

## CRITICAL: Anti-Hallucination Instructions

**⚠️ READ CAREFULLY: This agent generates ONLY what Agent 1 discovered.**

### What This Agent MUST Do
1. **READ THE JSON INPUT** — Use exact functionalities and elements from Agent 1 output
2. **GENERATE REALISTIC SCENARIOS** — Base all scenarios on real discovered workflows
3. **USE REAL TEST DATA** — Only use example data provided in JSON (e.g., valid email, password format)
4. **VALIDATE GHERKIN SYNTAX** — Ensure each scenario is valid Cucumber/Gherkin format
5. **MAINTAIN INDEPENDENCE** — Each scenario must be runnable in isolation (no dependencies)
6. **TRACK COVERAGE** — Verify all functionalities have at least one scenario
7. **ASK FOR CLARIFICATION** — If JSON is missing required data, ask user before proceeding

### What This Agent MUST NOT Do
- ❌ Assume UI elements or workflows not documented in JSON
- ❌ Generate scenarios for features not discovered by Agent 1
- ❌ Use hardcoded test data not provided in JSON
- ❌ Create scenarios with missing page object references
- ❌ Skip Gherkin syntax validation
- ❌ Generate scenarios with implicit assumptions about user behavior
- ❌ Reference steps that haven't been defined yet

---

## Agent 2 Execution Plan

### PHASE 1: Initialization & Input Validation

**Step 1.1: Load and Parse Input JSON & Markdown**
```
1. Locate BOTH files from Agent 1 output:
   - {domain}_functionalities.json (structured data)
   - {domain}_functionalities.md (human-readable documentation)
2. Parse JSON with jq or native parser
3. Parse Markdown file to cross-reference functionality descriptions
4. VERIFY JSON structure:
   - url: present and valid URL
   - discoveredAt: valid ISO timestamp
   - authRequired: boolean
   - authType: string (email_password, oauth, etc.)
   - pagesDiscovered: array of page names
   - functionalities: array of objects with:
     * id: unique identifier
     * name: functionality name
     * type: string (authentication, form_submission, navigation, etc.)
     * category: string (Authentication, User Management, etc.)
     * description: string describing the functionality
     * preconditions: array of strings
     * steps: array of action objects
     * expectedOutcome: string describing final state
     * errorScenarios: array of error objects
     * testDataExamples: object with valid/invalid examples
     * elements: array of discovered elements with locators

4. If validation fails: STOP and report missing fields
5. RECORD: Parsed data and validation status
```

**Step 1.2: Create Output Directory Structure**
```
1. Create directory: ./features/ (if not exists)
2. Create output files:
   - features/test.feature (Gherkin scenarios - consolidated)
   - test_scenarios_summary.txt (statistics)
   - test_coverage_report.txt (functionality coverage)
   - test_scenario_validation_log.txt (validation details)
```

**Step 1.3: Extract Key Information**
```
From JSON and Markdown, extract:
1. Domain name (from JSON url or parameter)
2. Application name (from Markdown title)
3. Authentication required? (from authRequired field)
4. Authentication type (from authType field)
5. All pages: [extract from pagesDiscovered]
6. All functionalities: [extract list with descriptions from both files]
7. Test data examples: [valid credentials, email formats, etc.]
8. Error scenarios: [extract all documented error cases]
9. Screenshots: [list of captured screenshots for reference]

CROSS-REFERENCE: Verify JSON functionalities match Markdown documentation
RECORD: All extracted information from both sources
```

---

### PHASE 2: Scenario Generation

**Step 2.1: Create Feature File Header (test.feature)**
```
File: features/test.feature

Feature file should start with:
```
Feature: Consolidated Application Testing

  Background:
    Given I navigate to the application
    And the application has loaded successfully
    And the necessary cookies are accepted
```

RECORD: Feature file header created for consolidated test.feature
```

**Step 2.2: Generate Authentication Scenarios (if authRequired = true)**
```
If authRequired = true:

Scenario 1: Successful Login - Happy Path
  Given I am on the login page
  And the email input field is visible
  And the password input field is visible
  And the "Sign In" button is visible
  When I enter email "{valid_email_from_json}"
  And I enter password "{valid_password_from_json}"
  And I click the "Sign In" button
  Then I should be redirected to the dashboard/home page
  And I should see the logout button
  And the login error should not be displayed

Scenario 2: Login Fails - Invalid Email Format
  Given I am on the login page
  When I enter email "{invalid_email_format}"
  And I enter password "{valid_password_from_json}"
  And I click the "Sign In" button
  Then an error message should be displayed
  And the error message should contain "invalid email" or "valid email" (case-insensitive)
  And I should remain on the login page

Scenario 3: Login Fails - Empty Email Field
  Given I am on the login page
  When I clear the email field
  And I enter password "{valid_password_from_json}"
  And I click the "Sign In" button
  Then an error message should be displayed
  And the error message should indicate email is required
  And I should remain on the login page

Scenario 4: Login Fails - Empty Password Field
  Given I am on the login page
  When I enter email "{valid_email_from_json}"
  And I clear the password field
  And I click the "Sign In" button
  Then an error message should be displayed
  And the error message should indicate password is required
  And I should remain on the login page

Scenario 5: Login Fails - Incorrect Password
  Given I am on the login page
  When I enter email "{valid_email_from_json}"
  And I enter password "{incorrect_password_from_json}"
  And I click the "Sign In" button
  Then an error message should be displayed
  And the error message should contain "invalid credentials" or "incorrect password"
  And I should remain on the login page

RECORD: All authentication scenarios created
VERIFY: At least 5 authentication scenarios generated (happy path + 4 error paths)
```

**Step 2.3: Generate Scenarios for Each Functionality**
```
For EACH functionality in JSON:
  1. Extract functionality details:
     - name: e.g., "User Registration"
     - type: e.g., "form_submission"
     - steps: array of actions
     - expectedOutcome: final state
     - errorScenarios: array of error cases
     - testDataExamples: valid/invalid examples

  2. Generate Happy Path Scenario:
     Scenario: {Functionality Name} - Happy Path
       Given [preconditions from JSON]
       When [steps from JSON, replaced with real test data]
       Then [expectedOutcome from JSON]

     Example from JSON:
     "name": "Book Event",
     "steps": [
       {"action": "Navigate to event details", "element": "event_card"},
       {"action": "Click book button", "element": "book_button"},
       {"action": "Enter number of tickets", "element": "ticket_count", "value": "2"},
       {"action": "Click confirm", "element": "confirm_button"}
     ]
     "expectedOutcome": "Booking confirmed, confirmation page shown"

     Generates:
     Scenario: Book Event - Happy Path
       Given I have successfully logged in
       And I am viewing an event details page
       When I click the "Book Now" button
       And I select "2" tickets
       And I click the "Confirm" button
       Then a booking confirmation page should be displayed
       And I should see the booking reference number

  3. Generate Error Path Scenarios (from errorScenarios in JSON):
     For EACH error scenario in JSON:
       Scenario: {Functionality Name} - {Error Scenario}
         Given [preconditions]
         When [steps that trigger error]
         Then [expected error message or behavior]

     Example:
     "errorScenarios": [
       {
         "scenario": "No tickets available",
         "trigger": "User tries to book more tickets than available",
         "expectedError": "Cannot book more than available tickets"
       }
     ]

     Generates:
     Scenario: Book Event - No tickets available
       Given I have successfully logged in
       And I am viewing an event with only 1 ticket available
       When I click the "Book Now" button
       And I select "5" tickets
       And I click the "Confirm" button
       Then an error message should be displayed
       And the error should indicate insufficient ticket availability
       And the booking should not be processed

  4. RECORD: Number of scenarios generated for this functionality
```

**Step 2.4: Add Scenario Tags**
```
Each scenario should have tags:

Tag Pattern:
  @{domain_name} — identifies the domain/application
  @{functionality_type} — identifies type (auth, form, navigation, etc.)
  @{smoke_or_regression} — smoke for critical paths, regression for edge cases
  @{data_type} — @valid_data, @invalid_data, @boundary_data

Examples:
  @eventhub @authentication @smoke
  @eventhub @event_booking @regression @valid_data
  @eventhub @event_search @regression @invalid_data

RECORD: Tags applied to all scenarios
```

---

### PHASE 3: Scenario Optimization & Validation

**Step 3.1: Gherkin Syntax Validation**
```
For EACH scenario in generated feature file:

1. Check structure:
   - Must start with "Scenario:" or "Scenario Outline:"
   - Must have at least one Given, When, Then step
   - No step should be longer than 120 characters

2. Check step consistency:
   - "Given" steps describe preconditions (state setup)
   - "When" steps describe actions (user interactions)
   - "Then" steps describe outcomes (assertions)
   - "And" steps extend the previous step type

3. Check for undefined steps:
   - Each step must be implementable by step definitions
   - No steps should reference UI elements not in JSON

4. Check for duplicates:
   - No two scenarios should have identical Given/When/Then
   - Allow similar scenarios with different test data

RECORD: Validation results for each scenario
STOP if syntax errors found: Report all violations
```

**Step 3.2: Scenario Independence Check**
```
For EACH scenario:

1. Verify it can run standalone:
   - Background provides common setup
   - Given steps should set up required state (login, page navigation)
   - Should NOT depend on previous scenario outcome

2. Verify test data is self-contained:
   - All data used in When/Then is provided in Given or inline
   - No shared state between scenarios

3. Check for implicit assumptions:
   - Each scenario must explicitly state its preconditions
   - No "magical" setup steps

RECORD: Independence check results
FLAG any scenarios that fail independence check
```

**Step 3.3: Coverage Analysis**
```
Create coverage report:

1. Map scenarios to functionalities:
   For EACH functionality in JSON:
     - Count how many scenarios test it
     - Identify gaps (functionalities with 0 scenarios)

2. Identify coverage:
   - Happy path coverage: ✓/✗
   - Error path coverage: X scenarios
   - Edge case coverage: X scenarios

3. Generate report:
   - Functionality: {name}
     - Happy Path: ✓ (Scenario: "...")
     - Error Paths: 3 scenarios
       - Invalid input scenario
       - Empty field scenario
       - Boundary scenario
     - Coverage: 100% / 80% / partial

4. Flag gaps:
   - Any functionality with 0 scenarios
   - Any functionality with only happy path (no errors)
   - Any functionality with <3 scenarios

RECORD: Coverage report
WARNING: If any functionality has 0 scenarios, ask user for clarification
```

---

### PHASE 4: Generate Summary Reports

**Step 4.1: Create Scenarios Summary Report**
```
File: test_scenarios_summary.txt

Content:
- Domain: {domain}
- Source JSON: {filename}
- Feature File: features/{domain}.feature

## Statistics
- Total Scenarios Generated: X
  - Authentication Scenarios: X
  - Functionality Scenarios: X
  - Error Path Scenarios: X
  - Happy Path Scenarios: X

- Scenarios by Type:
  @smoke: X
  @regression: X
  
- Scenarios by Functionality:
  {functionality_1}: X scenarios
  {functionality_2}: X scenarios
  ...

## Gherkin Validation
- Syntax Errors: 0 / X
- Undefined Steps: 0 / X
- Invalid Scenarios: 0 / X

## Generated Feature File
- Location: features/{domain}.feature
- Size: X lines
- Ready for Agent 3: Yes/No (if No, list issues)
```

**Step 4.2: Create Coverage Report**
```
File: test_coverage_report.txt

Content:
## Functionality Coverage Analysis

Functionality | Happy Path | Error Paths | Total Scenarios | Status
---|---|---|---|---
{func_1} | ✓ | 3 | 4 | ✓ Complete
{func_2} | ✓ | 0 | 1 | ⚠ No error cases
{func_3} | ✗ | 0 | 0 | ✗ Not covered

## Coverage Summary
- Fully Covered: X / X functionalities (X%)
- Partially Covered: X / X functionalities (X%)
- Not Covered: X / X functionalities (X%)

## Gaps Identified
1. {functionality_name} — No error scenarios
2. {functionality_name} — Not covered

## Recommendations
1. Add X more error path scenarios for {func_name}
2. Add edge case scenario for {func_name}
```

**Step 4.3: Create Validation Log**
```
File: test_scenario_validation_log.txt

Content (timestamp each entry):
[2026-06-23T10:30:00Z] VALIDATION STARTED
[2026-06-23T10:30:01Z] Loaded JSON: eventhub_functionalities.json (28 functionalities)
[2026-06-23T10:30:02Z] Validating Authentication... ✓ (5 scenarios)
[2026-06-23T10:30:05Z] Validating Event Browsing... ✓ (3 scenarios)
[2026-06-23T10:30:08Z] Checking Gherkin Syntax...
  ✓ Scenario 1: User Login - Happy Path
  ✓ Scenario 2: User Login - Invalid Email
  ...
[2026-06-23T10:30:45Z] VALIDATION COMPLETE
[2026-06-23T10:30:45Z] Total Scenarios: 24
[2026-06-23T10:30:45Z] Validation Errors: 0
[2026-06-23T10:30:45Z] Ready for Agent 3: YES
```

---

### PHASE 5: User Review & Approval

**Step 5.1: Display Summary**
```
Output to user:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Agent 2 Feature Generation Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Feature File Generated: features/eventhub.feature
Scenarios Created: 24
  - Authentication: 5 scenarios
  - Event Browsing: 3 scenarios
  - Event Booking: 4 scenarios
  - User Profile: 3 scenarios
  - Search/Filter: 2 scenarios
  - Error Handling: 3 scenarios
  - Navigation: 1 scenario

Coverage Analysis:
  ✓ 8/8 functionalities with scenarios
  ✓ 5/5 error scenarios documented
  ✓ All Gherkin syntax valid

Reports Generated:
  - eventhub_scenarios_summary.txt
  - eventhub_coverage_report.txt
  - eventhub_scenario_validation_log.txt

Ready for Agent 3?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Continue? (y/n)
```

**Step 5.2: Display Feature File Preview**
```
Show first 50 lines of generated features/test.feature:

Feature: EventHub Application Testing

  Background:
    Given I navigate to the EventHub application
    And the application has loaded successfully

  @eventhub @authentication @smoke
  Scenario: User successfully logs in with valid credentials
    Given I am on the login page
    When I enter email "manish123@gmail.com"
    And I enter password "Manish9@@"
    And I click the "Sign In" button
    Then I should be redirected to the dashboard
    And I should see the logout button

  [... more scenarios ...]

(Showing 1/5 pages, type 'more' to see next page, 'approve' to continue)
```

**Step 5.3: Handle User Response**
```
If user enters 'y' or 'approve':
  ✓ Lock feature file (backup created)
  ✓ Feature file ready for Agent 3
  ✓ Print command: /agent3 --feature-file=features/test.feature --consolidated=true

If user enters 'n' or 'reject':
  ✓ Ask which scenarios to remove/edit
  ✓ Allow manual edits to feature file
  ✓ Re-run validation after edits
  ✓ Return to Step 5.1 (display summary again)

If user enters 'more':
  ✓ Show next 50 lines of feature file
  ✓ Allow pagination through full file
  ✓ Return to prompt
```

---

## Validation Checklist

Before marking Agent 2 as complete, verify:

- [ ] Input JSON loaded and parsed successfully
- [ ] Input Markdown file loaded and analyzed
- [ ] Both sources cross-referenced and verified
- [ ] Output directory structure created (./features/)
- [ ] Feature file header created with Background
- [ ] Feature file name: test.feature (consolidated)
- [ ] Authentication scenarios generated (if authRequired = true)
- [ ] At least 1 scenario per functionality
- [ ] All scenarios have proper tags (@functionality, @type, @smoke/@regression)
- [ ] Gherkin syntax valid for all scenarios
- [ ] No undefined steps (all steps are implementable)
- [ ] Scenarios are independent (can run in any order)
- [ ] Test data matches examples from JSON
- [ ] Coverage report generated (test_coverage_report.txt)
- [ ] Validation log created (test_scenario_validation_log.txt)
- [ ] Scenario summary report created (test_scenarios_summary.txt)
- [ ] Feature file size >100 lines (not empty)
- [ ] User approval obtained before proceeding to Agent 3
- [ ] Feature file is valid Gherkin (npx cucumber-js --dry-run passes)

---

## Error Handling & Fallback

**If JSON validation fails:**
```
1. Identify missing/invalid fields
2. Report detailed error message
3. Show expected JSON structure
4. Ask user to re-run Agent 1 and provide corrected JSON
5. STOP — Do not proceed without valid JSON
```

**If test data is missing:**
```
1. Identify which test data is missing (valid email, password, etc.)
2. Ask user to provide examples
3. WAIT for user input
4. Use provided data in scenario generation
5. RECORD: User-provided test data in validation log
```

**If coverage gaps detected:**
```
1. Identify functionalities with 0 scenarios
2. ASK USER: "Generate placeholder scenarios or skip?"
3. If skip: WARN in coverage report
4. If generate: Create basic scenarios with comments
   Scenario: {Functionality} - TODO: Implementation pending
     Given [placeholder]
     When [placeholder]
     Then [placeholder]
```

**If Gherkin validation fails:**
```
1. List all validation errors with line numbers
2. Describe what's invalid (syntax, undefined step, etc.)
3. Ask user: "Auto-fix common issues or manual review?"
4. If auto-fix: Fix simple issues (extra spaces, syntax)
5. If manual: Show file and ask user to edit
6. Re-validate after fixes
```

---

## Success Criteria

✅ Agent 2 is successful if:
1. Both JSON and Markdown files from Agent 1 analyzed and cross-referenced
2. Feature file (test.feature) generated with 15+ valid scenarios
3. At least 1 scenario per JSON functionality
4. Markdown descriptions verified against JSON data
5. All Gherkin syntax validated and correct
6. Coverage report shows all functionalities addressed
7. Test data matches examples from JSON input
8. All scenarios tagged appropriately (@functionality, @type)
9. Scenarios are independent and isolated
10. Validation log shows 0 errors
11. Summary reports generated and readable
12. User approves feature file before Agent 3
13. All reports use "test" prefix (test_coverage_report.txt, etc.)

❌ Agent 2 should STOP if:
1. Input JSON or Markdown files invalid or incomplete
2. Cross-reference between JSON and Markdown fails
3. No test data examples provided in JSON
4. Gherkin syntax errors cannot be resolved
5. Coverage <50% (more than half functionalities uncovered)
6. >10 validation errors in generated scenarios
7. User rejects feature file without providing edits
8. Feature file (test.feature) not created

---

## Key Design Patterns

### Scenario Template Pattern
```gherkin
Scenario Outline: Login with various credentials
  Given I am on the login page
  When I enter email "<email>"
  And I enter password "<password>"
  And I click the "Sign In" button
  Then the result should be "<result>"

  Examples:
    | email | password | result |
    | user@example.com | ValidPass123! | success |
    | invalid | WrongPass | error |
```

### Background Pattern (Common Setup)
```gherkin
Background:
  Given I navigate to the application
  And the application has loaded
  And cookies are cleared
```

### Tagging Strategy
```gherkin
@domain_name — Domain identifier (required)
@smoke — Critical paths only
@regression — Non-critical tests
@authentication — Auth-related
@data_validation — Form validation
@valid_data — Tests with correct input
@invalid_data — Tests with wrong input
@boundary — Edge case tests
```

---

## Output Format Example

Generated features/{domain}.feature should look like:

```gherkin
Feature: EventHub Event Management Testing
  
  Background:
    Given I navigate to the EventHub application
    And the application has loaded successfully
    And I dismiss any cookie notices if present

  @eventhub @authentication @smoke @valid_data
  Scenario: User successfully logs in with valid credentials
    Given I am on the login page
    When I enter email "manish123@gmail.com"
    And I enter password "Manish9@@"
    And I click the "Sign In" button
    Then I should be redirected to the event listing page
    And I should see my user profile menu
    And the logout option should be visible

  @eventhub @authentication @regression @invalid_data
  Scenario: Login fails with invalid email format
    Given I am on the login page
    When I enter email "notanemailformat"
    And I enter password "Manish9@@"
    And I click the "Sign In" button
    Then an error message should be displayed
    And the error should indicate "invalid email" or "valid email address"
    And I should remain on the login page

  @eventhub @event_browsing @smoke
  Scenario: User can view list of available events
    Given I have successfully logged in
    And I am on the event browsing page
    When the event listing loads
    Then I should see at least one event card
    And each event card should display event name, date, and price
    And I should see pagination controls if more than 10 events exist

  @eventhub @event_booking @regression @boundary
  Scenario: Booking fails when no tickets are available
    Given I have successfully logged in
    And I am viewing an event with zero tickets available
    When I click the "Book Now" button
    Then an error message should be displayed
    And the error should indicate "No tickets available"
    And the booking form should not open

  # More scenarios...
```

