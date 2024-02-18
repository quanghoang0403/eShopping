import { Button, Col, Form, message, Radio, Row, Modal } from "antd";
import { Content } from "antd/lib/layout/layout";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import FnbCard from "components/fnb-card/fnb-card.component";
import PageTitle from "components/page-title";
import {
  ageConditionOptions,
  customerDataOptions,
  genderConditionOptions,
  monthsInYearOptions,
  objectiveOptions,
  orderConditionOptions,
  orderDataOptions,
  registrationDateConditionOptions,
} from "constants/customer-segment-condition-option.constants";
import {
  customerDataEnum,
  objectiveEnum,
  orderDataEnum,
  registrationDateConditionEnum,
} from "constants/customer-segment-condition.constants";
import { DELAYED_TIME } from "constants/default.constants";
import { DateFormat } from "constants/string.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import customerDataService from "data-services/customer/customer-data.service";
import storeDataService from "data-services/store/store-data.service";
import moment from "moment";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import "./view-customer-segment.scss";

export default function ViewCustomerSegment(props) {
  const { t, history, customerSegmentDataService } = props;
  const isTabletMode = useMediaQuery({ maxWidth: 850 });
  const [listPlatforms, setListPlatforms] = useState([]);
  const [listCustomerTag, setListCustomerTag] = useState([]);
  const [customerSegment, setCustomerSegment] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);

  const pageData = {
    title: t("customerSegment.updateCustomerSegment"),
    btnLeave: t("button.leave"),
    btnEdit: t("button.edit"),
    btnDelete: t("button.delete"),
    btnAddNew: t("button.addNew"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    confirmDeleteMessage: t("messages.confirmDeleteMessage"),
    name: {
      label: t("customerSegment.segmentName"),
      placeholder: t("customerSegment.namePlaceholder"),
      required: true,
      maxLength: 100,
      validateMessage: t("customerSegment.nameValidateMessage"),
    },
    namePlaceholder: t("customerSegment.namePlaceholder"),
    condition: {
      title: t("customerSegment.condition.title"),
      objective: t("customerSegment.condition.objective"),
      condition: t("customerSegment.condition.condition"),
      customerData: t("customerSegment.condition.customerData"),
      orderData: t("customerSegment.condition.orderData"),
      registrationDate: t("customerSegment.condition.registrationDate"),
      birthday: {
        label: t("customerSegment.condition.birthday"),
        placeholder: t("customerSegment.condition.birthdayPlaceholder"),
        required: true,
        validateMessage: t("customerSegment.condition.birthdayValidateMessage"),
      },
      gender: t("customerSegment.condition.gender"),
      tag: t("customerSegment.condition.tag"),
      tags: {
        label: t("customerSegment.condition.tags"),
        placeholder: t("customerSegment.condition.tagsPlaceholder"),
        required: true,
        validateMessage: t("customerSegment.condition.tagsValidateMessage"),
      },
      on: t("customerSegment.condition.on"),
      before: t("customerSegment.condition.before"),
      after: t("customerSegment.condition.after"),
      time: {
        label: t("customerSegment.condition.time"),
        placeholder: t("customerSegment.condition.timePlaceholder"),
        required: true,
        validateMessage: t("customerSegment.condition.timeValidateMessage"),
      },
      male: t("customerSegment.condition.male"),
      is: t("customerSegment.condition.is"),
      are: t("customerSegment.condition.are"),
      totalOrders: t("customerSegment.condition.totalOrders"),
      totalPurchaseAmount: {
        label: t("customerSegment.condition.totalPurchaseAmount"),
        placeholder: t("customerSegment.condition.totalPurchaseAmountPlaceholder"),
        required: true,
        validateMessage: t("customerSegment.condition.totalPurchaseAmountValidateMessage"),
        max: 999999999,
        min: 0,
        format: "^[0-9]*$",
      },
      isEqual: t("customerSegment.condition.isEqual"),
      isLargerThan: t("customerSegment.condition.isLargerThan"),
      isLessThan: t("customerSegment.condition.isLessThan"),
      orderNumber: {
        label: t("customerSegment.condition.orderNumber"),
        placeholder: t("customerSegment.condition.orderNumberPlaceholder"),
        required: true,
        validateMessage: t("customerSegment.condition.orderNumberValidateMessage"),
      },
      allTime: t("customerSegment.condition.allTime"),
      thisWeek: t("customerSegment.condition.thisWeek"),
      thisMonth: t("customerSegment.condition.thisMonth"),
      thisYear: t("customerSegment.condition.thisYear"),
      amount: t("customerSegment.condition.amount"),
      add: t("customerSegment.condition.addCondition"),
      ifAnyMatch: t("customerSegment.condition.ifAnyMatch"),
      allMatch: t("customerSegment.condition.allMatch"),
      age: t("customerSegment.condition.age"),
      platformValidateMessage: t("customerSegment.condition.platformValidateMessage"),
      tagValidateMessage: t("customerSegment.condition.tagValidateMessage"),
      ageValidateMessage: t("customerSegment.condition.ageValidateMessage"),
      platformPlaceholder: t("customerSegment.condition.platformPlaceholder"),
      tagPlaceholder: t("customerSegment.condition.tagPlaceholder"),
      agePlaceholder: t("customerSegment.condition.agePlaceholder"),
      ageRankValidateMessage: t("customerSegment.condition.ageRankValidateMessage"),
      days: t("customerSegment.condition.days"),
      daysTillNow: t("customerSegment.condition.daysTillNow"),
    },
    cancelText: t("button.ignore"),
    okText: t("button.confirmLeave"),
    leaveWarningMessage: t("messages.leaveWarningMessage"),
    customerSegmentUpdateSuccess: t("customerSegment.customerSegmentUpdateSuccess"),
    discardBtn: t("button.discard"),
    leaveDialog: {
      confirmation: t("leaveDialog.confirmation"),
      content: t("messages.leaveForm"),
    },
    generalInformation: t("customer.generalInformation"),
    valueShouldBeFrom0to999999999: t("customerSegment.condition.valueShouldBeFrom0to999999999"),
    valueShouldBeFrom0to10000: t("customerSegment.condition.valueShouldBeFrom0to10000"),
    allTime: t("optionDatetime.allTime"),
    customerSegmentDeleteSuccess: t("customerSegment.customerSegmentDeleteSuccess"),
    customerSegmentDeleteFail: t("customerSegment.customerSegmentDeleteFail"),
  };

  useEffect(() => {
    setInitData();
  }, []);

  const setInitData = async () => {
    let resPlatform = await storeDataService.getAllPlatformActivatedAsync();
    if (resPlatform) {
      setListPlatforms(resPlatform.platforms);
    }

    let resCustomerTag = await customerDataService.getCustomerTagAsync();
    if (resCustomerTag) {
      setListCustomerTag(resCustomerTag.tags);
    }

    const { customerSegmentId } = props?.match?.params;
    if (customerSegmentId) {
      customerSegmentDataService.getCustomerSegmentByIdAsync(customerSegmentId).then((response) => {
        if (response) {
          const { customerSegment } = response;
          setCustomerSegment(customerSegment);
        }
      });
    }
  };

  /// render multiple conditions
  const renderConditions = () => {
    return customerSegment.customerSegmentConditions?.map((condition, index) => {
      return renderCondition(condition, index);
    });
  };

  /// Render single condition
  const renderCondition = (condition, index) => {
    const objective = objectiveOptions?.filter((item) => item.id === condition.objectiveId ?? objectiveEnum.customerData) ?? [];
    const objectiveName = objective.length > 0 ? t(objective[0]?.name) : "-";
    return (
      <>
        <Row key={index}>
          <Col
            sm={24}
            xs={24}
            lg={5}
            style={
              isTabletMode ? { maxWidth: "266px", marginLeft: "40px" } : { paddingRight: "16px", marginLeft: "40px" }
            }
          >
            {index !== 0 && isTabletMode && (
              <hr style={{ border: "1px solid #F1EEFF", width: "100%", margin: "12px 0 42px 0" }} />
            )}
            <p className="text-label-segment">{pageData.condition.objective}</p>
            <p className="text-detail-segment">{objectiveName}</p>
          </Col>
          <Col
            sm={24}
            xs={24}
            lg={15}
            className="customer-segment-data"
          >
            {condition?.objectiveId === objectiveEnum.customerData && renderOptionCustomerData(condition, index)}
            {condition?.objectiveId === objectiveEnum.orderData && renderOptionOrderData(condition, index)}
          </Col>
        </Row>
      </>
    );
  };

  /// Render Customer data
  const renderOptionCustomerData = (condition, index) => {
    const customerData = customerDataOptions?.filter((item) => item.id === condition?.customerDataId ?? customerDataEnum.registrationDate) ?? [];
    const customerDataName = customerData.length > 0 ? t(customerData[0]?.name) : "";
    const registrationDateCondition = registrationDateConditionOptions?.filter((item) => item.id === condition?.registrationDateConditionId ?? registrationDateConditionEnum.on) ?? [];
    const registrationDateConditionName = registrationDateCondition.length > 0 ? t(registrationDateCondition[0]?.name) : "-";
    const registrationTime = condition?.registrationTime ? moment.utc(condition?.registrationTime).local().format(DateFormat.DD_MM_YYYY) : "-";
    const monthsInYear = monthsInYearOptions?.filter((item) => item.id === condition?.birthday) ?? [];
    const monthsInYearName = monthsInYear.length > 0 ? t(monthsInYear[0]?.name) : "-";
    const genderCondition = genderConditionOptions?.filter((item) => item.id === condition?.gender) ?? [];
    const genderConditionName = genderCondition.length > 0 ? t(genderCondition[0]?.name) : "-";
    const customerTag = listCustomerTag?.filter((item) => item.id === condition?.tagId) ?? [];
    const customerTagName = customerTag.length > 0 ? t(customerTag[0]?.name) : "-";
    const ageCondition = ageConditionOptions?.filter((item) => item.id === condition?.ageConditionId) ?? [];
    const ageConditionName = ageCondition.length > 0 ? t(ageCondition[0]?.name) : "-";
    const platform = listPlatforms?.filter((item) => item.id === condition?.platformId) ?? [];
    const platformName = platform.length > 0 ? t(platform[0]?.name) : "-";
    return (
      <>
        <Row key={index}>
          <Col
            sm={24}
            xs={24}
            lg={6}
            style={
              isTabletMode ? { maxWidth: "266px", marginLeft: "40px" } : { paddingRight: "16px", marginLeft: "0px" }
            }
          >
            <div className={`${!isTabletMode && "ml-2"}`}>
              <p className="text-label-segment">{pageData.condition.customerData}</p>
              <p className="text-detail-segment">{customerDataName}</p>
            </div>
          </Col>
          <Col sm={24} xs={24} lg={18}>
            {condition?.customerDataId === customerDataEnum.registrationDate && (
              <Row>
                <Col
                  sm={24}
                  xs={24}
                  lg={8}
                  style={
                    isTabletMode
                      ? { maxWidth: "266px", marginLeft: "40px" }
                      : { paddingRight: "16px", marginLeft: "0px" }
                  }
                >
                  <div className={`${!isTabletMode && "ml-2"}`}>
                    <p className="text-label-segment">{pageData.condition.condition}</p>
                    <p className="text-detail-segment">{registrationDateConditionName}</p>
                  </div>
                </Col>
                <Col
                  sm={24}
                  xs={24}
                  lg={8}
                  style={
                    isTabletMode
                      ? { maxWidth: "266px", marginLeft: "40px" }
                      : { paddingRight: "16px", marginLeft: "0px" }
                  }
                >
                  <div className={`${!isTabletMode && "ml-2"}`}>
                    <p className="text-label-segment">{pageData.condition.time.label}</p>
                    <p className="text-detail-segment">{registrationTime}</p>
                  </div>
                </Col>
              </Row>
            )}
            {condition?.customerDataId === customerDataEnum.birthday && (
              <Row>
                <Col
                  sm={24}
                  xs={24}
                  lg={8}
                  style={
                    isTabletMode
                      ? { maxWidth: "266px", marginLeft: "40px", paddingBottom: "10px" }
                      : { textAlign: "center", paddingTop: "36px" }
                  }
                >
                  <h4 className="text-detail-segment">{pageData.condition.on}</h4>
                </Col>
                <Col
                  sm={24}
                  xs={24}
                  lg={8}
                  style={isTabletMode ? { maxWidth: "266px", marginLeft: "40px" } : { paddingRight: "16px" }}
                >
                  <p className="text-label-segment">{pageData.condition.time.label}</p>
                  <p className="text-detail-segment">{monthsInYearName}</p>
                </Col>
              </Row>
            )}
            {condition?.customerDataId === customerDataEnum.gender && (
              <>
                <Row>
                  <Col
                    sm={24}
                    xs={24}
                    lg={8}
                    style={
                      isTabletMode
                        ? { maxWidth: "266px", marginLeft: "40px", paddingBottom: "10px" }
                        : { textAlign: "center", paddingTop: "36px" }
                    }
                  >
                    <p className="text-detail-segment">{pageData.condition.is}</p>
                  </Col>
                  <Col
                    sm={24}
                    xs={24}
                    lg={8}
                    style={
                      isTabletMode
                        ? { maxWidth: "266px", marginLeft: "40px", paddingBottom: "-20px", marginTop: "0px" }
                        : { paddingTop: "8px", marginTop: "32px" }
                    }
                  >
                    <p className="text-detail-segment">{genderConditionName}</p>
                  </Col>
                </Row>
              </>
            )}
            {condition?.customerDataId === customerDataEnum.tag && (
              <>
                <Row>
                  <Col
                    sm={24}
                    xs={24}
                    lg={8}
                    style={
                      isTabletMode
                        ? { maxWidth: "266px", marginLeft: "40px", paddingBottom: "10px" }
                        : { textAlign: "center", paddingTop: "36px" }
                    }
                  >
                    <p className="text-detail-segment">{pageData.condition.is}</p>
                  </Col>
                  <Col
                    sm={24}
                    xs={24}
                    lg={8}
                    style={
                      isTabletMode
                        ? { maxWidth: "266px", marginLeft: "40px" }
                        : { paddingRight: "16px", marginLeft: "0px" }
                    }
                  >
                    <p className="text-label-segment">{pageData.condition.tags.label}</p>
                    <p className="text-detail-segment">{customerTagName}</p>
                  </Col>
                </Row>
              </>
            )}
            {condition?.customerDataId === customerDataEnum.age && (
              <Row>
                <Col
                  sm={24}
                  xs={24}
                  lg={8}
                  style={
                    isTabletMode
                      ? { maxWidth: "266px", marginLeft: "40px" }
                      : { paddingRight: "16px", marginLeft: "0px" }
                  }
                >
                  <div className={`${!isTabletMode && "ml-2"}`}>
                    <p className="text-label-segment">{pageData.condition.condition}</p>
                    <p className="text-detail-segment">{ageConditionName}</p>
                  </div>
                </Col>
                <Col
                  sm={24}
                  xs={24}
                  lg={8}
                  style={
                    isTabletMode
                      ? { maxWidth: "266px", marginLeft: "40px" }
                      : { paddingRight: "16px", marginLeft: "0px" }
                  }
                >
                  <div className={`${!isTabletMode && "ml-2"}`}>
                    <p className="text-label-segment">{pageData.condition.age}</p>
                    <p className="text-detail-segment">{condition?.age}</p>
                  </div>
                </Col>
              </Row>
            )}
            {condition?.customerDataId === customerDataEnum.platform && (
              <>
                <Row>
                  <Col
                    sm={24}
                    xs={24}
                    lg={8}
                    style={
                      isTabletMode
                        ? { maxWidth: "266px", marginLeft: "40px", paddingBottom: "10px" }
                        : { textAlign: "center", paddingTop: "36px" }
                    }
                  >
                    <p className="text-detail-segment">{pageData.condition.are}</p>
                  </Col>
                  <Col
                    sm={24}
                    xs={24}
                    lg={8}
                    style={
                      isTabletMode
                        ? { maxWidth: "266px", marginLeft: "40px" }
                        : { paddingRight: "16px", marginLeft: "0px" }
                    }
                  >
                    <p className="text-label-segment">{t("platform.title")}</p>
                    <p className="text-detail-segment">{platformName}</p>
                  </Col>
                </Row>
              </>
            )}
          </Col>
        </Row>
      </>
    );
  };

  /// Render Order data
  const renderOptionOrderData = (condition, index) => {
    const orderData = orderDataOptions?.filter((item) => item.id === condition?.orderDataId) ?? [];
    const orderDataName = orderData.length > 0 ? t(orderData[0]?.name) : "-";
    const orderCondition = orderConditionOptions?.filter((item) => item.id === condition?.orderConditionId) ?? [];
    const orderConditionName = orderCondition.length > 0 ? t(orderCondition[0]?.name) : "-";
    const orderStartTime = condition?.orderStartTime ? moment.utc(condition?.orderStartTime).local().format(DateFormat.DD_MM_YYYY) : "";
    const orderEndTime = condition?.orderEndTime ? moment.utc(condition?.orderEndTime).local().format(DateFormat.DD_MM_YYYY) : "";
    const orderTime = orderStartTime && orderEndTime ? (orderStartTime + " - " + orderEndTime) : pageData.allTime;
    return (
      <>
        <Row key={index}>
          <Col
            sm={24}
            xs={24}
            lg={6}
            style={
              isTabletMode ? { maxWidth: "266px", marginLeft: "40px" } : { paddingRight: "16px", marginLeft: "0px" }
            }
          >
            <div className={`${!isTabletMode && "ml-2"}`}>
              <p className="text-label-segment">{pageData.condition.orderData}</p>
              <p className="text-detail-segment">{orderDataName}</p>
            </div>
          </Col>
          <Col sm={24} xs={24} lg={18}>
            <Row>
              <Col
                sm={24}
                xs={24}
                lg={8}
                style={
                  isTabletMode ? { maxWidth: "266px", marginLeft: "40px" } : { paddingRight: "16px", marginLeft: "0px" }
                }
              >
                <div className={`${!isTabletMode && "ml-2"}`}>
                  <p className="text-label-segment">{pageData.condition.condition}</p>
                  <p className="text-detail-segment">{orderConditionName}</p>
                </div>
              </Col>
              <Col
                sm={24}
                xs={24}
                lg={8}
                style={
                  isTabletMode ? { maxWidth: "266px", marginLeft: "40px" } : { paddingRight: "16px", marginLeft: "0px" }
                }
              >
                {condition?.orderDataId === orderDataEnum.totalCompletedOrders && (
                  <div className={`${!isTabletMode && "ml-2"}`}>
                    <p className="text-label-segment">{pageData.condition.orderNumber.label}</p>
                    <p className="text-detail-segment">{condition?.orderNumber || 0}</p>
                  </div>
                )}
                {condition?.orderDataId === orderDataEnum.totalPurchasedAmount && (
                  <div className={`${!isTabletMode && "ml-2"}`}>
                    <p className="text-label-segment">{pageData.condition.totalPurchaseAmount.label}</p>
                    <p className="text-detail-segment">{condition?.purchasedAmount || 0}</p>
                  </div>
                )}
                {condition?.orderDataId === orderDataEnum.days && (
                  <div className={`${!isTabletMode && "ml-2"}`}>
                    <p className="text-label-segment">{pageData.condition.days}</p>
                    <p className="text-detail-segment">
                      {isTabletMode
                        ? `${(condition?.days || 0)} ${pageData.condition.daysTillNow}`
                        : (condition?.days || 0)
                      }
                    </p>
                  </div>
                )}
              </Col>
              {!isTabletMode && <Col
                sm={24}
                xs={24}
                lg={8}
                style={
                  isTabletMode ? { maxWidth: "266px", marginLeft: "40px" } : { paddingRight: "16px", marginLeft: "0px" }
                }
              >
                {condition?.orderDataId !== orderDataEnum.days ? (
                  <div className={`${!isTabletMode && "ml-2"}`}>
                    <p className="text-label-segment">{pageData.condition.time.label}</p>
                    <p className="text-detail-segment">{orderTime}</p>
                  </div>
                ) : (
                  <div className="day-box">
                    <p className="day-text">{pageData.condition.daysTillNow}</p>
                  </div>
                )}
              </Col>}
            </Row>
          </Col>
        </Row>
      </>
    );
  };

  const onCompleted = () => {
    setTimeout(() => {
      return history.push("/customer/segment");
    }, DELAYED_TIME);
  };


  const onCancel = () => {
    onCompleted();
  };

  const handleDeleteCustomerSegment = async () => {
    const id = customerSegment.id;
    var res = await customerSegmentDataService.deleteCustomerSegmentByIdAsync(id);
    if (res) {
      message.success(pageData.customerSegmentDeleteSuccess);
      onCompleted();
    } else {
      message.error(pageData.customerSegmentDeleteFail);
    }
  };

  // Insert the name into the message
  const formatDeleteMessage = (name) => {
    let mess = t(pageData.confirmDeleteMessage, { name: name });
    return mess;
  };

  return (
    <>
      <Row gutter={[16, 16]} className="fnb-row-page-header">
        <Col xs={24} sm={24} lg={12}>
          <p className="card-header">
            <PageTitle content={customerSegment?.name} className="text-name-overflow" />
          </p>
        </Col>
        <Col xs={24} sm={24} lg={12}>
          <ActionButtonGroup
            arrayButton={[
              {
                action: (
                  <Button
                    type="primary"
                    onClick={() => history.push(`/customer/segment/edit/${customerSegment?.id}`)}
                    className="button-edit"
                  >
                    {pageData.btnEdit}
                  </Button>
                ),
                permission: PermissionKeys.EDIT_SEGMENT,
              },
              {
                action: (
                  <a onClick={() => onCancel()} className="action-cancel">
                    {pageData.btnLeave}
                  </a>
                ),
                permission: null,
              },
              {
                action: (
                  <a className="action-delete" onClick={() => setIsModalVisible(true)}>
                    {pageData.btnDelete}
                  </a>
                ),
                permission: PermissionKeys.DELETE_SEGMENT,
              },
            ]}
          />
        </Col>
      </Row>
      <Content>
        <FnbCard title={pageData.generalInformation} className="pt-4 mt-4 detail-container-info">
          <Row className="mb-2 mt-4">
            <Col span={24}>
              <p className="text-label-segment">{pageData.name.label}</p>
              <p className="text-detail-segment">{customerSegment.name}</p>
            </Col>
          </Row>
        </FnbCard>
      </Content>
      <div className="clearfix"></div>
      <Content>
        <FnbCard title={pageData.condition.condition} className="pt-4 mt-4 detail-container-condition">
          <Row className="mt-4 mb-2" style={{ width: "100%" }}>
            <Col span={24}>
              <Form.Item name="isAllMatch">
                {customerSegment.isAllMatch
                  ? <Radio className="" value={true} checked>{pageData.condition.allMatch}</Radio>
                  : <Radio className="" value={true} checked>{pageData.condition.ifAnyMatch}</Radio>
                }
              </Form.Item>
              {renderConditions()}
            </Col>
          </Row>
        </FnbCard>
      </Content>

      <Modal
        className={`delete-confirm-modal`}
        title={pageData.confirmDelete}
        visible={isModalVisible}
        okText={pageData.btnDelete}
        okType={"danger"}
        closable={false}
        cancelText={pageData.cancelText}
        onOk={handleDeleteCustomerSegment}
        onCancel={() => setIsModalVisible(false)}
      >
        <span dangerouslySetInnerHTML={{ __html: `${formatDeleteMessage(customerSegment?.name)}` }}></span>
      </Modal>
    </>
  );
}
