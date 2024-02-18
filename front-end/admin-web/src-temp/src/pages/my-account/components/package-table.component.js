import { Button, Col, Row } from "antd";
import { BadgePackageStatus } from "components/badge-package-status";
import { FnbTable } from "components/fnb-table/fnb-table";
import { DateFormat } from "constants/string.constants";
import packageDataService from "data-services/package/package-data.service";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function PackageTable(props) {
  const { showBillingComponent } = props;
  const [t] = useTranslation();

  const [initData, setInitData] = useState([]);
  const pageData = {
    no: t("table.no"),
    status: t("table.status"),
    package: t("packageTable.package"),
    subScriptionDate: t("packageTable.subScriptionDate"),
    subScriptionPackage: t("packageTable.subScriptionPackage"),
    expiryDate: t("packageTable.expiryDate"),
    renew: t("packageTable.renew"),
    viewServicePackage: t("packageTable.viewServicePackage"),
    activeSubscriptionPackage: t("packageTable.activeSubscriptionPackage"),
  };

  useEffect(() => {
    packageDataService.getListPackageOrderAsync().then((res) => {
      if (res.packageOrders) {
        setInitData(res.packageOrders);
      }
    });
  }, []);

  const tableSettings = {
    pageSize: 20,
    columns: [
      {
        title: pageData.no,
        dataIndex: "no",
        key: "no",
        align: "left",
        width: "5%",
      },
      {
        title: pageData.package,
        dataIndex: "package",
        key: "package",
        align: "left",
        width: "25%",
      },
      {
        title: pageData.subScriptionDate,
        dataIndex: "subScriptionDate",
        key: "subScriptionDate",
        align: "left",
        width: "20%",
      },
      {
        title: pageData.expiryDate,
        dataIndex: "expiryDate",
        key: "expiryDate",
        align: "left",
        width: "20%",
      },
      {
        title: pageData.status,
        dataIndex: "packageStatus",
        key: "status",
        className: "grid-status-column",
        align: "left",
        width: "20%",
        render: (value, record) => {
          return (
            <>
              <BadgePackageStatus packageStatus={record?.packageStatusId} />
            </>
          );
        },
      },
    ],
  };

  const dataSource = () => {
    const dataSource = [];
    initData?.map((item, index) => {
      const subScriptionDate = moment.utc(item?.createdTime).local().format(DateFormat.DD_MM_YYYY);
      let expiryDate = "";
      if (item?.expiredDate) {
        expiryDate = moment.utc(item?.expiredDate).local().format(DateFormat.DD_MM_YYYY);
      }

      const record = {
        no: (index += 1),
        package: t(item?.packageName),
        subScriptionDate: subScriptionDate,
        expiryDate: expiryDate,
        status: item?.enumOrderPaymentStatusName,
        packageStatus: t(item?.enumPackageStatus),
        packageStatusId: item?.enumPackageStatusId,
      };
      dataSource.push(record);
    });
    return dataSource;
  };

  return (
    <>
      <Row>
        <Col span={12}>
          <h2>{pageData.subScriptionPackage}</h2>
        </Col>
        <Col span={12} className="text-right">
          <Button onClick={() => showBillingComponent()}>{pageData.viewServicePackage}</Button>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col span={24}>
          <FnbTable columns={tableSettings.columns} pageSize={tableSettings.pageSize} dataSource={dataSource()} />
        </Col>
      </Row>
    </>
  );
}
