# Soar - Tasks

This repository showcases various automated test tasks and other reports provided as tasks by Soar as a interview process.

**Projects:**

* **1. Web Automation using Playwright:**
    * **Description:** This project demonstrates web automation tasks using the Playwright framework.
    * **Folder Structure:**
        * `web-automation/`:
            * `e2e/actions/`: Contains all the user actions test scripts (e.g., `homeActions.ts`, `basketActions.ts`).
            * `e2e/fixtures/`: Contains the custom fixture for the page.
            * `e2e/locators/`: Contains all the locator scripts required for the page files.
            * `e2e/pages/`: Contains all the page respective actions.
            * `e2e/tests/`: Contains all the Playwright test scripts.
            * `utils/`: Contains helper functions.
            * `eslint.config.mjs`: Configuration file for eslint.
            * `tsconfig.js`: Configuration file for TypeScript.
            * `package.json`: Contains project dependencies.
    * **Installation:**
        1. Clone the repository: [git clone https://github.com/aathiraja89/soar.git](https://github.com/aathiraja89/soar.git)
        2. Navigate to the `web-automation` directory: `cd web-automation`
        3. Install dependencies: `npm install`
    * **Running Tests:** `npx playwright test`

* **2. Mobile Automation using Appium:**

    **Description:** This project demonstrates mobile automation tasks using the Appium framework.

    **Prerequisites**
    * **Java Development Kit (JDK):** Install and configure JDK on your system.
    * **Maven:** Install Maven for project management and dependency management.
    * **Node.js and npm:** Install Node.js and npm for managing Appium dependencies.
    * **Android SDK:** Install the Android SDK and configure the necessary Android SDK tools (platform-tools, build-tools, etc.).
    * **An Android device or emulator:** Set up an Android device or emulator for testing.
    * **Appium Server:** Install and start the Appium server.
    * **Device** Have devices connected / emulators started.

    #### Folder Structure

    * `mobile-automation/`:
        * `src/main/java/com/actions/BaseTest.java`: Contains test annotations to control the flow of test execution, desired capabilities files for different devices and platforms.
        * `src/main/java/com/actions/Hooks.java`: Contains methods to start/ stop the Appium server from code.
        * `src/main/java/com/wikipedia/pages/<class>.java`: Contains the locators and page action methods respective to a page / fragment.
        * `src/test/java/com/wikipedia/tests/<testClass>.java`: Contains Appium tests.
        * `src/test/resources/configs/<config>.xml/`: Contains TestNG config for the test runner.
        * `src/test/resources/`: Contains the apk file and other supporting resources for the test execution.

* **3. Load/Stress Testing using K6:**
    * **Description:** This project demonstrates load and stress testing using the K6 tool.
    * **Folder Structure:**
        * `k6_loadtest/`:
            * `tests/K6.js`: Contains the K6 script for load/stress testing.
            * `utils/config.js`: Contains configuration for the execution metrics
    * **Installation:**
        1. Clone the repository: [git clone https://github.com/aathiraja89/soar.git](https://github.com/aathiraja89/soar.git)
        2. Navigate to the `k6_loadtest` directory: `cd k6_loadtest`
        3. Install K6: `npm install k6`
    * **Running Tests:** `k6 run load_test.js`

**Submit Folder:**

* The `Submit` folder contains reports for the following tasks:
    * **Security/Logical vulnerability test report:** A comprehensive report detailing security findings, vulnerabilities, and recommendations.
    * **Test plan, Risk-based testing, test cases, test runs:** Documentation outlining the testing strategy, including test plans, risk assessments, test cases, and execution results.
    * **Exploratory testing reports:** Detailed reports summarizing exploratory testing activities, including findings, bugs, and areas for improvement.

**Prerequisites:**

* Node.js and npm installed (for all projects)
* Java and Android SDK (for Appium mobile testing)
