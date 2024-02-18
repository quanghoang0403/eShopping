import { EllipsisOutlined } from "@ant-design/icons";
import { Col, Modal, Popover, Row, Table } from "antd";
import FnbParagraph from "components/fnb-paragraph/fnb-paragraph";
import { FnbTable } from "components/fnb-table/fnb-table";
import { Thumbnail } from "components/thumbnail/thumbnail";
import { FolderIcon, IconCloseWithColor } from "constants/icons.constants";
import { DateFormat } from "constants/string.constants";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Link } from "react-router-dom";
import { formatDate, formatTextNumber, getCurrency } from "utils/helpers";
import "./flash-sale-usage-detail.style.scss";

export const FlashSaleUsageDetailComponent = forwardRef((props, ref) => {
  const { t, showModalUsageDetail, flashSaleDataService, onCancel } = props;
  const [dataSource, setDataSource] = useState([]);
  const [flashSaleId, setFlashSaleId] = useState(null);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  useImperativeHandle(ref, () => ({
    fetchData(flashSaleId) {
      setFlashSaleId(flashSaleId);
      fetchDataTableAsync(currentPageNumber, tableSettings.pageSize, flashSaleId);
    },
  }));

  useEffect(() => {}, []);

  const fetchDataTableAsync = async (pageNumber, pageSize, flashSaleId) => {
    const responseData = await flashSaleDataService?.getFlashSaleUsageDetailAsync(pageNumber, pageSize, flashSaleId);

    if (responseData) {
      const { flashSaleUsageDetails, total, pageNumber } = responseData;
      const records = flashSaleUsageDetails?.map((item) => mappingRecordToColumns(item));
      setDataSource(records);
      setTotalRecords(total);
      setCurrentPageNumber(pageNumber);
    }
  };

  const mappingRecordToColumns = (item) => {
    return {
      index: item?.no,
      orderId: item?.orderId,
      orderCode: item?.orderCode,
      discountAmount: formatTextNumber(item?.discountAmount),
      orderDate: formatDate(item?.orderDate, DateFormat.DD_MM_YYYY_HH_MM),
      products: item?.products,
    };
  };

  const pageData = {
    no: t("promotion.flashSale.flashSaleUsageDetail.no"),
    title: t("promotion.flashSale.flashSaleUsageDetail.title"),
    orderId: t("promotion.usageDetail.orderId"),
    discountAmount: t("promotion.usageDetail.discountAmount"),
    orderDate: t("promotion.usageDetail.orderDate"),
    products: t("promotion.flashSale.flashSaleUsageDetail.products"),
    allProducts: t("promotion.flashSale.flashSaleUsageDetail.allProducts"),
  };

  const showFullFlashSaleItem = (index) => {
    var columns = [
      {
        title: pageData.products,
        dataIndex: "name",
        align: "left",
        className: "product-flash-sale-usage-col",
        render: (_, record, index) => (
          <Row className="mb-4">
            <div className="table-selling-product-thumbnail flash-sale-product-thumbnail">
              <Thumbnail src={record?.thumbnail} />
            </div>
            <Col span={10} className="table-selling-product-no">
              <Row>
                <Col span={24} className="table-selling-product-text-product-name table-selling-product-name-overflow">
                  <FnbParagraph>{record?.productName}</FnbParagraph>
                </Col>
              </Row>
              <Row style={record?.productPriceName && { marginTop: "4px" }}>
                <Col span={24} className="table-selling-product-text-no table-selling-product-text-no-font-size">
                  {record?.productPriceName}
                </Col>
              </Row>
            </Col>
          </Row>
        ),
      },
    ];

    return (
      <>
        <Row className="group-header-top-selling-product-box">
          <Col xs={18} sm={18} lg={18}>
            <p style={{ color: "#2B2162" }}>{pageData.allProducts}</p>
          </Col>
          <Col xs={6} sm={6} lg={6} className="table-selling-product-see-more-text-align" hidden={true}>
            <p className="table-selling-product-see-more">{"topSellingProductSeemore"}</p>
          </Col>
        </Row>
        <Row>
          <Col span={24} className="product-header-table-flash-sale-usage-detail">
            <p>{"Product"}</p>
          </Col>
        </Row>
        <div className="top-selling-product-scroll">
          <div className="cc-wrapper cc-wrapper--scroll top-product-modal-table">
            <div className="ccw-table ccw-table--full">
              <Table
                locale={{
                  emptyText: (
                    <>
                      <p className="text-center table-emty-icon">
                        <FolderIcon />
                      </p>
                      <p className="text-center body-2 table-emty-text">{"noDataFound"}</p>
                    </>
                  ),
                }}
                className="fnb-table form-table table-selling-product table-flash-sale-usage-detail-body"
                columns={columns}
                dataSource={dataSource[index]?.products}
                pagination={false}
              />
            </div>
          </div>
        </div>
      </>
    );
  };

  const tableSettings = {
    page: currentPageNumber,
    pageSize: 20,
    columns: [
      {
        title: pageData.no,
        dataIndex: "index",
        key: "index",
        width: "94px",
      },
      {
        title: pageData.products,
        dataIndex: "name",
        align: "left",
        width: "482px",
        render: (_, record, index) =>
          record?.products.map((product, indexProduct) => {
            if (indexProduct < 5) {
              return (
                <>
                  <Row className="mb-4">
                    <div className="table-selling-product-thumbnail flash-sale-product-thumbnail">
                      <Thumbnail src={product?.thumbnail} />
                    </div>
                    <Col span={10} className="table-selling-product-no">
                      <Row>
                        <Col
                          span={24}
                          className="table-selling-product-text-product-name table-selling-product-name-overflow"
                        >
                          <FnbParagraph>{product?.productName}</FnbParagraph>
                        </Col>
                      </Row>
                      <Row style={product?.productPriceName && { marginTop: "4px" }}>
                        <Col
                          span={24}
                          className="table-selling-product-text-no table-selling-product-text-no-font-size"
                        >
                          {product?.productPriceName}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </>
              );
            } else if (indexProduct === 5) {
              return (
                <Row className="group-icon-show-more">
                  <Col span={24}>
                    <span className="icon-show-more left-12">
                      <Popover
                        trigger="click"
                        content={() => showFullFlashSaleItem(index)}
                        placement="topRight"
                        overlayClassName="popover-flash-sale-usage-detail"
                      >
                        <EllipsisOutlined
                          id={"icon-" + indexProduct.id}
                          style={{
                            fontSize: "21px",
                            textAlign: "center",
                          }}
                        />
                      </Popover>
                    </span>
                  </Col>
                </Row>
              );
            }
          }),
      },
      {
        title: pageData.orderId,
        dataIndex: "orderCode",
        key: "orderCode",
        width: "268px",
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
        width: "288px",
      },
      {
        title: pageData.orderDate,
        dataIndex: "orderDate",
        key: "orderDate",
        width: "175px",
      },
    ],
    onChangePage: async (page, pageSize) => {
      await fetchDataTableAsync(page, pageSize, flashSaleId);
    },
  };

  return (
    <Modal
      width={1380}
      className="modal-flash-sale-usage-detail"
      open={showModalUsageDetail}
      closeIcon={<IconCloseWithColor color="#50429B" />}
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
        scrollY={548}
      />
    </Modal>
  );
});
