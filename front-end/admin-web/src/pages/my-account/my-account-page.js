import React from "react";
import { Card, Col, Row } from "antd";
import PageTitle from "components/page-title";
import UserInformationComponent from "./components/user-information.component";
import "./my-account.scss";

export default function MyAccountPage(props) {
  const pageData = {
    titlePage: "Thông tin tài khoản",
    tabNameAccount:  "Tài khoản",
  };

  return (
    <>
      <Row className="mt-4" align="middle" gutter={[0, 0]}>
        <Col span={12} xs={24} sm={24} md={24} lg={12} className="link">
          <PageTitle className="title-page-my-account" content={pageData.titlePage} />
        </Col>
      </Row>
      <div className="col-input-full-width">
        <Row className="w-100">
          <Col span={24}>
              <Card className="my-account-card">
                <UserInformationComponent />
              </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}
