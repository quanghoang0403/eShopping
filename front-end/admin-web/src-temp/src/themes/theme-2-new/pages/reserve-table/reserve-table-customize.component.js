import { Col, Form, Row } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ReserveTableCustomizeIcon } from "../../assets/icons.constants";
import reserveTableBackground from "../../assets/images/reserve-table-default-image.jpg";
import CustomizationGroup from "../../components/customization-group-component/customization-group.page";
import { FnbInput } from "../../components/fnb-input/fnb-input.component";
import SelectBackgroundComponent from "../../components/select-background/select-background.component";
import SelectColorGroupComponent from "../../components/select-color-group/select-color-group.component";
import PageType from "../../constants/page-type.constants";
import { theme2ElementCustomize, theme2IdScrollView } from "../../constants/store-web-page.constants";
import defaultConfig from "../../default-store.config";

function ReserveTableCustomize(props) {
  const { defaultActiveKey, clickToScroll } = props;
  const [t] = useTranslation();
  const [showHeader, setShowHeader] = useState(true);
  const [showReserveTable, setShowReserveTable] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setFocusElement(clickToScroll);
    }, 100);
  }, []);
  const setFocusElement = (elementId) => {
    try {
      const element = document.querySelector(elementId);
      if (element) {
        // set border element on focused
        element.className = "tc-on-focus";
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        window.oldElements = elementId;
      }
    } catch {}
  };

  const pageData = {
    title: t("storeWebPage.footerThemeConfiguration.title"),
    header: t("storeWebPage.header.title"),
    body: t("storeWebPage.body"),
    placeHolder: t("reserve.enterPageTitle"),
    validTitle: t("reserve.pleaseEnterThePageTitle"),
    reservationTitle: "Reservation",
    titleHeader: t("storeWebPage.footerThemeConfiguration.title"),
    maxSizeUploadMb: 5,
    maxSizeUploadBackgroundImage: 20,
    border: {
      header: "#reservationHeader",
      reservation: "#reservationReservation",
    },
  };

  const bestDisplay = "1920 x 569 px";
  const defaultThemePageConfig = defaultConfig?.pages?.find((p) => p.id === PageType.RESERVE_TABLE_PAGE);

  const onChangeCollapse = (key, tag) => {
    switch (tag) {
      case pageData.border.header:
        key.length <= 0 ? setShowHeader(false) : setShowHeader(true);
        break;
      case pageData.border.reservation:
        key.length <= 0 ? setShowReserveTable(false) : setShowReserveTable(true);
        break;
      default:
        break;
    }
  };

  const renderHeader = () => {
    return (
      <Row id={`_${pageData.border.header}`} className="mt-2" clickToScroll={clickToScroll}>
        <SelectBackgroundComponent
          {...props}
          formItemPreName={["config", "header"]}
          backgroundCustomize={props?.pageConfig?.config?.header}
          bestDisplay={bestDisplay}
          maxSizeUploadMb={pageData.maxSizeUploadBackgroundImage}
          defaultThemeColor={defaultThemePageConfig?.config?.header?.backgroundColor}
          isRequired={false}
          nameComponents="ReservationReservation"
          defaultImage={reserveTableBackground}
          isImageSelectedDefault={true}
        />
        <SelectColorGroupComponent {...props} formItemPreName={["config", "header"]} />
        <Row align="middle" className="row-header w-100">
          <Col span={24}>{pageData.titleHeader}</Col>
          <Col span={24} className="mt-8">
            <Form.Item
              name={["config", "header", "title"]}
              rules={[
                {
                  type: "string",
                  max: 255,
                },
                { required: true, message: pageData.validTitle },
              ]}
            >
              <FnbInput
                className="fnb-input-with-count"
                placeholder={pageData.placeHolder}
                maxLength={255}
                showCount
                defaultValue="Reservation"
              />
            </Form.Item>
          </Col>
        </Row>
      </Row>
    );
  };

  const renderReservation = () => {
    return (
      <>
        <Row id={`_${pageData.border.reservation}`} className="mt-2">
          <SelectBackgroundComponent
            {...props}
            formItemPreName={["config", "reservation"]}
            bestDisplay={bestDisplay}
            backgroundCustomize={props?.pageConfig?.config?.reservation}
            defaultThemeColor={defaultThemePageConfig?.config?.reservation?.backgroundColor}
            isRequired={false}
            nameComponents="ReservationReservation"
          />
          <SelectColorGroupComponent {...props} formItemPreName={["config", "reservation"]} />
        </Row>
      </>
    );
  };

  const groupCollapse = [
    {
      title: pageData.header,
      content: renderHeader(),
      onChangeEye: pageData.border.header,
      icon: null,
      isShowKey: showHeader,
      clickToScroll: theme2IdScrollView.HeaderReservation,
      customizeKey: theme2ElementCustomize.HeaderReservation,
      isShowRightIconWhenHoverMouse: true,
      isShowTooltip: false,
      titleIconRight: null,
    },
    {
      title: pageData.body,
      content: renderReservation(),
      onChangeEye: pageData.border.reservation,
      icon: null,
      isShowKey: showReserveTable,
      clickToScroll: theme2IdScrollView.ReservationReservation,
      customizeKey: theme2ElementCustomize.ReservationReservation,
      isShowRightIconWhenHoverMouse: true,
      isShowTooltip: false,
      titleIconRight: null,
    },
  ];
  return (
    <>
      {groupCollapse?.map((group, index) => {
        return (
          <CustomizationGroup
            title={group.title}
            isNormal={true}
            defaultActiveKey={defaultActiveKey + "." + ++index}
            content={group.content}
            icon={group.icon}
            className={"size-group"}
            isShowKey={group.isShowKey}
            onChangeCollapse={(value) => onChangeCollapse(value, group.onChangeEye)}
            clickToScroll={group.clickToScroll}
            customizeKey={group.customizeKey}
            isShowRightIconWhenHoverMouse={group.isShowRightIconWhenHoverMouse}
            isShowTooltip={group.isShowTooltip}
            titleIconRight={group.titleIconRight}
          ></CustomizationGroup>
        );
      })}
    </>
  );
}
export const ReserveTableCustomizes = [
  {
    icon: <ReserveTableCustomizeIcon />,
    title: "reservation.title",
    isNormal: true,
    defaultActiveKey: 1,
    iconRight: <></>,
    collapsible: false,
    isShowRightIconWhenHoverMouse: true,
    content: (props) => {
      return (
        <>
          <ReserveTableCustomize {...props} />
        </>
      );
    },
  },
];
