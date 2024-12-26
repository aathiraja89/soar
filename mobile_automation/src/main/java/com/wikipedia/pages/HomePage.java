package com.wikipedia.pages;

import java.awt.Point;
import java.time.Duration;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.CacheLookup;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;

import com.android.actions.AndroidActions;

import io.appium.java_client.android.AndroidDriver;

public class HomePage {
	AndroidDriver driver;
	HomeObjects homeObjects;
	WebDriverWait wait;
	AndroidActions androidActions;

	public HomePage(AndroidDriver driver) {
		this.driver = driver;
		wait = new WebDriverWait(driver, Duration.ofSeconds(10));
		androidActions = new AndroidActions(driver);
		homeObjects = new HomeObjects();
		PageFactory.initElements(driver, homeObjects);
	}

	public void tapNavigationTabAndWait(String tabName) throws InterruptedException {
		switch (tabName.toUpperCase()) {
		case "MY LISTS":
			homeObjects.myLists.click();
			break;
		case "HISTORY":
			homeObjects.history.click();
			break;
		case "NEAR BY":
			homeObjects.nearby.click();
			break;
		case "EXPLORE":
			homeObjects.explore.click();
			break;
		default:
			throw new IllegalArgumentException("Unexpected value: " + tabName);
		}
		Thread.sleep(3000);
	}

	public void tapSearchContainer() {
		homeObjects.searchContainer.click();
	}

	public void enterSearchText(String text) {
		homeObjects.searchWikipedia.sendKeys(text);
	}

	public void clearSearch() {
		homeObjects.searchClear.click();
	}

	public void closeSearchContainer() {
		homeObjects.searchBackButton.click();
	}

	// Settings
	public void tapMoreOptions() {
		homeObjects.moreOptions.click();
	}

	public void tapSettings() {
		wait.until(ExpectedConditions.visibilityOf(homeObjects.settings));
		homeObjects.settings.click();
	}

	public void tapSettingsBackButton() {
		homeObjects.settingsBack.click();
	}

	public void toggleSwitches() {
		homeObjects.toggleSwitches.forEach(toggle -> {
			toggle.click();
		});
	}

	public void verifySearchResult() {
		Assert.assertTrue(homeObjects.searchResult.size() > 0);
	}

	public void verifyHomeScreenToolBar() {
		wait.until(ExpectedConditions.visibilityOf(homeObjects.homeToolBar));
		Assert.assertTrue(homeObjects.homeToolBar.isDisplayed());
	}

	public void verifyHomeScreen() {
		wait.until(ExpectedConditions.visibilityOf(homeObjects.myLists));
		Assert.assertTrue(homeObjects.myLists.isDisplayed());
	}

	public void verifyElementDisplayed(WebElement element) {
		Assert.assertTrue(element.isDisplayed());
	}

	public void scroll(boolean scrollDown) {
		WebElement element;
		int i = 0;
		boolean elementFound = false;

		Point startPoint = new Point(500, 1200);
		Point endPoint = new Point(500, 600);

		wait.until(
				ExpectedConditions.visibilityOfElementLocated(By.id("org.wikipedia.alpha:id/view_list_card_list")));

		while (!elementFound) {
			try {
				if (scrollDown)
					element = homeObjects.cardHeaders.stream()
							.filter(ele -> ele.getText().equalsIgnoreCase("Picture of the day")).findFirst()
							.orElse(null);
				else
					element = homeObjects.searchContainer;

				if (element.isDisplayed()) {
					if (i > (scrollDown ? 6 : 1))
						elementFound = true;
					else
						androidActions.scroll(scrollDown, startPoint, endPoint);
					i++;
				}
			} catch (Exception e) {
				androidActions.scroll(scrollDown, startPoint, endPoint);
			}
		}
	}

	class HomeObjects {
		@FindBy(id = "org.wikipedia.alpha:id/single_fragment_toolbar_wordmark")
		public WebElement homeToolBar;

		@FindBy(id = "org.wikipedia.alpha:id/fragment_main_nav_tab_layout")
		public WebElement navTabContainer;		
		
		@FindBy(id = "org.wikipedia.alpha:id/view_card_header_title")
		public List<WebElement> cardHeaders;

		@FindBy(xpath = "//android.widget.FrameLayout[@content-desc='My lists']")
		public WebElement myLists;

		@FindBy(xpath = "//android.widget.FrameLayout[@content-desc='History']")
		public WebElement history;

		@FindBy(xpath = "//android.widget.FrameLayout[@content-desc='Nearby']")
		public WebElement nearby;

		@FindBy(xpath = "//android.widget.FrameLayout[@content-desc='Explore']")
		public WebElement explore;

		@FindBy(id = "org.wikipedia.alpha:id/search_container")
		public WebElement searchContainer;

		@FindBy(id = "org.wikipedia.alpha:id/search_src_text")
		public WebElement searchWikipedia;

		@FindBy(id = "org.wikipedia.alpha:id/search_close_btn")
		public WebElement searchClear;

		@FindBy(className = "android.widget.ImageButton")
		public WebElement searchBackButton;

		@FindBy(id = "org.wikipedia.alpha:id/fragment_feed_header")
		public List<WebElement> searchResult;

		// Settings
		@FindBy(xpath = "//android.widget.TextView[@content-desc='More options']")
		public WebElement moreOptions;

		@FindBy(id = "org.wikipedia.alpha:id/explore_overflow_settings")
		public WebElement settings;

		@FindBy(id = "org.wikipedia.alpha:id/switchWidget")
		public List<WebElement> toggleSwitches;

		@FindBy(xpath = "//android.widget.ImageButton[@content-desc='Navigate up']")
		public WebElement settingsBack;
	}
}
