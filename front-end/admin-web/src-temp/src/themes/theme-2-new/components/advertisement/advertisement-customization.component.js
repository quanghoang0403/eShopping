import { Col, Form, Row } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AdvertisementStoreWebIcon, BucketGeneralCustomizeIcon } from "../../assets/icons.constants";
import { Hyperlink, HYPERLINK_SELECT_OPTION } from "../../constants/hyperlink.constants";
import CustomizationCollapseBlock from "../customization-block-component/customization-block.page";
import CustomizationGroup from "../customization-group-component/customization-group.page";
import { FnbAddNewButton } from "../fnb-add-new-button/fnb-add-new-button";
import { FnbTrashFillIcon } from "../fnb-trash-fill-icon/fnb-trash-fill-icon";
import SelectBackgroundComponent from "../select-background/select-background.component";
import SelectColorGroupComponent from "../select-color-group/select-color-group.component";
import FnbUploadBackgroundImageCustomizeComponent from "../fnb-upload-background-image-customize/fnb-upload-background-image-customize";
import FnbSelectHyperlinkCustomize from "../fnb-select-hyperlink-customize/fnb-select-hyperlink-customize";
import { backgroundTypeEnum } from "../../constants/store-web-page.constants";

export default function AdvertisementCustomization(props) {
  const { form, prepareDataForHyperlink, updateFormValues, onChange, clickToScroll } = props;
  const [t] = useTranslation();
  const hyperlinkSelectOptions = HYPERLINK_SELECT_OPTION.filter((a) => a.id !== Hyperlink.SUB_MENU);
  const fieldPreName = ["config", "advertisement", "advertisementItems"];
  const translatedData = {
    advertisement: {
      title: t("storeWebPage.advertisement.title"),
      titleDefault: t("storeWebPage.advertisement.titleDefault"),
      titleCustomize: t("storeWebPage.advertisement.titleCustomize"),
      titleIndex: t("storeWebPage.advertisement.titleIndex"),
      btnAddNew: t("storeWebPage.advertisement.btnAddNew"),
      tooltipTitleDelete: t("storeWebPage.advertisement.tooltipTitleDelete"),
    },
    generalCustomization: t("storeWebPage.generalUse.generalCustomization"),
    hyperlink: t("storeWebPage.generalUse.hyperlink"),
    image: t("storeWebPage.generalUse.image"),
    pleaseUploadBackgroundImage: t("storeWebPage.generalUse.pleaseUploadBackgroundImage"),
    selectLinkType: t("storeWebPage.generalUse.selectLinkType"),
    maxSizeUploadMb: 20,
    maxNumberOfAdvertisement: 2,
  };

  useEffect(() => {
    if (updateFormValues) {
      updateFormValues();
    }
    setTimeout(() => {
      setFocusElement(clickToScroll);
    }, 100);
  }, []);

  //#region On change
  const onChangeBackgroundType = (value) => {
    let changedValue = {
      key: [],
      value: null,
    };
    if (value === backgroundTypeEnum.Image) {
      changedValue.key = ["config", "advertisement", "generalCustomization", "backgroundColor"];
    } else {
      changedValue.key = ["config", "advertisement", "generalCustomization", "backgroundImage"];
    }

    if (onChange) {
      onChange(changedValue);
    }
  };

  const onChangeHyperlink = (e, index) => {
    const changedValue = {
      key: ["config", "advertisement", "advertisementItems", index, "hyperlinkValue"],
      value: null,
    };
    if (onChange) {
      onChange(changedValue);
    }
  };
  //#endregion

  const removeOldFocusElement = () => {
    // Remove old focus
    let oldElementId = window.oldElements;
    const oldElement = document.querySelector(oldElementId);
    if (oldElement) {
      oldElement.className = "";
    }
  };

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

  //#region Render advertisement
  const renderAdvertisement = () => {
    return (
      <Form.List name={["config", "advertisement", "advertisementItems"]}>
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => {
              return (
                <div key={field.name}>
                  <CustomizationGroup
                    title={
                      field.name === 0
                        ? `${translatedData.advertisement.titleDefault}`
                        : `${translatedData.advertisement.title} ${field.name}`
                    }
                    isNormal={true}
                    content={renderAdvertisementItem(field)}
                    defaultActiveKey={777}
                    icon={field.name !== 0 && <FnbTrashFillIcon />}
                    isShowRightIconWhenHoverMouse={true}
                    onClickIconRight={field.name !== 0 ? () => remove(field.name) : () => null}
                  ></CustomizationGroup>
                </div>
              );
            })}
            <FnbAddNewButton
              className="mt-3"
              onClick={() => add()}
              text={translatedData.advertisement.btnAddNew}
              disabled={fields && fields?.length === translatedData.maxNumberOfAdvertisement ? true : false}
            ></FnbAddNewButton>
          </>
        )}
      </Form.List>
    );
  };

  const renderAdvertisementItem = (field) => {
    return (
      <Row>
        {/* Image */}
        <Col span={24}>
          <h3 className="fnb-form-label mt-16">{translatedData.image}</h3>
          <Form.Item name={[field.name, "imageUrl"]}>
            <FnbUploadBackgroundImageCustomizeComponent
              bestDisplay={"1920 x 760 px"}
              maxSizeUploadMb={translatedData.maxSizeUploadMb}
            />
          </Form.Item>
        </Col>

        {/* Hyperlink */}
        <Col span={24}>
          <div className="mt-16">
            <FnbSelectHyperlinkCustomize
              showSearch
              allowClear
              fixed
              placeholder={translatedData.selectLinkType}
              option={hyperlinkSelectOptions}
              formItemHyperlinkTypePath={[field.name, "hyperlinkType"]}
              formItemHyperlinkValuePath={[field.name, "hyperlinkValue"]}
              prepareDataForHyperLink={prepareDataForHyperlink}
              onChangeHyperlinkType={(e) => onChangeHyperlink(e, field.name)}
              defaultValue={form.getFieldsValue()?.config?.advertisement?.advertisementItems[field.name]?.hyperlinkType}
              fieldPreName={fieldPreName}
              form={form}
            />
          </div>
        </Col>
      </Row>
    );
  };
  //#endregion

  const renderGeneralCustomization = () => {
    return (
      <Row className="mt-2">
        <Col span={24} className="size-general">
          <SelectBackgroundComponent
            {...props}
            backgroundCustomize={form.getFieldsValue()?.config?.advertisement?.generalCustomization}
            formItemPreName={["config", "advertisement", "generalCustomization"]}
            onChangeBackgroundType={onChangeBackgroundType}
          />
          <SelectColorGroupComponent {...props} formItemPreName={["config", "advertisement", "generalCustomization"]} />
        </Col>
      </Row>
    );
  };

  const groupCollapseAdvertisement = [
    {
      title: translatedData.generalCustomization,
      content: renderGeneralCustomization(),
      icon: <BucketGeneralCustomizeIcon />,
    },
    {
      title: translatedData.advertisement.titleCustomize,
      content: renderAdvertisement(),
      icon: <AdvertisementStoreWebIcon />,
    },
  ];

  return (
    <div
      onClick={() => {
        removeOldFocusElement();
        setFocusElement(clickToScroll);
      }}
    >
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Row gutter={[24, 24]}>
            <Col sm={24} lg={24} className="w-100">
              {groupCollapseAdvertisement?.map((group, index) => {
                return (
                  <CustomizationCollapseBlock
                    title={group.title}
                    isNormal={true}
                    content={group.content}
                    defaultActiveKey={999}
                    icon={group.icon}
                  />
                );
              })}
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}
