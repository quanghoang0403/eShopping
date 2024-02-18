import { Col, Form, Row } from "antd";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { BucketGeneralCustomizeIcon, IntroductionCustomizationIcon } from "../../assets/icons.constants";
import { HYPERLINK_SELECT_OPTION, Hyperlink } from "../../constants/hyperlink.constants";
import { backgroundTypeEnum } from "../../constants/store-web-page.constants";
import CustomizationCollapseBlock from "../customization-block-component/customization-block.page";
import CustomizationGroup from "../customization-group-component/customization-group.page";
import { FnbAddNewButton } from "../fnb-add-new-button/fnb-add-new-button";
import { FnbEditor } from "../fnb-editor/fnb-editor.component";
import { FnbInput } from "../fnb-input/fnb-input.component";
import FnbSelectHyperlinkCustomize from "../fnb-select-hyperlink-customize/fnb-select-hyperlink-customize";
import { FnbTrashFillIcon } from "../fnb-trash-fill-icon/fnb-trash-fill-icon";
import FnbUploadBackgroundImageCustomizeComponent from "../fnb-upload-background-image-customize/fnb-upload-background-image-customize";
import SelectBackgroundComponent from "../select-background/select-background.component";
import SelectColorGroupComponent from "../select-color-group/select-color-group.component";
import SectionCollapse from "./components/section-collapse";
import FnbFroalaEditor from "../../components/fnb-froala-editor";

export const IntroductionCustomization = forwardRef((props, ref) => {
  const { form, prepareDataForHyperlink, updateFormValues, onChange, clickToScroll } = props;
  const [t] = useTranslation();
  const [pageContentEditor, setPageContentEditor] = useState("");
  const editorRef = useRef(null);
  const hyperlinkSelectOptions = HYPERLINK_SELECT_OPTION.filter((a) => a.id !== Hyperlink.SUB_MENU);

  const pageData = {
    generalCustomization: t("onlineStore.introductionConfiguration.generalCustomization", "General customization"),
    introduction: {
      title: t("onlineStore.introductionConfiguration.introduction.title", "Introduction"),
      introductionCustomization: {
        title: t(
          "onlineStore.introductionConfiguration.introduction.introductionCustomization.title",
          "Introduction customization",
        ),
        image: t("onlineStore.introductionConfiguration.introduction.introductionCustomization.image", "Image"),
        header: {
          title: t(
            "onlineStore.introductionConfiguration.introduction.introductionCustomization.header.title",
            "Header",
          ),
          placeholder: t(
            "onlineStore.introductionConfiguration.introduction.introductionCustomization.header.placeholder",
            "Input header",
          ),
        },
        titleHeader: {
          title: t(
            "onlineStore.introductionConfiguration.introduction.introductionCustomization.titleHeader.title",
            "Title",
          ),
          placeholder: t(
            "onlineStore.introductionConfiguration.introduction.introductionCustomization.titleHeader.placeholder",
            "Input title",
          ),
        },
        description: t(
          "onlineStore.introductionConfiguration.introduction.introductionCustomization.description",
          "Description",
        ),
        buttonLabel: {
          title: t(
            "onlineStore.introductionConfiguration.introduction.introductionCustomization.buttonLabel.title",
            "Button label",
          ),
          placeholder: t(
            "onlineStore.introductionConfiguration.introduction.introductionCustomization.buttonLabel.placeholder",
            "Input label",
          ),
        },
        hyperlink: {
          title: t(
            "onlineStore.introductionConfiguration.introduction.introductionCustomization.hyperlink.title",
            "Hyperlink",
          ),
          placeholder: t(
            "onlineStore.introductionConfiguration.introduction.introductionCustomization.hyperlink.placeholder",
            "Select link type",
          ),
        },
      },
      highlight: {
        title: t("onlineStore.introductionConfiguration.introduction.highlight.title", "Highlights"),
        section: {
          title: t("onlineStore.introductionConfiguration.introduction.highlight.section.title", "Section"),
          default: t("onlineStore.introductionConfiguration.introduction.highlight.section.default", "Section default"),
          addNew: t("onlineStore.introductionConfiguration.introduction.highlight.section.addNew", "Add new section"),
          icon: t("onlineStore.introductionConfiguration.introduction.highlight.section.icon", "Icon"),
          header: {
            title: t("onlineStore.introductionConfiguration.introduction.highlight.section.header.title", "Header"),
            placeholder: t(
              "onlineStore.introductionConfiguration.introduction.highlight.section.header.placeholder",
              "Input header",
            ),
          },
          content: {
            title: t("onlineStore.introductionConfiguration.introduction.highlight.section.content.title", "Content"),
            placeholder: t(
              "onlineStore.introductionConfiguration.introduction.highlight.section.content.placeholder",
              "Input content",
            ),
          },
          hyperlink: {
            title: t(
              "onlineStore.introductionConfiguration.introduction.highlight.section.hyperlink.title",
              "Hyperlink",
            ),
            placeholder: t(
              "onlineStore.introductionConfiguration.introduction.highlight.section.hyperlink.placeholder",
              "Select link type",
            ),
          },
        },
      },
    },
    maxSizeUploadMb: 20,
    maxNumberOfSection: 4,
  };

  useEffect(() => {
    if (updateFormValues) {
      updateFormValues();
    }
    getInitData();
  }, []);

  useImperativeHandle(ref, () => ({}));

  const getInitData = () => {
    const contentEditor = form.getFieldsValue()?.config?.introduction?.introductionCustomization?.description;
    setPageContentEditor(contentEditor);
  };

  const onChangeHyperlink = (e, index, isSection) => {
    let changedValue = null;
    if (isSection === true) {
      changedValue = {
        key: ["config", "introduction", "introductionCustomization", "sections", index, "url"],
        value: null,
      };
    } else {
      changedValue = {
        key: ["config", "introduction", "introductionCustomization", "url"],
        value: null,
      };
    }

    if (onChange) {
      onChange(changedValue);
    }
  };

  const onChangeBackgroundType = (value) => {
    let changedValue = {
      key: [],
      value: null,
    };
    if (value === backgroundTypeEnum.Image) {
      changedValue.key = ["config", "introduction", "generalCustomization", "backgroundColor"];
    } else {
      changedValue.key = ["config", "introduction", "generalCustomization", "backgroundImage"];
    }

    if (onChange) {
      onChange(changedValue);
    }
  };
  //#endregion

  const renderGeneralCustomization = () => {
    return (
      <Row className="mt-2">
        <Col span={24} className="size-general">
          <SelectBackgroundComponent
            {...props}
            backgroundCustomize={form.getFieldsValue()?.config?.introduction?.generalCustomization}
            formItemPreName={["config", "introduction", "generalCustomization"]}
            onChangeBackgroundType={onChangeBackgroundType}
          />
          <SelectColorGroupComponent {...props} formItemPreName={["config", "introduction", "generalCustomization"]} />
        </Col>
      </Row>
    );
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

  //#region render Highlight sections
  const renderHighlight = () => {
    return (
      <Form.List name={["config", "introduction", "introductionCustomization", "sections"]}>
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => {
              return (
                <div key={field.name}>
                  <SectionCollapse
                    className="section-collapse"
                    title={
                      field.name === 0
                        ? `${pageData.introduction.highlight.section.default}`
                        : `${pageData.introduction.highlight.section.title} ${field.name}`
                    }
                    isNormal={true}
                    content={renderSection(field)}
                    defaultActiveKey={777}
                    icon={field.name !== 0 && <FnbTrashFillIcon />}
                    onClickIconRight={field.name !== 0 ? () => remove(field.name) : () => null}
                  ></SectionCollapse>
                </div>
              );
            })}
            <FnbAddNewButton
              className="mt-3"
              onClick={() => add()}
              text={pageData.introduction.highlight.section.addNew}
              disabled={fields && fields?.length === pageData.maxNumberOfSection ? true : false}
            ></FnbAddNewButton>
          </>
        )}
      </Form.List>
    );
  };

  const renderSection = (field) => {
    return (
      <>
        <Row>
          {/* Icon */}
          <Col span={24}>
            <h3 className="fnb-form-label mt-16">{pageData.introduction.highlight.section.icon}</h3>
            <Form.Item name={[field.name, "icon"]}>
              <FnbUploadBackgroundImageCustomizeComponent
                bestDisplay={"60 x 60 px"}
                maxSizeUploadMb={pageData.maxSizeUploadMb}
              />
            </Form.Item>
          </Col>

          {/* Header */}
          <Col span={24}>
            <h3 className="fnb-form-label mt-16">{pageData.introduction.highlight.section.header.title}</h3>
            <Form.Item name={[field.name, "header"]}>
              <FnbInput
                showCount
                placeholder={pageData.introduction.highlight.section.header.placeholder}
                maxLength={100}
              />
            </Form.Item>
          </Col>

          {/* Content */}
          <Col span={24}>
            <h3 className="fnb-form-label mt-16">{pageData.introduction.highlight.section.content.title}</h3>
            <Form.Item name={[field.name, "content"]}>
              <FnbInput
                showCount
                placeholder={pageData.introduction.highlight.section.content.placeholder}
                maxLength={255}
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
                placeholder={pageData.introduction.introductionCustomization.hyperlink.placeholder}
                option={hyperlinkSelectOptions}
                formItemHyperlinkTypePath={[field.name, "hyperlink"]}
                formItemHyperlinkValuePath={[field.name, "url"]}
                prepareDataForHyperLink={prepareDataForHyperlink}
                onChangeHyperlinkType={(e) => onChangeHyperlink(e, field.name, true)}
                defaultValue={
                  form.getFieldsValue()?.config?.introduction?.introductionCustomization?.sections[field.name]
                    ?.hyperlink
                }
              />
            </div>
          </Col>

          {/* Hidden values */}
          <Form.Item name={[field.name, "id"]} initialValue={""} hidden></Form.Item>
          <Form.Item name={[field.name, "isDefault"]} initialValue={false} hidden></Form.Item>
        </Row>
      </>
    );
  };
  //#endregion

  const renderIntroduction = () => {
    const groupCollapse = [
      {
        title: pageData.introduction.introductionCustomization.title,
        content: renderIntroductionCustomization(),
        icon: "",
      },
      {
        title: pageData.introduction.highlight.title,
        content: renderHighlight(),
        icon: "",
      },
    ];

    return (
      <div>
        {groupCollapse?.map((group, index) => {
          return (
            <CustomizationGroup
              title={group.title}
              isNormal={true}
              defaultActiveKey={888}
              content={group.content}
              icon={group.icon}
            ></CustomizationGroup>
          );
        })}
      </div>
    );
  };

  const renderIntroductionCustomization = () => {
    return (
      <Row>
        {/* Image */}
        <Col span={24}>
          <h3 className="fnb-form-label mt-16">{pageData.introduction.introductionCustomization.image}</h3>
          <Form.Item name={["config", "introduction", "introductionCustomization", "image"]}>
            <FnbUploadBackgroundImageCustomizeComponent
              bestDisplay={"571 x 447 px"}
              maxSizeUploadMb={pageData.maxSizeUploadMb}
            />
          </Form.Item>
        </Col>

        {/* Header */}
        <Col span={24}>
          <h3 className="fnb-form-label mt-16">{pageData.introduction.introductionCustomization.header.title}</h3>
          <Form.Item name={["config", "introduction", "introductionCustomization", "header"]}>
            <FnbInput
              showCount
              placeholder={pageData.introduction.introductionCustomization.header.placeholder}
              maxLength={100}
            />
          </Form.Item>
        </Col>

        {/* Title */}
        <Col span={24}>
          <h3 className="fnb-form-label mt-16">{pageData.introduction.introductionCustomization.titleHeader.title}</h3>
          <Form.Item name={["config", "introduction", "introductionCustomization", "title"]}>
            <FnbInput
              showCount
              placeholder={pageData.introduction.introductionCustomization.titleHeader.placeholder}
              maxLength={255}
            />
          </Form.Item>
        </Col>

        {/* Description */}
        <Col span={24}>
          <h3 className="fnb-form-label mt-16">{pageData.introduction.introductionCustomization.description}</h3>
          <Form.Item className="mb-0" name={["config", "introduction", "introductionCustomization", "description"]}>
            <FnbFroalaEditor value={pageContentEditor} onChange={(value) => setPageContentEditor(value)} />
          </Form.Item>
        </Col>

        {/* Button label */}
        <Col span={24}>
          <h3 className="fnb-form-label mt-16">{pageData.introduction.introductionCustomization.buttonLabel.title}</h3>
          <Form.Item name={["config", "introduction", "introductionCustomization", "buttonLabel"]}>
            <FnbInput
              showCount
              placeholder={pageData.introduction.introductionCustomization.buttonLabel.placeholder}
              maxLength={100}
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
              placeholder={pageData.introduction.introductionCustomization.hyperlink.placeholder}
              option={hyperlinkSelectOptions}
              formItemHyperlinkTypePath={["config", "introduction", "introductionCustomization", "hyperlink"]}
              formItemHyperlinkValuePath={["config", "introduction", "introductionCustomization", "url"]}
              prepareDataForHyperLink={prepareDataForHyperlink}
              onChangeHyperlinkType={(e) => onChangeHyperlink(e, null, false)}
              defaultValue={form.getFieldsValue()?.config?.introduction?.introductionCustomization?.hyperlink}
            />
          </div>
        </Col>
      </Row>
    );
  };

  const groupCollapseIntroduction = [
    {
      title: pageData.generalCustomization,
      content: renderGeneralCustomization(),
      icon: <BucketGeneralCustomizeIcon />,
    },
    {
      title: pageData.introduction.title,
      content: renderIntroduction(),
      icon: <IntroductionCustomizationIcon />,
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
              {groupCollapseIntroduction?.map((group, index) => {
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
});
