import { Modal } from "antd";
import { FnbTable } from "components/fnb-table/fnb-table";
import { CloseModalPurpleIcon } from "constants/icons.constants";
import { DateFormat } from "constants/string.constants";
import discountCodeDataService from "data-services/discount-code/discount-code-data.service";
import { useState } from "react";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { Link } from "react-router-dom";
import { formatDate, formatTextNumber, getCurrency } from "utils/helpers";
import "./view-discount-code.style.scss";

export const DiscountCodeUsageDetailComponent = forwardRef((props, ref) => {
  const { t, showModalUsageDetail, onCancel } = props;
  const [dataSource, setDataSource] = useState([]);
  const [discountCodeId, setDiscountCodeId] = useState(null);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  useImperativeHandle(ref, () => ({
    fetchData(discountCodeId) {
      setDiscountCodeId(discountCodeId);
      fetchDataTableAsync(currentPageNumber, tableSettings.pageSize, discountCodeId);
    },
  }));

  useEffect(() => {}, []);

  const fetchDataTableAsync = async (pageNumber, pageSize, discountCodeId) => {
    const responseData = await discountCodeDataService.getDiscountCodeUsageDetailAsync(
      pageNumber,
      pageSize,
      discountCodeId
    );

    if (responseData) {
      const { usageDetails, total, pageNumber } = responseData;
      const records = usageDetails?.map((item) => mappingRecordToColumns(item));
      setDataSource(records);
      setTotalRecords(total);
      setCurrentPageNumber(pageNumber);
    }
  };

  const mappingRecordToColumns = (item) => {
    return {
      index: item?.no,
      code: item?.discountCode,
      orderId: item?.orderId,
      orderCode: item?.orderCode,
      discountAmount: formatTextNumber(item?.discountAmount),
      orderDate: formatDate(item?.orderDate, DateFormat.DD_MM_YYYY_HH_MM),
    };
  };

  const pageData = {
    no: t("table.no"),
    title: t("discountCodeDetail.usageDetail.title"),
    code: t("discountCodeDetail.code.title"),
    orderId: t("discountCodeDetail.usageDetail.orderId"),
    discountAmount: t("discountCodeDetail.usageDetail.discountAmount"),
    orderDate: t("discountCodeDetail.usageDetail.orderDate"),
  };

  const tableSettings = {
    page: currentPageNumber,
    pageSize: 20,
    columns: [
      {
        title: pageData.no,
        dataIndex: "index",
        key: "index",
        width: "80px",
      },
      {
        title: pageData.code,
        dataIndex: "code",
        key: "code",
        width: "485px",
      },
      {
        title: pageData.orderId,
        dataIndex: "orderCode",
        key: "orderCode",
        width: "225px",
        render: (_, record) => {
          return (
            <Link to={`/report/order/detail/${record?.orderId}`} target="_blank">
              {record?.orderCode}
            </Link>
          );
        },
      },
      {
        title: `${pageData.discountAmount} (${getCurrency()})`,
        dataIndex: "discountAmount",
        key: "discountAmount",
        width: "312px",
      },
      {
        title: pageData.orderDate,
        dataIndex: "orderDate",
        key: "orderDate",
        width: "200px",
      },
    ],
    onChangePage: async (page, pageSize) => {
      await fetchDataTableAsync(page, pageSize, discountCodeId);
    },
  };

  return (
    <Modal
      width={1380}
      className="modal-usage-detail"
      open={showModalUsageDetail}
      closeIcon={<CloseModalPurpleIcon />}
      footer={(null, null)}
      onCancel={onCancel}
      forceRender={true}
      centered
    >
      <div className="title-container">
        <h3 className="modal-title mb-0">{pageData.title}</h3>
      </div>

      {/* Table usage detail */}
      <FnbTable
        className="table-usage-detail"
        columns={tableSettings.columns}
        dataSource={dataSource}
        onChangePage={tableSettings.onChangePage}
        pageSize={tableSettings.pageSize}
        currentPageNumber={currentPageNumber}
        total={totalRecords}
        scrollY={96 * 5}
      />
    </Modal>
  );
});
