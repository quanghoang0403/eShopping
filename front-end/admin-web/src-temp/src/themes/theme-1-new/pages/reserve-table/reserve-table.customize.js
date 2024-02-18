import { Col, Form, Row } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ReserveTableCustomizeIcon } from "../../assets/icons.constants";
import reserveTableBackground from "../../assets/images/reserve-table-background-default.png";
import CustomizationGroup from "../../components/customization-group-component/customization-group.page";
import { FnbInput } from "../../components/fnb-input/fnb-input.component";
import SelectBackgroundComponent from "../../components/select-background.component";
import SelectColorGroupComponent from "../../components/select-color-group.component";
import PageType from "../../constants/page-type.constants";
import { theme1ElementCustomize, theme1IdScrollView } from "../../constants/store-web-page.constants";
import defaultConfig from "../../default-store.config";
import { useSelector } from "react-redux";

function ReserveTableCustomize(props) {
  const { defaultActiveKey, clickToScroll, pageConfig, form } = props;
  const [t] = useTranslation();
  const [showHeader, setShowHeader] = useState(true);
  const [showReserveTable, setShowReserveTable] = useState(true);
  const initialConfig = useSelector((state) => state?.themeConfig?.data?.pages)?.find((page) => page?.id === PageType.RESERVE_TABLE_PAGE);

  useEffect(() => {
    setTimeout(() => {
      setFocusElement(clickToScroll);
    }, 100);
  }, []);
  useEffect(() => {
    const configTitle = form.getFieldsValue()?.config?.header?.title;
    if (!configTitle) {
      form.setFieldsValue({
        config: props?.pageConfig?.config ?? initialConfig?.config,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    } catch { }
  };
  const pageData = {
    title: t("storeWebPage.footerThemeConfiguration.title"),
    header: t("storeWebPage.header.title"),
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
          backgroundCustomize={pageConfig?.config?.header}
          bestDisplay={bestDisplay}
          maxSizeUploadMb={pageData.maxSizeUploadBackgroundImage}
          defaultThemeColor={defaultThemePageConfig?.config?.header?.backgroundColor}
          isRequired={false}
          nameComponents="ReservationReservation"
          defaultImage={reserveTableBackground}
          isImageSelectedDefault={true}
        />
        <SelectColorGroupComponent {...props} formItemPreName={["config", "header"]} />
        <Row gutter={[8, 16]} align="middle" className="row-header">
          <Col span={24}>{pageData.titleHeader}</Col>
          <Col span={24}>
            <Form.Item
              name={["config", "header", "title"]}
              rules={[
                {
                  type: "string",
                  max: 100,
                },
                { required: true, message: pageData.validTitle },
              ]}
            >
              <FnbInput className="fnb-input-with-count" placeholder={pageData.placeHolder} maxLength={100} showCount />
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
            backgroundCustomize={pageConfig?.config?.reservation}
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
      clickToScroll: theme1IdScrollView.HeaderReservation,
      customizeKey: theme1ElementCustomize.HeaderReservation,
      isShowRightIconWhenHoverMouse: true,
      isShowTooltip: false,
      titleIconRight: null,
    },
    {
      title: pageData.reservationTitle,
      content: renderReservation(),
      onChangeEye: pageData.border.reservation,
      icon: null,
      isShowKey: showReserveTable,
      clickToScroll: theme1IdScrollView.ReservationReservation,
      customizeKey: theme1ElementCustomize.ReservationReservation,
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
    title: "Reservation",
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
