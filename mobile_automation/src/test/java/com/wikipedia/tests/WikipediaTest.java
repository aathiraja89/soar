package com.wikipedia.tests;

import java.lang.reflect.Method;
import java.util.List;

import org.testng.ITestResult;
import org.testng.annotations.*;

import com.android.actions.AndroidActions;
import com.android.base.BaseTest;
import com.wikipedia.pages.HomePage;
import io.appium.java_client.android.AndroidDriver;

public class WikipediaTest extends BaseTest {
	AndroidDriver driver;
	HomePage homePage;

	public WikipediaTest() {
		super();
	}	
	
	@Test(dataProvider = "device-provider", threadPoolSize = 1)
	public void runTest(Method method, ITestResult testResult, String udid, int num1, int num2)
			throws InterruptedException {
		log(String.format("Runnng test on %s, appiumPort - ", udid));
		log(String.format("drivers.size()=%d", drivers.size()));
		driver = drivers.get(udid);
		homePage = new HomePage(driver);

		new AndroidActions(driver).verifyAppRunning();
		homePage.verifyHomeScreenToolBar();

		// Scroll down to last
		homePage.scroll(true);

		// Tap Navigation tabs in the bottom and wait for 3 seconds
		tapNavigationTabs();

		// Scroll up to top
		homePage.scroll(false);
	}

	@Test(dataProvider = "device-provider", threadPoolSize = 1)
	public void runTest1(Method method, ITestResult testResult, String udid, int num1, int num2)
			throws InterruptedException {
		log(String.format("Runnng test on %s, appiumPort - ", udid));
		log(String.format("drivers.size()=%d", drivers.size()));
		driver = drivers.get(udid);
		homePage = new HomePage(driver);
		
		homePage.tapSearchContainer();
		homePage.enterSearchText("New York");
		homePage.verifySearchResult();
		homePage.clearSearch();
		homePage.closeSearchContainer();
		homePage.verifyHomeScreen();
	}
	
	@Test(dataProvider = "device-provider", threadPoolSize = 1)
	public void runTest2(Method method, ITestResult testResult, String udid, int num1, int num2)
			throws InterruptedException {
		log(String.format("Runnng test on %s, appiumPort - ", udid));
		log(String.format("drivers.size()=%d", drivers.size()));
		driver = drivers.get(udid);
		homePage = new HomePage(driver);
		
		homePage.tapMoreOptions();
		homePage.tapSettings();
		homePage.toggleSwitches();
		homePage.tapSettingsBackButton();
		homePage.verifyHomeScreen();
	}
	
	
	private void tapNavigationTabs() throws InterruptedException {
		List<String> tabs = List.of("My Lists", "History", "Near By", "Explore");
		for (String tab : tabs)
			homePage.tapNavigationTabAndWait(tab);
	}



	@DataProvider(name = "device-provider", parallel = true)
	public Object[][] provide() {
//		, { "emulator-5556", 3, 6 }
		return new Object[][] { { "emulator-5554", 2, 5 } };
	}
}
