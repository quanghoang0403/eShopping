package scenario_tests;

import java.io.IOException;

import org.openqa.selenium.By;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

import config.Config;
import config.Route;
import pages.login.LoginPage;
import pages.login.DataTest;
import utils.FnbLibrary;

public class LoginPageTest {
    private FnbLibrary fnbLibrary;
    private LoginPage loginPage;

    @BeforeTest
    public void beforeTest() {
        // @BeforeTest Thực hiện các công việc chuẩn bị trước khi chạy Test
        // Khởi tạo trình duyệt và tạo đối tượng WebDriver
        fnbLibrary = new FnbLibrary(Config.WEBDRIVER);
        fnbLibrary.getDriver();
        fnbLibrary.webDriverWait(Config.TIME_OUT);
    }

    @AfterTest
    public void afterTest() {
        // @AfterTest Thực hiện các công việc sau khi chạy Test
    }

    @BeforeMethod
    public void setup() {
        // @BeforeMethod Thực hiện các công việc chuẩn bị trước khi chạy mỗi Test Case
        // setup login page
        loginPage = new LoginPage(fnbLibrary);
    }

    @AfterMethod
    public void teardown() {
        // @AfterMethod Thực hiện các công việc sau khi chạy mỗi Test Case
        fnbLibrary.closeBrowser();
    }

    @Test
    public void testInputNull() throws IOException, InterruptedException {
        String errorMessage = "";
        fnbLibrary.takesScreenshot(DataTest.SCREENSHOT_PATH + "1");

        // CASE 1: input userName, not input password -> click btn login
        loginPage.enterUsername(DataTest.INPUT_USERNAME);
        fnbLibrary.takesScreenshot(DataTest.SCREENSHOT_PATH + "1");
        loginPage.clickLoginButton();
        errorMessage = loginPage.getErrorMessagePassword();
        assert errorMessage.equals(DataTest.ERROR_ENTER_PASSWORD);
        fnbLibrary.takesScreenshot(DataTest.SCREENSHOT_PATH + "1");

        // CASE 2: not input userName, input password
        loginPage.clearUsername();
        fnbLibrary.takesScreenshot(DataTest.SCREENSHOT_PATH + "2");
        loginPage.enterPassword(DataTest.INPUT_PASSWORD);
        errorMessage = loginPage.getErrorMessageUserName();
        assert errorMessage.equals(DataTest.ERROR_ENTER_USERNAME);
        fnbLibrary.takesScreenshot(DataTest.SCREENSHOT_PATH + "2");

        // CASE 3: input invalid userName, input password
        loginPage.enterUsername(DataTest.INPUT_INVALID_USERNAME);
        fnbLibrary.takesScreenshot(DataTest.SCREENSHOT_PATH + "3");
        errorMessage = loginPage.getErrorMessageUserName();
        assert errorMessage.equals(DataTest.ERROR_INVALID_USERNAME);
        fnbLibrary.takesScreenshot(DataTest.SCREENSHOT_PATH + "3");

        // CASE 4: input wrong userName or password -> click btn login
        loginPage.enterUsername(DataTest.INPUT_USERNAME_NOT_EXIST);
        loginPage.enterPassword(DataTest.INPUT_PASSWORD);
        fnbLibrary.takesScreenshot(DataTest.SCREENSHOT_PATH + "4");
        loginPage.clickLoginButton();
        errorMessage = loginPage.getErrorMessageWrongUserNamePassword();
        System.out.println("errorMessage => " + errorMessage);
        assert errorMessage.equals(DataTest.ERROR_WRONG_USERNAME_PASSWORD);
        fnbLibrary.takesScreenshot(DataTest.SCREENSHOT_PATH + "4");

        // CASE 5: input userName,password -> click btn login
        loginPage.clearAll();
        loginPage.enterUsername(DataTest.INPUT_USERNAME);
        loginPage.enterPassword(DataTest.INPUT_PASSWORD);
        fnbLibrary.takesScreenshot(DataTest.SCREENSHOT_PATH + "5");
        loginPage.clickLoginButton();
        fnbLibrary.waitUrl(Route.URL_HOMEPAGE);
        String nextPageUrl = fnbLibrary.getCurrentUrl();
        assert nextPageUrl.equals(Route.URL_HOMEPAGE);
        fnbLibrary.takesScreenshot(DataTest.SCREENSHOT_PATH + "5");
    }
}
