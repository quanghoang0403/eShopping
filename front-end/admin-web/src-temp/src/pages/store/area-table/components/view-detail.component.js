import { Col, Modal, Row } from "antd";
import { NoDataFoundComponent } from "components/no-data-found/no-data-found.component";
import { Thumbnail } from "components/thumbnail/thumbnail";
import { CloseModalIcon, ThumbnailDefault } from "constants/icons.constants";
import { SizeScreen } from "constants/size-screen.constants";
import { useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import useWindowDimensions from "utils/check-screen";
import { formatNumber } from "utils/helpers";
import "./view-detail.component.scss";

export const ViewDetailComponent = (props) => {
  const [t] = useTranslation();
  const { isModalVisible, dataViewDetail, closeViewDetail, titleDescription } = props;
  const checkScreen = useWindowDimensions();
  const widthModal = checkScreen === SizeScreen.IS_TABLET ? 984 : 1336;
  const pageData = {
    areaName: t("area.areaName"),
    areaTableName: t("areaTable.tableForm.nameTable"),
    seat: t("areaTable.seat"),
    status: t("area.status"),
    imageIsNotUploaded: t("area.imageIsNotUploaded"),
  };
  useLayoutEffect(() => {}, [dataViewDetail]);

  return (
    <Modal
      className="modal-view-area-table"
      title={dataViewDetail?.title}
      closeIcon={
        <div className="close-modal-icon" onClick={closeViewDetail}>
          <CloseModalIcon width={16} height={16} />
        </div>
      }
      open={isModalVisible}
      footer={(null, null)}
      width={widthModal}
    >
      <Row className="box-container">
        <Col span={8} xl={8} md={8} xs={24} style={{ flex: 1 }}>
          <div className="box-left-info">
            <Row className="image-detail">
              {dataViewDetail?.imageUrl ? (
                <Thumbnail src={dataViewDetail?.imageUrl} width={400} height={400} />
              ) : (
                <div className="box-thumbnail-default">
                  <ThumbnailDefault width={72} height={72} />
                  <span className="text-image-no-updated">{pageData.imageIsNotUploaded}</span>
                </div>
              )}
            </Row>
            <Row className="name-detail">
              <Row className="w-100">
                <Col span={8}>{pageData.areaName}:</Col>
                <Col span={16} className="parent-name">
                  {dataViewDetail?.parentName ? dataViewDetail?.parentName : dataViewDetail?.name}
                </Col>
              </Row>
              {dataViewDetail?.parentName ? (
                <>
                  <Row className="w-100">
                    <Col span={8}>{pageData.areaTableName}:</Col>
                    <Col span={16} className="parent-name">
                      {dataViewDetail?.name}
                    </Col>
                  </Row>
                  <Row className="w-100">
                    <Col span={8}>{pageData.seat}:</Col>
                    <Col span={16}>{formatNumber(dataViewDetail?.numberOfSeat)}</Col>
                  </Row>
                </>
              ) : null}
              <Row className="w-100">
                <Col span={8}>{pageData.status}:</Col>
                <Col span={16}>
                  <div className={`area-status ${dataViewDetail?.status ? "active" : "in-active"}`}>
                    {dataViewDetail?.statusName}
                  </div>
                </Col>
              </Row>
            </Row>
          </div>
        </Col>
        <Col span={16} xl={16} md={16} xs={24} style={{ flex: 3 }} className="description-container">
          <div style={{ marginLeft: 10, marginBottom: 16 }}>
            <span className="title-description">{titleDescription}</span>
          </div>
          {dataViewDetail?.description ? (
            <div className="text-line-description">
              <div
                style={{ paddingRight: "14px" }}
                dangerouslySetInnerHTML={{ __html: dataViewDetail?.description }}
              ></div>
            </div>
          ) : (
            <div className="no-data">
              <NoDataFoundComponent />
            </div>
          )}
        </Col>
      </Row>
    </Modal>
  );
};
