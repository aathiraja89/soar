package com.android.actions;

import java.awt.Point;
import java.time.Duration;
import java.util.Arrays;

import org.openqa.selenium.interactions.PointerInput;
import org.openqa.selenium.interactions.Sequence;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;

import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.appmanagement.ApplicationState;

public class AndroidActions {
	AndroidDriver driver;
	WebDriverWait wait;

	public AndroidActions(AndroidDriver driver) {
		this.driver = driver;
		wait = new WebDriverWait(driver, Duration.ofSeconds(10));
	}
	
	public void verifyAppRunning() {
		String bundleId = driver.getCurrentPackage();
		Assert.assertEquals(driver.queryAppState(bundleId), ApplicationState.RUNNING_IN_FOREGROUND);
	}

	public void scroll(boolean scrollDown, Point startPoint, Point endPoint) {
		// Scroll until the desired element is found
		PointerInput finger = new PointerInput(PointerInput.Kind.TOUCH, "finger");
		Sequence scroll = new Sequence(finger, 0);
		scroll.addAction(finger.createPointerMove(Duration.ZERO, PointerInput.Origin.viewport(), startPoint.x,
				scrollDown ? startPoint.y : endPoint.y)); // Start
		// point
		scroll.addAction(finger.createPointerDown(PointerInput.MouseButton.LEFT.asArg()));
		scroll.addAction(finger.createPointerMove(Duration.ofMillis(500), PointerInput.Origin.viewport(), startPoint.x,
				scrollDown ? endPoint.y : startPoint.y)); // End
		// point
		scroll.addAction(finger.createPointerUp(PointerInput.MouseButton.LEFT.asArg()));

		driver.perform(Arrays.asList(scroll));
	}
}
