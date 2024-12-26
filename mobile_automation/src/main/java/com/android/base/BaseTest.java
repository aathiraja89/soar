/**
 * 
 */
package com.android.base;

import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.android.options.UiAutomator2Options;
import io.appium.java_client.remote.MobileCapabilityType;

import org.testng.annotations.AfterClass;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.BeforeSuite;

import java.lang.reflect.Method;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Date;
import java.util.HashMap;

public class BaseTest {
	protected AndroidDriver driver;
	public final HashMap<String, AndroidDriver> drivers = new HashMap<>();

	@BeforeSuite
	public void beforeAll() {
//		startAppiumServer();
	}

	@BeforeClass
	public void setUp() throws MalformedURLException {

	}

	@BeforeMethod
	public void beforeMethod(Object[] testArgs) throws MalformedURLException {
		String methodName = ((Method) testArgs[0]).getName();
		String udid = (String) testArgs[2];
		log(String.format("Running test '%s' on '%s'", methodName, udid));

		log(String.format("Create AppiumDriver for - %s", udid));
		@SuppressWarnings("deprecation")
		AndroidDriver driver = createAppiumDriver(new URL("http://localhost:4723/wd/hub/"), udid);
		drivers.put(udid, driver);
		log(String.format("Created AppiumDriver for - %s", udid));
	}

	@AfterMethod
	public void afterMethod(Object[] testArgs) {
		log(testArgs.toString());
//		String methodName = ((Method) testArgs[0]).getName();
//		ITestResult result = ((ITestResult) testArgs[1]);
//		log(String.format("Test '%s' result: '%s'", methodName, result.toString()));
		String udid = (String) testArgs[2];
		Integer systemPort = (Integer) testArgs[3];

		AndroidDriver driver = drivers.get(udid);

		try {
			if (null != driver) {
				driver.quit();
			}

			log(String.format("Visual Validation Results for - %s:%s", udid, systemPort));
		} catch (Exception e) {
			log("Exception - " + e.getMessage());
			e.printStackTrace();
		} finally {
		}
	}

	@AfterClass
	public void tearDown() {
		if (driver != null) {
			driver.quit();
		}
	}

	@AfterSuite
	public void afterAll() {
//		stopAppiumServer();
	}

	public void log(String message) {
		System.out.println(" ### " + new Date() + " ### " + message);
	}

	public AndroidDriver createAppiumDriver(URL appiumServerUrl, String udid) {
		UiAutomator2Options capabilities = new UiAutomator2Options();

		capabilities.setCapability(MobileCapabilityType.AUTOMATION_NAME, "UiAutomator2");
		capabilities.setCapability(MobileCapabilityType.DEVICE_NAME, "Android Emulator");
		capabilities.setCapability(MobileCapabilityType.PLATFORM_NAME, "Android");
		capabilities.setCapability(MobileCapabilityType.PLATFORM_VERSION, "13");
		capabilities.setCapability(MobileCapabilityType.UDID, udid);
		capabilities.setCapability("app", "src/test/resources/WikipediaSample.apk");
		capabilities.setCapability(MobileCapabilityType.NO_RESET, false);
		capabilities.setCapability(MobileCapabilityType.FULL_RESET, false);
		return new AndroidDriver(appiumServerUrl, capabilities);
	}
}