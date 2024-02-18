import { Button, Card, Col, Form, Input, Row, Tooltip, Typography, message } from "antd";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import FnbCard from "components/fnb-card/fnb-card.component";
import FnbFroalaEditor from "components/fnb-froala-editor";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { FnbUploadImageComponent } from "components/fnb-upload-image/fnb-upload-image.component";
import PageTitle from "components/page-title";
import SelectBlogTagComponent from "components/select-tag-blog/select-tag-blog.components";
import TextDanger from "components/text-danger";
import { enumBlogResponse } from "constants/blog.constants";
import { DELAYED_TIME } from "constants/default.constants";
import { ExclamationIcon, IconBtnAdd, WarningIcon } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { DateFormat } from "constants/string.constants";
import blogDataService from "data-services/blog/blog-data.service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { convertSeoUrl, convertUtcToLocalTime } from "utils/helpers";
import "./create-blog.page.scss";
const { Text } = Typography;

export default function CreateBlogPage() {
  const [t] = useTranslation();
  const history = useHistory();
  const [blockNavigation, setBlockNavigation] = useState(false);
  const [image, setImage] = useState(null);

  const [categories, setCategories] = useState([]);
  const [disableCreateButton, setDisableCreateButton] = useState(false);
  const [isChangeForm, setIsChangeForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isClickSubmitForm, setIsClickSubmitForm] = useState(false);
  const [tagDataTemp, setTagDataTemp] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagError, setTagError] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState(null);
  const [showCategoryNameValidateMessage, setShowCategoryNameValidateMessage] = useState(false);
  const [isCategoryNameExisted, setIsCategoryNameExisted] = useState(false);
  const [SEOUrlLink, setSEOUrlLink] = useState("");
  const [SEOTitle, setSEOTitle] = useState("");
  const [SEODescription, setSEODescription] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [showBlogContentValidateMessage, setShowBlogContentValidateMessage] = useState(false);
  const [blogName, setBlogName] = useState("");
  const reduxState = useSelector((state) => state);
  const state = useSelector((state) => state);
  const userFullName = state?.session?.currentUser?.fullName;
  const createdTimeDefault = convertUtcToLocalTime(new Date()).format(DateFormat.DD_MM_YYYY);
  const [isShowWarningSEOTitle, setIsShowWarningSEOTitle] = useState(false);
  const [isShowWarningSEODescription, setIsShowWarningSEODescription] = useState(false);

  useEffect(() => {
    getInitData();
  }, []);

  const [form] = Form.useForm();
  const pageData = {
    title: t("blog.create.pageTitle"),
    btnCancel: t("button.cancel"),
    btnSave: t("button.create"),
    btnAddNew: t("button.addNew"),
    generalInformation: {
      title: t("productManagement.generalInformation.title"),
      name: {
        label: t("blog.create.blogTitle"),
        placeholder: t("blog.create.blogTitlePlaceholder"),
        required: true,
        maxLength: 255,
        validateMessage: t("blog.create.blogTitleValidateMessage"),
      },
      category: {
        label: t("blog.create.blogCategory"),
        placeholder: t("blog.create.blogCategoryPlaceholder"),
        required: true,
        blogCategoryValidateMessage: t("blog.create.blogCategoryValidateMessage"),
      },
      uploadImage: t("productManagement.generalInformation.addFile"),
      blogContent: {
        label: t("blog.create.blogContent"),
        required: true,
        validateMessage: t("blog.create.blogContentValidateMessage"),
        blogContentPlaceholder: t("blog.create.blogContentPlaceholder"),
      },
    },
    SEO: {
      title: t("blog.create.SEOConfiguration"),
      SEOUrlLink: t("blog.create.SEOUrlLink"),
      SEOTitle: t("blog.create.SEOTitle"),
      SEODescription: t("blog.create.SEODescription"),
      SEOKeywords: t("blog.create.SEOKeywords"),
      SEOUrlLinkPlaceholder: t("blog.create.SEOUrlLinkPlaceholder"),
      SEOTitlePlaceholder: t("blog.create.SEOTitlePlaceholder"),
      SEODescriptionPlaceholder: t("blog.create.SEODescriptionPlaceholder"),
      SEOKeywordsPlaceholder: t("blog.create.SEOKeywordsPlaceholder"),
      SEOPreview: t("blog.preview"),
      SEOOverviewTooltip: t("blog.create.SEOOverviewTooltip"),
      SEOUrlLinkTooltip: t("blog.create.SEOUrlLinkTooltip"),
      SEOTitleTooltip: t("blog.create.SEOTitleTooltip"),
      SEODescriptionTooltip: t("blog.create.SEODescriptionTooltip"),
      SEOKeywordsTooltip: t("blog.create.SEOKeywordsTooltip"),
    },
    media: {
      title: t("blog.create.media"),
      bannerTitle: t("blog.create.bannerTitle"),
      textNonImage: t("media.textNonImage"),
    },
    upload: {
      addFromUrl: t("upload.addFromUrl"),
    },
    discardBtn: t("button.discard"),
    confirmLeaveBtn: t("button.confirmLeave"),
    leaveDialog: {
      confirmation: t("leaveDialog.confirmation"),
      content: t("messages.leaveForm"),
    },
    bestDisplayImage: t("blog.bestDisplayImage"),
    createdBy: t("blog.createdBy"),
    createdTime: t("blog.createdTime"),
    tooltipCostPerCategory: t("material.tooltipCostPerCategory"),
    limitTagMessage: t("blog.limitTagMessage"),
    blogCategory: {
      blogCategoryPlaceholder: t("blog.create.blogCategoryPlaceholder"),
      blogCategoryNameValidateMessage: t("blog.create.blogCategoryNameValidateMessage"),
      blogCategoryExisted: t("blog.create.blogCategoryExisted"),
      recipe: t("productManagement.unit.recipe"),
    },
    createBlogSuccess: t("blog.create.createBlogSuccess"),
    createBlogFailed: t("blog.create.createBlogFailed"),
    urlBlogHasExisted: t("blog.create.urlBlogHasExisted"),
    messageMatchSuggestSEOTitle: t("blog.messageMatchSuggestSEOTitle"),
    messageMatchSuggestSEODescription: t("blog.messageMatchSuggestSEODescription"),
  };

  useEffect(() => {
    getInitData();
    getBlogTags();
  }, []);

  // validate form again if clicked submit form and change language

  const getInitData = async () => {
    await getCategories();
  };

  const getCategories = async () => {
    var resCategory = await blogDataService.getBlogCategoryAsync();
    if (resCategory) {
      setCategories(resCategory.blogCategories);
    }
  };

  const getBlogTags = async () => {
    var resBlogTag = await blogDataService.getBlogTagAsync();
    if (resBlogTag) {
      setTagDataTemp(resBlogTag.blogTags);
    }
  };

  const onSubmitForm = () => {
    setIsClickSubmitForm(true);
    if (blogContent.length === 0) {
      setShowBlogContentValidateMessage(true);
      return;
    }
    form
      .validateFields()
      .then(async (values) => {
        let request = {
          ...values,
          content: blogContent,
          bannerImageUrl: image?.url,
          blogTags: tags,
          SEOTitle: SEOTitle,
          SEODescription: SEODescription,
          description: blogContent.replace(/<.*?>/gm, "").slice(0, 200),
        };
        const res = await blogDataService.createBlogAsync(request);
        if (res?.isSuccess) {
          message.success(pageData.createBlogSuccess);
          onCompleted();
        } else {
          switch (res?.responseCode) {
            case enumBlogResponse.IsNotUniqueUrlEncode:
              message.error(pageData.urlBlogHasExisted);
              break;
            default:
              message.error(pageData.createBlogFailed);
              break;
          }
        }
      })
      .catch((errors) => {});
  };

  const onChangeImage = (file) => {
    setImage(file);
  };

  const onCancel = () => {
    if (isChangeForm) {
      setShowConfirm(true);
    } else {
      setShowConfirm(false);
      onCompleted();
      return history.push("/online-store/blog-management");
    }
  };

  const onDiscard = () => {
    setShowConfirm(false);
  };

  const onCompleted = () => {
    setIsChangeForm(false);
    setTimeout(() => {
      return history.push("/online-store/blog-management");
    }, DELAYED_TIME);
  };

  const changeForm = (e) => {
    setIsChangeForm(true);
    setDisableCreateButton(false);
  };

  const onAddNewCategory = async () => {
    if (!newCategoryName) {
      setShowCategoryNameValidateMessage(true);
      setIsCategoryNameExisted(false);
      return;
    }
    let res = await blogDataService.createBlogCategoryAsync({
      name: newCategoryName,
    });
    if (res.isSuccess) {
      /// Handle add new unit
      let newItem = {
        id: res.id,
        name: res.name,
      };
      setCategories([newItem, ...categories]);
      form.setFieldsValue({
        blogCategoryId: res.id,
      });
      setNewCategoryName(null);
      setIsCategoryNameExisted(false);
    } else {
      setIsCategoryNameExisted(true);
    }
  };

  //Enter Category name and check existed
  const onNameChange = (event) => {
    if (categories.filter((u) => u.name.trim() === event.target.value.trim()).length > 0) {
      setIsCategoryNameExisted(true);
    } else {
      setIsCategoryNameExisted(false);
    }
    setShowCategoryNameValidateMessage(false);
    setNewCategoryName(event.target.value);
  };

  const onChangeOption = (id) => {
    let formValue = form.getFieldsValue();

    formValue.blogCategoryId = id;
    form.setFieldsValue(formValue);
  };

  return (
    <>
      <Row className="fnb-row-page-header">
        <Col xs={24} sm={24} lg={12} md={12}>
          <p className="card-header">
            <PageTitle content={pageData.title} />
          </p>
        </Col>
        <Col span={12} xs={24} sm={24} md={12} lg={12}>
          <ActionButtonGroup
            arrayButton={[
              {
                action: (
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={disableCreateButton}
                    icon={<IconBtnAdd className="icon-btn-add-product" />}
                    className="btn-add-product"
                    onClick={onSubmitForm}
                  >
                    {pageData.btnSave}
                  </Button>
                ),
                permission: PermissionKeys.CREATE_BLOG,
              },
              {
                action: (
                  <a onClick={() => onCancel()} className="action-cancel">
                    {pageData.btnCancel}
                  </a>
                ),
                permission: null,
              },
            ]}
          />
        </Col>
      </Row>
      <Form
        form={form}
        name="basic"
        className="create-blog"
        onFieldsChange={(e) => changeForm(e)}
        autoComplete="off"
        onChange={() => {
          if (!blockNavigation) setBlockNavigation(true);
        }}
      >
        <div className="col-input-full-width">
          <Row className="grid-container">
            <Col className="left-create-product" xs={24} sm={24} md={24} lg={24}>
              <Card className="w-100 fnb-card h-auto blog-form">
                <Row className="mb-4">
                  <Col span={24}>
                    <h4 className="title-group">{pageData.generalInformation.title}</h4>

                    <h4 className="fnb-form-label">
                      {pageData.generalInformation.name.label}
                      <span className="text-danger">*</span>
                    </h4>
                    <Form.Item
                      name={"title"}
                      rules={[
                        {
                          required: pageData.generalInformation.name.required,
                          message: pageData.generalInformation.name.validateMessage,
                        },
                      ]}
                      validateFirst={true}
                    >
                      <Input
                        className="fnb-input"
                        placeholder={pageData.generalInformation.name.placeholder}
                        maxLength={pageData.generalInformation.name.maxLength}
                        id="product-name"
                        onChange={(e) => setBlogName(e.target.value)}
                        allowClear
                        showCount
                      />
                    </Form.Item>

                    <h4 className="fnb-form-label">
                      {pageData.generalInformation.category.label} <span className="text-danger">*</span>
                    </h4>
                    <Form.Item
                      name={"blogCategoryId"}
                      rules={[
                        {
                          required: pageData.generalInformation.category.required,
                          message: pageData.generalInformation.category.blogCategoryValidateMessage,
                        },
                      ]}
                    >
                      <FnbSelectSingle
                        onChange={onChangeOption}
                        className="unit-selector"
                        placeholder={pageData.blogCategory.blogCategoryPlaceholder}
                        allowClear
                        noTranslateOptionName
                        dropdownRender={(menu) => (
                          <>
                            <Row gutter={[16, 16]}>
                              <Col xs={24} sm={24} md={24} lg={14}>
                                <Input
                                  className="fnb-input unit-dropdown-input"
                                  allowClear="true"
                                  maxLength={100}
                                  onChange={(e) => {
                                    onNameChange(e);
                                  }}
                                  value={newCategoryName}
                                  id="blogCategory-input"
                                />
                                <TextDanger
                                  className="text-error-add-unit"
                                  visible={showCategoryNameValidateMessage}
                                  text={pageData.blogCategory.blogCategoryNameValidateMessage}
                                />
                                <TextDanger
                                  className="text-error-add-unit"
                                  visible={isCategoryNameExisted}
                                  text={pageData.blogCategory.blogCategoryExisted}
                                />
                              </Col>
                              <Col xs={24} sm={24} md={24} lg={10}>
                                <FnbAddNewButton
                                  onClick={() => onAddNewCategory()}
                                  className="mt-16 ml-24 mw-0"
                                  type="primary"
                                  text={pageData.btnAddNew}
                                ></FnbAddNewButton>
                              </Col>
                            </Row>
                            <Row>
                              <Col span={24}>
                                <div className={showCategoryNameValidateMessage ? "mt-10" : "mt-32"}>{menu}</div>
                              </Col>
                            </Row>
                          </>
                        )}
                        option={categories?.map((item) => ({
                          id: item.id,
                          name: item.name,
                        }))}
                      ></FnbSelectSingle>
                    </Form.Item>

                    <h4 className="fnb-form-label">
                      {pageData.generalInformation.blogContent.label} <span className="text-danger">*</span>
                    </h4>
                    <FnbFroalaEditor
                      value={blogContent}
                      placeholder={pageData.generalInformation.blogContent.blogContentPlaceholder}
                      onChange={(value) => {
                        if (value !== "" && value !== "<div></div>") setIsChangeForm(true);
                        setBlogContent(value);
                      }}
                      charCounterMax={-1}
                    />
                    <TextDanger
                      className="text-error-add-unit"
                      visible={showBlogContentValidateMessage}
                      text={pageData.generalInformation.blogContent.validateMessage}
                    />
                  </Col>
                </Row>
              </Card>
              <br />
            </Col>

            <Col className="price-product" style={{ marginTop: "-16px" }} xs={24} sm={24} md={24} lg={24}>
              <Card className="w-100 mt-1 fnb-card h-auto">
                <Row>
                  <Col span={24}>
                    <h4 className="title-group">{pageData.SEO.title}</h4>
                    <h4 className="fnb-form-label mt-3">
                      {pageData.SEO.SEOPreview}
                      <Tooltip
                        placement="topLeft"
                        title={() => {
                          return (
                            <span
                              dangerouslySetInnerHTML={{
                                __html: pageData.SEO.SEOOverviewTooltip,
                              }}
                            ></span>
                          );
                        }}
                        className=" material-edit-cost-per-unit-tool-tip"
                      >
                        <span>
                          <ExclamationIcon />
                        </span>
                      </Tooltip>
                    </h4>
                    <div className="create-blog-overview">
                      <a
                        style={{ fontSize: "18px" }}
                        href={`${reduxState?.session?.informationPublishStore?.domainName}/blog/${
                          !SEOUrlLink ? convertSeoUrl(blogName) : convertSeoUrl(SEOUrlLink)
                        }`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {`${reduxState?.session?.informationPublishStore?.domainName}/blog/${
                          !SEOUrlLink ? convertSeoUrl(blogName) : convertSeoUrl(SEOUrlLink)
                        }`}
                      </a>
                      <br />
                      <span style={{ fontSize: "18px" }}>{`<meta name="title" property="title" content="${
                        !SEOTitle ? "SEO on Title" : SEOTitle
                      }">`}</span>
                      <br />
                      <span style={{ fontSize: "18px" }}>
                        {`<meta name="description" property="description" content="${
                          !SEODescription ? "SEO on Description" : SEODescription
                        }">`}
                      </span>
                      <br />
                      <span style={{ fontSize: "18px" }}>
                        {`<meta name="keywords" property="keywords" content="${
                          tags.length > 0 ? tags.map((x) => x.name).join(",") : "SEO on Keywords"
                        }">`}
                      </span>
                    </div>
                    <h4 className="fnb-form-label mt-3">
                      {pageData.SEO.SEOUrlLink}
                      <Tooltip
                        placement="topLeft"
                        title={() => {
                          return (
                            <span
                              dangerouslySetInnerHTML={{
                                __html: pageData.SEO.SEOUrlLinkTooltip,
                              }}
                            ></span>
                          );
                        }}
                        className=" material-edit-cost-per-unit-tool-tip"
                      >
                        <span>
                          <ExclamationIcon />
                        </span>
                      </Tooltip>
                    </h4>
                    <Form.Item name={"SEOUrlLink"}>
                      <Input
                        className="fnb-input-with-count"
                        placeholder={pageData.SEO.SEOUrlLinkPlaceholder}
                        maxLength={2048}
                        onChange={(e) => setSEOUrlLink(e.target.value)}
                        showCount
                      />
                    </Form.Item>

                    <h4 className="fnb-form-label">
                      {pageData.SEO.SEOTitle}
                      <Tooltip
                        placement="topLeft"
                        title={() => {
                          return (
                            <span
                              dangerouslySetInnerHTML={{
                                __html: pageData.SEO.SEOTitleTooltip,
                              }}
                            ></span>
                          );
                        }}
                        className=" material-edit-cost-per-unit-tool-tip"
                      >
                        <span>
                          <ExclamationIcon />
                        </span>
                      </Tooltip>
                    </h4>
                    <Form.Item name={"SEOTitle"}>
                      <Input
                        className="fnb-input-with-count"
                        placeholder={pageData.SEO.SEOTitlePlaceholder}
                        maxLength={100}
                        onChange={(e) => {
                          setIsChangeForm(true);
                          e.target.value.length < 50 || e.target.value.length > 60
                            ? setIsShowWarningSEOTitle(true)
                            : setIsShowWarningSEOTitle(false);
                          setSEOTitle(e.target.value);
                        }}
                        showCount
                      />
                      <div hidden={!isShowWarningSEOTitle} className="seo-warning-message">
                        <div className="icon-warning">
                          <WarningIcon />
                        </div>
                        <div className="text-warning">
                          <span>{pageData.messageMatchSuggestSEOTitle}</span>
                        </div>
                      </div>
                    </Form.Item>

                    <h4 className="fnb-form-label">
                      {pageData.SEO.SEODescription}
                      <Tooltip
                        placement="topLeft"
                        title={() => {
                          return (
                            <span
                              dangerouslySetInnerHTML={{
                                __html: pageData.SEO.SEODescriptionTooltip,
                              }}
                            ></span>
                          );
                        }}
                        className=" material-edit-cost-per-unit-tool-tip"
                      >
                        <span>
                          <ExclamationIcon />
                        </span>
                      </Tooltip>
                    </h4>
                    <Form.Item name={"SEODescription"}>
                      <Input
                        className="fnb-input-with-count"
                        placeholder={pageData.SEO.SEODescriptionPlaceholder}
                        maxLength={255}
                        onChange={(e) => {
                          setIsChangeForm(true);
                          e.target.value.length < 155 || e.target.value.length > 160
                            ? setIsShowWarningSEODescription(true)
                            : setIsShowWarningSEODescription(false);
                          setSEODescription(e.target.value);
                        }}
                        showCount
                      />
                      <div hidden={!isShowWarningSEODescription} className="seo-warning-message">
                        <div className="icon-warning">
                          <WarningIcon />
                        </div>
                        <div className="text-warning">
                          <span>{pageData.messageMatchSuggestSEODescription}</span>
                        </div>
                      </div>
                    </Form.Item>

                    <h4 className="fnb-form-label">
                      {pageData.SEO.SEOKeywords}
                      <Tooltip
                        placement="topLeft"
                        title={() => {
                          return (
                            <span
                              dangerouslySetInnerHTML={{
                                __html: pageData.SEO.SEOKeywordsTooltip,
                              }}
                            ></span>
                          );
                        }}
                        className=" material-edit-cost-per-unit-tool-tip"
                      >
                        <span>
                          <ExclamationIcon />
                        </span>
                      </Tooltip>
                    </h4>
                    <Form.Item>
                      <SelectBlogTagComponent
                        tagDataTemp={tagDataTemp}
                        tags={tags}
                        setTags={setTags}
                        setTagError={setTagError}
                        setIsChangeForm={setIsChangeForm}
                      />
                      <span hidden={!tagError} className="customer-tag-error-message">
                        {pageData.limitTagMessage}
                      </span>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
              <br />
            </Col>

            <Col className="right-create-product" xs={24} sm={24} md={24} lg={24}>
              <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Card className="w-100 fnb-card h-auto">
                    <h4 className="title-group">{pageData.media.title}</h4>
                    <h4 className="fnb-form-label">{pageData.media.bannerTitle}</h4>
                    <Row className={`non-image ${image !== null ? "have-image" : ""}`}>
                      <Col span={24} className={`image-product ${image !== null ? "justify-left" : ""}`}>
                        <div style={{ display: "flex" }}>
                          <Form.Item>
                            <FnbUploadImageComponent
                              buttonText={pageData.generalInformation.uploadImage}
                              onChange={onChangeImage}
                            />
                          </Form.Item>
                          <a className="upload-image-url" hidden={image !== null ? true : false}>
                            {pageData.upload.addFromUrl}
                          </a>
                        </div>
                      </Col>
                      <Col span={24} className="text-non-image" hidden={image !== null ? true : false}>
                        <Text disabled>
                          {pageData.media.textNonImage}
                          <br />
                          {pageData.bestDisplayImage}
                        </Text>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
              <FnbCard className="mt-4">
                <Row gutter={[24, 24]}>
                  <Col sm={24} lg={24} className="w-100">
                    <Row className="mb-1 mt-3 create-blog-overview">
                      <Col span={24}>
                        <div className="left-column">{pageData.createdBy}</div>
                        <div className="right-column">
                          <div className="fnb-form-label-right">{userFullName ? userFullName : "-"}</div>
                        </div>
                      </Col>
                    </Row>
                    <Row style={{ margin: "15px" }}>
                      <Col span={24}>
                        <div className="left-column">{pageData.createdTime}</div>
                        <div className="right-column">
                          <div className="fnb-form-label-right">{createdTimeDefault ? createdTimeDefault : "-"}</div>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </FnbCard>
            </Col>
          </Row>
        </div>
      </Form>
      <DeleteConfirmComponent
        title={pageData.leaveDialog.confirmation}
        content={pageData.leaveDialog.content}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.discardBtn}
        okText={pageData.confirmLeaveBtn}
        onCancel={onDiscard}
        onOk={onCompleted}
        isChangeForm={isChangeForm}
      />
    </>
  );
}
