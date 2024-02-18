import { Col, Form, Row } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { backgroundTypeEnum } from "../../../constants/store-web-page.constants";
import SelectBackgroundComponent from "../../../components/select-background/select-background.component";
import SelectColorGroupComponent from "../../../components//select-color-group/select-color-group.component";
import CustomizationCollapseBlock from "../../../components/customization-block-component/customization-block.page";
import { BucketGeneralCustomizeIcon } from "../../../assets/icons.constants";
import { FnbInput } from "../../../components/fnb-input/fnb-input.component";

export default function BlogsCustomize(props) {
  const { form, updateFormValues, onChange, clickToScroll } = props;
  const bestDisplay = "1920 x 760 px";

  const [t] = useTranslation();
  const translatedData = {
    header: t("emailCampaign.header", "Header"),
    title: t("storeWebPage.menuSpecialTitle"),
    generalCustomization: t("storeWebPage.generalUse.generalCustomization"),
    image: t("storeWebPage.generalUse.image"),
    pleaseUploadBackgroundImage: t("storeWebPage.generalUse.pleaseUploadBackgroundImage"),
    selectLinkType: t("storeWebPage.generalUse.selectLinkType"),
    maxSizeUploadMb: 20,
    maxNumberOfAdvertisement: 2,
    blogsTitle: t("storeWebPage.blogsTitleCustomize", "Bài viết nổi bật"),
    blogsHeader: t("storeWebPage.blogsHeader", "TIN TỨC & KHUYẾN MÃI"),
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
      changedValue.key = ["config", "blogs", "generalCustomization", "backgroundColor"];
    } else {
      changedValue.key = ["config", "blogs", "generalCustomization", "backgroundImage"];
    }

    if (onChange) {
      onChange(changedValue);
    }
  };

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

  const renderGeneralCustomization = () => {
    return (
      <Row className="mt-2">
        <Col span={24} className="size-general">
          <SelectBackgroundComponent
            {...props}
            backgroundCustomize={form.getFieldsValue()?.config?.blogs?.generalCustomization}
            formItemPreName={["config", "blogs", "generalCustomization"]}
            onChangeBackgroundType={onChangeBackgroundType}
            bestDisplay={bestDisplay}
          />
          <SelectColorGroupComponent {...props} formItemPreName={["config", "blogs", "generalCustomization"]} />
        </Col>
        {/* Header */}
        <Col span={24}>
          <h3 className="fnb-form-label mt-16">{translatedData.header}</h3>
          <Form.Item name={["config", "blogs", "headerText"]}>
            <FnbInput showCount placeholder={translatedData.blogsHeader} maxLength={100} allowClear />
          </Form.Item>
        </Col>

        {/* Title */}
        <Col span={24}>
          <h3 className="fnb-form-label mt-16">{translatedData.title}</h3>
          <Form.Item name={["config", "blogs", "titleText"]}>
            <FnbInput showCount placeholder={translatedData.blogsTitle} maxLength={255} allowClear />
          </Form.Item>
        </Col>
      </Row>
    );
  };

  const groupCollapseBlogs = [
    {
      title: translatedData.generalCustomization,
      content: renderGeneralCustomization(),
      icon: <BucketGeneralCustomizeIcon />,
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
              {groupCollapseBlogs?.map((group, index) => {
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
