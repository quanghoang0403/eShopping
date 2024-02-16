package com;

import java.io.File;
import java.io.IOException;

import org.testng.TestNG;
import org.testng.annotations.Test;

import config.Config;
import scenario_tests.LoginPageTest;
import utils.FnbLibrary;

public class SeleniumTest {

    @Test
    public void TestNG() throws IOException {
        // Tạo một đối tượng TestNG
        TestNG testNG = new TestNG();

        // Xóa tất cả evidence trong ngày trước khi test
        String currentDate = FnbLibrary.getCurrentDate();
        String folderPath = Config.PATH_SCREENSHOT + "/" + currentDate;
        FnbLibrary.deleteFilesInSubfolders(new File(folderPath));

        // Thiết lập các lớp kiểm thử cần chạy
        // Đặt tên đầy đủ của lớp chứa các phương thức kiểm thử TestNG
        testNG.setTestClasses(new Class[] {
                LoginPageTest.class,
        });

        // Chạy các phương thức kiểm thử
        testNG.run();
    }

}
