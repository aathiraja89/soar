package com.wikipedia.pages;

import java.time.Duration;
import java.util.List;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.CacheLookup;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;

import io.appium.java_client.android.AndroidDriver;

public class HomePage {
	AndroidDriver driver;
	HomeObjects homeObjects;
	WebDriverWait wait;

	public HomePage(AndroidDriver driver) {
		this.driver = driver;
		wait = new WebDriverWait(driver, Duration.ofSeconds(10));
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

	public void verifyHomeScreen() {
		wait.until(ExpectedConditions.visibilityOf(homeObjects.myLists));
		Assert.assertTrue(homeObjects.myLists.isDisplayed());
	}

	class HomeObjects {
		@CacheLookup
		@FindBy(xpath = "//android.widget.FrameLayout[@content-desc='My lists']")
		public WebElement myLists;

		@CacheLookup
		@FindBy(xpath = "//android.widget.FrameLayout[@content-desc='History']")
		public WebElement history;

		@CacheLookup
		@FindBy(xpath = "//android.widget.FrameLayout[@content-desc='Nearby']")
		public WebElement nearby;

		@CacheLookup
		@FindBy(xpath = "//android.widget.FrameLayout[@content-desc='Explore']")
		public WebElement explore;

		@CacheLookup
		@FindBy(id = "org.wikipedia.alpha:id/search_container")
		public WebElement searchContainer;

		@CacheLookup
		@FindBy(id = "org.wikipedia.alpha:id/search_src_text")
		public WebElement searchWikipedia;

		@CacheLookup
		@FindBy(id = "org.wikipedia.alpha:id/search_close_btn")
		public WebElement searchClear;

		@CacheLookup
		@FindBy(className = "android.widget.ImageButton")
		public WebElement searchBackButton;

		@CacheLookup
		@FindBy(id = "org.wikipedia.alpha:id/fragment_feed_header")
		public List<WebElement> searchResult;
		
		// Settings
		@CacheLookup
		@FindBy(xpath = "//android.widget.TextView[@content-desc='More options']")
		public WebElement moreOptions;
		
		@CacheLookup
		@FindBy(id = "org.wikipedia.alpha:id/explore_overflow_settings")
		public WebElement settings;
		
		@CacheLookup
		@FindBy(id = "org.wikipedia.alpha:id/switchWidget")
		public List<WebElement> toggleSwitches;
		
		@CacheLookup
		@FindBy(xpath = "//android.widget.ImageButton[@content-desc='Navigate up']")
		public WebElement settingsBack;
	}

}
