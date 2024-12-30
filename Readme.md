# Automated Testing Projects

This repository showcases various automated testing projects using different tools and methodologies.

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
        1. Clone the repository: `[git clone https://github.com/aathiraja89/soar.git](https://github.com/aathiraja89/soar.git)`
        2. Navigate to the `web-automation` directory: `cd web-automation`
        3. Install dependencies: `npm install` 
    * **Running Tests:** `npx playwright test` 

* **2. Mobile Automation using Appium:**
    * **Description:** This project demonstrates mobile automation tasks using the Appium framework.
    * **Folder Structure:**
        * `mobile-automation/`:
            * `tests/`: Contains Appium test scripts (e.g., `android_tests.js`, `ios_tests.js`).
            * `desired_capabilities/`: Contains desired capabilities files for different devices and platforms.
            * `utils/`: Contains helper functions (e.g., `findElement.js`, `takeScreenshot.js`).
            * `package.json`: Contains project dependencies (Appium, WebDriverIO, etc.).
    * **Installation:** 
        1. Clone the repository: `git clone <repository_url>`
        2. Navigate to the `mobile-automation` directory: `cd mobile-automation`
        3. Install dependencies: `npm install`
    * **Running Tests:** Refer to the `README.md` file within the `mobile-automation` directory for specific instructions on running tests with Appium.

* **3. Load/Stress Testing using K6:**
    * **Description:** This project demonstrates load and stress testing using the K6 tool.
    * **Folder Structure:**
        * `load-testing/`:
            * `load_test.js`: Contains the K6 script for load testing.
            * `config.js`: Contains configuration for the test (e.g., number of virtual users, duration, ramp-up).
    * **Installation:** 
        1. Clone the repository: `git clone <repository_url>`
        2. Navigate to the `load-testing` directory: `cd load-testing`
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
* Docker or other containerization tools (optional, for managing dependencies and environments)

This README provides a more comprehensive overview of the projects and their contents. You can further customize it by adding more specific details about each project, such as the technologies used, testing methodologies, and any other relevant information.
