package utils;

import java.io.File;
import java.io.IOException;

import org.apache.commons.io.FileUtils;
import java.time.Duration;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import config.Config;

public class FnbLibrary {
    private static WebDriver driver;
    private WebDriverWait wait;

    public FnbLibrary(String browser) {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--remote-allow-origins=*");
        if (browser.equalsIgnoreCase("chrome")) {
            System.setProperty("webdriver.chrome.driver", "webdriver/chrome/chromedriver.exe");
            driver = new ChromeDriver(options);
        } else if (browser.equalsIgnoreCase("firefox")) {
            System.setProperty("webdriver.gecko.driver", "webdriver/firefox/geckodriver.exe");
            driver = new FirefoxDriver();
        } else {
            throw new IllegalArgumentException("Invalid browser name");
        }
    }

    public WebDriver getDriver() {
        return driver;
    }

    public WebDriverWait webDriverWait(long timeout) {
        wait = new WebDriverWait(driver, Duration.ofSeconds(timeout));
        return wait;
    }

    public void explicitWait(WebElement element) {
        wait.until(ExpectedConditions.visibilityOf(element));
    }

    public void waitText(By locator, String value) {
        wait.until(ExpectedConditions.textToBePresentInElementValue(locator, value));
    }

    public void waitUrl(String value) {
        wait.until(ExpectedConditions.urlToBe(value));
    }

    public void openUrl(String url) {
        driver.manage().window().maximize();
        driver.get(url);
    }

    public String getCurrentUrl() {
        return driver.getCurrentUrl();
    }

    public WebElement findElement(By locator) {
        return driver.findElement(locator);
    }

    public String getText(By locator) {
        WebElement el = driver.findElement(locator);
        return el.getText();
    }

    public void click(By locator) {
        wait.until(ExpectedConditions.elementToBeClickable(locator)).click();
    }

    public void type(By locator, String text) {
        WebElement element = wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
        element.clear();
        element.sendKeys(text);
    }

    public void takesScreenshot(String pathTestCase) throws IOException, InterruptedException {
        // Lấy ngày tháng hiện tại
        String currentDate = getCurrentDate();

        String folderPath = Config.PATH_SCREENSHOT + "/" + currentDate;
        if (pathTestCase != "" || pathTestCase != null) {
            folderPath = folderPath + "/" + pathTestCase;
        }

        // Tạo folder nếu chưa tồn tại
        File folder = new File(folderPath);
        if (!folder.exists() && !folder.isDirectory()) {
            folder.mkdir();
        }

        Thread.sleep(500);
        File screenshotFile = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);

        // Lấy danh sách các tên file trong thư mục
        File[] files = folder.listFiles();
        Integer countFile = 0;
        if (files != null) {
            List<File> fileList = Arrays.asList(files);
            // In ra các tên file
            for (File file : fileList) {
                if (file.isFile()) {
                    countFile++;
                }
            }
        }
        FileUtils.copyFile(screenshotFile,
                new File(folderPath + "/" + countFile + ".png"));
    }

    public void closeBrowser() {
        if (driver != null) {
            driver.quit();
        }
    }

    public static void deleteFilesInSubfolders(File directory) {
        File[] files = directory.listFiles();

        if (files != null) {
            for (File file : files) {
                if (file.isDirectory()) {
                    deleteFilesInSubfolders(file); // Đệ quy xóa các tệp tin trong thư mục con
                } else if (file.isFile()) {
                    file.delete(); // Xóa tệp tin nếu nó là một tệp tin
                    System.out.println("Deleted: " + file.getAbsolutePath());
                }
            }
        }
    }

    public static String getCurrentDate() {
        // Lấy ngày tháng hiện tại
        LocalDate currentDate = LocalDate.now();

        // Định dạng ngày tháng thành chuỗi theo định dạng "dd/MM/yyyy"
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd_MM_yyyy");
        String formattedDate = currentDate.format(formatter);
        return formattedDate;
    }
}
