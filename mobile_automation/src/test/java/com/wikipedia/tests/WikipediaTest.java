package com.wikipedia.tests;

import java.awt.Point;
import java.lang.reflect.Method;
import java.time.Duration;
import java.util.Arrays;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.PointerInput;
import org.openqa.selenium.interactions.Sequence;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.ITestResult;
import org.testng.annotations.*;
import com.android.base.BaseTest;
import com.wikipedia.pages.HomePage;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.appmanagement.ApplicationState;

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
		try {
			String bundleId = driver.getCurrentPackage();
			Assert.assertEquals(driver.queryAppState(bundleId), ApplicationState.RUNNING_IN_FOREGROUND);
			Assert.assertTrue(
					driver.findElement(By.id("org.wikipedia.alpha:id/single_fragment_toolbar_wordmark")).isDisplayed());
			scroll(true);

			tapNavigationTabs();
			
			scroll(false);

		}
		finally {
			if (null != driver) {
				driver.quit();
			}
		}
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

	public void scroll(boolean scrollDown) {
		// Scroll until the desired element is found
		int i = 0;
		boolean elementFound = false;
		WebElement element;

		WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));
		wait.until(
				ExpectedConditions.visibilityOfElementLocated(By.id("org.wikipedia.alpha:id/view_list_card_header")));

		Point startPoint = new Point(500, 1200);
		Point endPoint = new Point(500, 600);

		while (!elementFound) {
			try {
				if (scrollDown)
					element = driver.findElements(By.id("org.wikipedia.alpha:id/view_card_header_title")).stream()
							.filter(ele -> ele.getText().equalsIgnoreCase("Picture of the day")).findFirst()
							.orElse(null);
				else
					element = driver.findElement(By.id("org.wikipedia.alpha:id/search_container"));
				if (element.isDisplayed()) {
					if (i > (scrollDown ? 6 : 1))
						elementFound = true;
					else {
						PointerInput finger = new PointerInput(PointerInput.Kind.TOUCH, "finger");
						Sequence scroll = new Sequence(finger, 0);
						scroll.addAction(finger.createPointerMove(Duration.ZERO, PointerInput.Origin.viewport(),
								startPoint.x, scrollDown ? startPoint.y : endPoint.y)); // Start
						// point
						scroll.addAction(finger.createPointerDown(PointerInput.MouseButton.LEFT.asArg()));
						scroll.addAction(finger.createPointerMove(Duration.ofMillis(500),
								PointerInput.Origin.viewport(), startPoint.x, scrollDown ? endPoint.y : startPoint.y)); // End
						// point
						scroll.addAction(finger.createPointerUp(PointerInput.MouseButton.LEFT.asArg()));

						driver.perform(Arrays.asList(scroll));
					}
					i++;
					System.out.println("Element found!");
				}
			} catch (Exception e) {
				// Scroll action
				PointerInput finger = new PointerInput(PointerInput.Kind.TOUCH, "finger");
				Sequence scroll = new Sequence(finger, 0);
				scroll.addAction(finger.createPointerMove(Duration.ZERO, PointerInput.Origin.viewport(), startPoint.x, scrollDown ? startPoint.y : endPoint.y)); // Start
																														// point
				scroll.addAction(finger.createPointerDown(PointerInput.MouseButton.LEFT.asArg()));
				scroll.addAction(
						finger.createPointerMove(Duration.ofMillis(500), PointerInput.Origin.viewport(), startPoint.x, scrollDown ? endPoint.y : startPoint.y)); // End
																														// point
				scroll.addAction(finger.createPointerUp(PointerInput.MouseButton.LEFT.asArg()));

				driver.perform(Arrays.asList(scroll));
			}
		}
	}

	@DataProvider(name = "device-provider", parallel = true)
	public Object[][] provide() {
//		, { "emulator-5556", 3, 6 }
		return new Object[][] { { "emulator-5554", 2, 5 } };
	}
}
