import { Col, Row, Tabs } from "antd";
import { FnbDatePicker } from "components/fnb-date-picker/fnb-data-picker";
import { FnbListBranches } from "components/fnb-list-branches/fnb-list-branches";
import PageTitle from "components/page-title";
import { OptionDateTime } from "constants/option-date.constants";
import moment from "moment";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import OverviewComponent from "./component/overview.component";
import "./customer.page.scss";

const { TabPane } = Tabs;

export default function CustomerReport() {
  const [t] = useTranslation();

  const pageData = {
    title: t("report.customer.title"),
    date: {
      yesterday: t("dashboard.compareDate.yesterday"),
      previousDay: t("dashboard.compareDate.previousDay"),
      lastWeek: t("dashboard.compareDate.lastWeek"),
      previousWeek: t("dashboard.compareDate.previousWeek"),
      lastMonth: t("dashboard.compareDate.lastMonth"),
      previousMonth: t("dashboard.compareDate.previousMonth"),
      lastYear: t("dashboard.compareDate.lastYear"),
      previousSession: t("dashboard.compareDate.previousSession"),
    },
    tabOverView: t("report.customer.tabOverView"),
    tabView: t("report.customer.tabView"),
    tabAccessTimes: t("report.customer.tabAccessTimes"),
    allBranch: t("dashboard.allBranch"),
  };

  const defaultScreen = "1";
  const [activeScreen, setActiveScreen] = React.useState(defaultScreen);
  const [branchId, setBranchId] = useState("");
  const [selectedDate, setSelectedDate] = useState({
    startDate: moment().startOf("date").toDate(),
    endDate: moment().endOf("date").toDate(),
  });
  const [typeOptionDate, setTypeOptionDate] = useState(OptionDateTime.today);
  const [titleConditionCompare, setTitleConditionCompare] = useState(pageData.date.yesterday);

  const screens = [
    {
      name: pageData.tabOverView,
      key: "1",
      component: (
        <OverviewComponent
          selectedDates={selectedDate}
          branchId={branchId}
          segmentTimeOption={typeOptionDate}
          key={1}
        />
      ),
    },
    {
      name: pageData.tabView,
      key: "2",
      component: "",
    },
    {
      name: pageData.tabAccessTimes,
      key: "3",
      component: "",
    },
  ];

  useEffect(() => {
    onConditionCompare(OptionDateTime.today);
  }, []);

  const handleChangeBranch = (branchId) => {
    setBranchId(branchId);
  };

  const onSelectedDatePicker = (date, typeOptionDate) => {
    setSelectedDate(date);
    setTypeOptionDate(typeOptionDate);
  };

  const onConditionCompare = (key) => {
    switch (key) {
      case OptionDateTime.today:
        setTitleConditionCompare(pageData.date.yesterday);
        break;
      case OptionDateTime.yesterday:
        setTitleConditionCompare(pageData.date.previousDay);
        break;
      case OptionDateTime.thisWeek:
        setTitleConditionCompare(pageData.date.lastWeek);
        break;
      case OptionDateTime.lastWeek:
        setTitleConditionCompare(pageData.date.previousWeek);
        break;
      case OptionDateTime.thisMonth:
        setTitleConditionCompare(pageData.date.lastMonth);
        break;
      case OptionDateTime.lastMonth:
        setTitleConditionCompare(pageData.date.previousMonth);
        break;
      case OptionDateTime.thisYear:
        setTitleConditionCompare(pageData.date.lastYear);
        break;
      default:
        setTitleConditionCompare(pageData.date.previousSession);
        break;
    }
  };

  const renderScreenContent = () => {
    const screenActive = screens.find((item) => item.key === activeScreen);
    if (screenActive !== null) {
      return screenActive.component;
    }

    return defaultScreen;
  };

  return (
    <>
      <Row className="fnb-form-title custommer-report" gutter={[0, 29]}>
        <Col span={24}>
          <Row gutter={[24, 24]} align="middle" justify="center" className="top-dashboard">
            <Col xs={24} sm={24} md={24} lg={8}>
              <PageTitle className="mb-0 title-dashboard" content={pageData.title} />
            </Col>
            <Col xs={24} sm={24} md={24} lg={16} className="fnb-form-btn-popover">
              <Row className="fnb-row-top" gutter={[24, 24]} justify="end">
                <FnbListBranches onChangeEvent={handleChangeBranch} />
                <FnbDatePicker
                  selectedDate={selectedDate}
                  setSelectedDate={(date, typeOptionDate) => onSelectedDatePicker(date, typeOptionDate)}
                  setConditionCompare={onConditionCompare}
                />
              </Row>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Tabs defaultActiveKey={1} className="transaction-report-tabs" onChange={(key) => setActiveScreen(key)}>
            {screens?.map((screen) => {
              return <TabPane tab={screen.name} key={screen.key}></TabPane>;
            })}
          </Tabs>
          <div>{renderScreenContent()}</div>
        </Col>
      </Row>
    </>
  );
}
