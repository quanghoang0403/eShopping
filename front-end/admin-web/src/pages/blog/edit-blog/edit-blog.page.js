import { Button, Card, Col, Form, Input, Row, Tooltip, message } from "antd";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import FnbCard from "components/fnb-card/fnb-card.component";
import FnbFroalaEditor from "components/fnb-froala-editor";
import { FnbImageSelectComponent } from "components/fnb-image-select/fnb-image-select.component";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import PageTitle from "components/page-title";
import SelectBlogTagComponent from "pages/blog/components/select-tag-blog.components";
import TextDanger from "components/text-danger";
import { DELAYED_TIME } from "constants/default.constants";
import { ExclamationIcon, WarningIcon } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { DateFormat } from "constants/string.constants";
import blogDataService from "data-services/blog/blog-data.service";
import { error } from "jquery";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import {
  convertSeoUrl,
  convertUtcToLocalTime,
  formatNumber,
} from "utils/helpers";
import "./edit-blog.page.scss";
import { enumBlogResponse } from "constants/blog.constants";

export default function EditBlogPage(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const [blockNavigation, setBlockNavigation] = useState(false);
  const fnbImageSelectRef = useRef();

  const [categories, setCategories] = useState([]);
  const [disableCreateButton, setDisableCreateButton] = useState(false);
  const [isChangeForm, setIsChangeForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [tagDataTemp, setTagDataTemp] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagError, setTagError] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState(null);
  const [showCategoryNameValidateMessage, setShowCategoryNameValidateMessage] =
    useState(false);
  const [isCategoryNameExisted, setIsCategoryNameExisted] = useState(false);
  const [urlLink, setUrlSEO] = useState("");
  const [titleSEO, setTitleSEO] = useState("");
  const [descriptionSEO, setDescriptionSEO] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [showBlogContentValidateMessage, setShowBlogContentValidateMessage] =
    useState(false);
  const [blogName, setBlogName] = useState("");
  const reduxState = useSelector((state) => state);
  const [blog, setBlog] = useState({});
  const [isShowWarningSEOTitle, setIsShowWarningSEOTitle] = useState(false);
  const [isShowWarningSEODescription, setIsShowWarningSEODescription] =
    useState(false);
  const [checkBlogContentLoaded, setCheckBlogContentLoaded] = useState(false);

  useEffect(() => {
    getInitData();
  }, []);

  const [form] = Form.useForm();
  const pageData = {
    btnCancel: t("button:cancel"),
    btnUpdate: t("button:update"),
    btnAddNew: t("button:addNew"),
    btnDiscard: t("button:discard"),
    generalInformation: {
      title: t("common:generalInformation"),
      name: {
        label: t("blog:blogTitle"),
        placeholder: t("blog:blogTitlePlaceholder"),
        required: true,
        maxLength: 255,
        validateMessage: t("blog:blogTitleValidateMessage"),
      },
      category: {
        label: t("blog:blogCategory"),
        placeholder: t("blog:blogCategoryPlaceholder"),
        required: true,
        blogCategoryValidateMessage: t("blog:blogCategoryValidateMessage"),
        blogCategoryNameValidateMessage: t("blog:blogCategoryNameValidateMessage"),
        blogCategoryExisted: t("blog:blogCategoryExisted"),
      },
      blogContent: {
        label: t("blog:blogContent"),
        required: true,
        validateMessage: t("blog:blogContentValidateMessage"),
        blogContentPlaceholder: t("blog:blogContentPlaceholder"),
      },
    },
    SEO: {
      title: t("form:SEOConfiguration"),
      SEOTitle: t("form:SEOTitle"),
      SEODescription: t("form:SEODescription"),
      SEOKeywords: t("form:SEOKeywords"),
      SEOTitlePlaceholder: t("form:SEOTitlePlaceholder"),
      SEODescriptionPlaceholder: t("form:SEODescriptionPlaceholder"),
      SEOKeywordsPlaceholder: t("form:SEOKeywordsPlaceholder"),
      SEOPreview: t("form:SEOPreview"),
      SEOOverviewTooltip: t("form:SEOOverviewTooltip"),
      SEOTitleTooltip: t("form:SEOTitleTooltip"),
      SEODescriptionTooltip: t("form:SEODescriptionTooltip"),
      SEOKeywordsTooltip: t("form:SEOKeywordsTooltip"),
    },
    media: {
      title: t("blog:media"),
      bannerTitle: t("blog:bannerTitle"),
      textNonImage: t("file:textNonImage"),
      bestDisplayImage: t("blog:bestDisplayImage"),
      imageSizeTooBig: t("file:imageSizeTooBig"),
    },
    leaveDialog: {
      confirmLeaveTitle: t('dialog:confirmLeaveTitle'),
      confirmLeaveContent: t('dialog:confirmLeaveContent'),
      confirmLeave: t('dialog:confirmLeave'),
    },
    createdBy: t("blog:createdBy"),
    createdTime: t("blog:createdTime"),
    updatedTime: t("blog:updatedTime"),
    limitTagMessage: t("blog:limitTagMessage"),
    updateBlogSuccess: t("blog:updateBlogSuccess"),
    updateBlogFailed: t("blog:updateBlogFailed"),
    view: t("blog:view"),
    messageMatchSuggestSEOTitle: t("form:messageMatchSuggestSEOTitle"),
    messageMatchSuggestSEODescription: t("form:messageMatchSuggestSEODescription"),
  };

  useEffect(() => {
    getInitData();
    getBlogTags();
  }, []);

  // validate form again if clicked submit form and change language

  const getInitData = async () => {
    const { id } = props?.match?.params;
    await getCategories();
    await blogDataService
      .getBlogByIdAsync(id)
      .then((res) => {
        setBlog(res?.blogDetail);
        mappingData(res?.blogDetail);
      })
      .catch(error);
  };

  const mappingData = (data) => {
    //mapping banner
    if (fnbImageSelectRef && fnbImageSelectRef.current) {
      fnbImageSelectRef.current.setImageUrl(data?.bannerImageUrl);
    }

    setTags(data?.blogTags);
    setBlogName(data?.title);
    setBlogContent(data?.content);
    setUrlSEO(data?.urlSEO);
    setTitleSEO(data?.titleSEO);
    setDescriptionSEO(data?.descriptionSEO);
    setCheckBlogContentLoaded(true);
    //mapping general
    form.setFieldsValue({
      title: data?.title,
      content: data?.content,
      blogCategoryId: data?.blogCategoryId,
      UrlSEO: data?.urlSEO,
      TitleSEO: data?.titleSEO,
      DescriptionSEO: data?.descriptionSEO,
    });
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
    if (blogContent.length === 0) {
      setShowBlogContentValidateMessage(true);
      return;
    }
    var imageUrl = "";
    if (fnbImageSelectRef && fnbImageSelectRef.current) {
      imageUrl = fnbImageSelectRef.current.getImageUrl();
    }
    form
      .validateFields()
      .then(async (values) => {
        let request = {
          blogDetailModel: {
            ...values,
            id: props?.match?.params?.id,
            content: blogContent,
            bannerImageUrl: imageUrl,
            blogTags: tags,
            titleSEO: titleSEO,
            descriptionSEO: descriptionSEO,
            description: blogContent.replace(/<.*?>/gm, "").slice(0, 200),
          },
        };

        const res = await blogDataService.editBlogAsync(request);
        if (res?.isSuccess) {
          message.success(pageData.updateBlogSuccess);
          onCompleted();
        } else {
          message.error(res.message);
        }
      })
      .catch((errors) => { });
  };

  const onCancel = () => {
    if (isChangeForm) {
      setShowConfirm(true);
    }
    else {
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
    } else {
      setIsCategoryNameExisted(true);
    }
  };

  //Enter Category name and check existed
  const onNameChange = (event) => {
    if (
      categories.filter((u) => u.name.trim() === event.target.value.trim())
        .length > 0
    ) {
      setShowCategoryNameValidateMessage(true);
    } else {
      setShowCategoryNameValidateMessage(false);
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
        <Col xs={24} sm={24} lg={12}>
          <p className="card-header">
            <PageTitle content={blogName} />
          </p>
        </Col>
        <Col span={12} xs={24} sm={24} md={24} lg={12}>
          <ActionButtonGroup
            arrayButton={[
              {
                action: (
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={disableCreateButton}
                    className="btn-add-product"
                    onClick={onSubmitForm}
                  >
                    {pageData.btnUpdate}
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
        className="edit-blog"
        onFieldsChange={(e) => changeForm(e)}
        autoComplete="off"
        onChange={() => {
          if (!blockNavigation) setBlockNavigation(true);
        }}
      >
        <div className="col-input-full-width">
          <Row gutter={[12, 0]}>
            <Col xs={24} sm={24} md={16} lg={16} xl={15} xxl={16}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Card className="w-100 fnb-card h-auto">
                  <Row className="mb-4">
                    <Col span={24}>
                      <h4 className="title-group">
                        {pageData.generalInformation.title}
                      </h4>

                      <h4 className="fnb-form-label">
                        {pageData.generalInformation.name.label}
                        <span className="text-danger">*</span>
                      </h4>
                      <Form.Item
                        name={"title"}
                        rules={[
                          {
                            required: pageData.generalInformation.name.required,
                            message:
                              pageData.generalInformation.name.validateMessage,
                          },
                        ]}
                        validateFirst={true}
                      >
                        <Input
                          className="fnb-input"
                          placeholder={
                            pageData.generalInformation.name.placeholder
                          }
                          maxLength={pageData.generalInformation.name.maxLength}
                          id="product-name"
                          onChange={(e) => {
                            if (e.target.value.length <= 255) {
                              setBlogName(e.target.value);
                            }
                          }}
                          allowClear
                          value={blogName}
                          showCount
                        />
                      </Form.Item>

                      <h4 className="fnb-form-label">
                        {pageData.generalInformation.category.label}{" "}
                        <span className="text-danger">*</span>
                      </h4>
                      <Form.Item
                        name={"blogCategoryId"}
                        rules={[
                          {
                            required:
                              pageData.generalInformation.category.required,
                            message:
                              pageData.generalInformation.category
                                .blogCategoryValidateMessage,
                          },
                        ]}
                      >
                        <FnbSelectSingle
                          onChange={onChangeOption}
                          className="unit-selector"
                          placeholder={
                            pageData.generalInformation.category.placeholder
                          }
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
                                  />
                                  <TextDanger
                                    className="text-error-add-unit"
                                    visible={showCategoryNameValidateMessage}
                                    text={
                                      pageData.blogCategory
                                        .blogCategoryNameValidateMessage
                                    }
                                  />
                                  <TextDanger
                                    className="text-error-add-unit"
                                    visible={isCategoryNameExisted}
                                    text={
                                      pageData.generalInformation.category.blogCategoryExisted
                                    }
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
                                  <div
                                    className={
                                      showCategoryNameValidateMessage
                                        ? "mt-10"
                                        : "mt-32"
                                    }
                                  >
                                    {menu}
                                  </div>
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
                        {pageData.generalInformation.blogContent.label}{" "}
                        <span className="text-danger">*</span>
                      </h4>
                      <FnbFroalaEditor
                        value={blogContent}
                        onChange={(value) => {
                          if(checkBlogContentLoaded)
                            setIsChangeForm(true);
                          setBlogContent(value);
                          if (value.length > 0) {
                            setShowBlogContentValidateMessage(false);
                          } else {
                            setShowBlogContentValidateMessage(true);
                          }
                        }}
                        charCounterMax={-1}
                      />
                      <TextDanger
                        className="text-error-add-unit"
                        visible={showBlogContentValidateMessage}
                        text={
                          pageData.generalInformation.blogContent.validateMessage
                        }
                      />
                    </Col>
                  </Row>
                </Card>
                <br />
              </Col>

              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
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
                      <div className="edit-blog-overview">
                        <span
                          style={{ fontSize: "18px" }}
                        >{`<meta name="title" property="title" content="${!titleSEO ? "SEO on Title" : titleSEO
                          }">`}</span>
                        <br />
                        <span style={{ fontSize: "18px" }}>
                          {`<meta name="description" property="description" content="${!descriptionSEO
                            ? "SEO on Description"
                            : descriptionSEO
                            }">`}
                        </span>
                        <br />
                        <span style={{ fontSize: "18px" }}>
                          {`<meta name="keywords" property="keywords" content="${tags.length > 0
                            ? tags.map((x) => x.name).join(",")
                            : "SEO on Keywords"
                            }">`}
                        </span>
                      </div>
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
                          className="material-edit-cost-per-unit-tool-tip"
                        >
                          <span>
                            <ExclamationIcon />
                          </span>
                        </Tooltip>
                      </h4>
                      <Form.Item name={"TitleSEO"}>
                        <Input
                          className="fnb-input-with-count"
                          placeholder={pageData.SEO.SEOTitlePlaceholder}
                          maxLength={100}
                          onChange={(e) => {
                            setIsChangeForm(true);
                            e.target.value.length < 50 ||
                              e.target.value.length > 60
                              ? setIsShowWarningSEOTitle(true)
                              : setIsShowWarningSEOTitle(false);
                            setTitleSEO(e.target.value);
                          }}
                          value={titleSEO}
                          showCount
                        />
                        <div
                          hidden={!isShowWarningSEOTitle}
                          className="seo-warning-message"
                        >
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
                      <Form.Item name={"DescriptionSEO"}>
                        <Input
                          className="fnb-input-with-count"
                          placeholder={pageData.SEO.SEODescriptionPlaceholder}
                          maxLength={255}
                          onChange={(e) => {
                            setIsChangeForm(true);
                            e.target.value.length < 155 ||
                              e.target.value.length > 160
                              ? setIsShowWarningSEODescription(true)
                              : setIsShowWarningSEODescription(false);
                            setDescriptionSEO(e.target.value);
                          }}
                          value={descriptionSEO}
                          showCount
                        />
                        <div
                          hidden={!isShowWarningSEODescription}
                          className="seo-warning-message"
                        >
                          <div className="icon-warning">
                            <WarningIcon />
                          </div>
                          <div className="text-warning">
                            <span>
                              {pageData.messageMatchSuggestSEODescription}
                            </span>
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
                        <span
                          hidden={!tagError}
                          className="customer-tag-error-message"
                        >
                          {pageData.limitTagMessage}
                        </span>
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
                <br />
              </Col>
            </Col>

            {/* <Col xs={24} sm={24} md={16} lg={16} xl={15} xxl={16}> */}

            <Col xs={24} sm={24} md={8} lg={8} xl={9} xxl={8}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Row>
                  <Col xs={24} sm={24} md={24} lg={24}>
                    <Card className="w-100 fnb-card h-auto">
                      <h4 className="title-group">{pageData.media.title}</h4>
                      <h4 className="fnb-form-label">
                        {pageData.media.bannerTitle}
                      </h4>
                      <FnbImageSelectComponent
                        ref={fnbImageSelectRef}
                        messageTooBigSize={pageData.media.imageSizeTooBig}
                        isShowBestDisplay={true}
                        bestDisplayImage={pageData.media.bestDisplayImage}
                      />
                    </Card>
                  </Col>
                </Row>
                <FnbCard className="mt-4">
                  <Row gutter={[24, 24]}>
                    <Col sm={24} lg={24} className="w-100">
                      <Row className="mb-1 mt-3 edit-blog-overview-odd">
                        <Col span={24}>
                          <div className="left-column">{pageData.createdBy}</div>
                          <div className="right-column">
                            <div className="fnb-form-label-right">
                              {blog?.createdUserName
                                ? blog?.createdUserName
                                : "-"}
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row className="edit-blog-overview-even">
                        <Col span={24}>
                          <div className="left-column">
                            {pageData.createdTime}
                          </div>
                          <div className="right-column">
                            <div className="fnb-form-label-right">
                              {blog?.createdTime
                                ? convertUtcToLocalTime(blog?.createdTime).format(
                                  DateFormat.DD_MM_YYYY
                                )
                                : "-"}
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row className="mb-1 mt-3 edit-blog-overview-odd">
                        <Col span={24}>
                          <div className="left-column">{pageData.updatedTime}</div>
                          <div className="right-column">
                            <div className="fnb-form-label-right">
                              {blog?.lastSavedTime
                                ? convertUtcToLocalTime(
                                  blog?.lastSavedTime
                                ).format(DateFormat.DD_MM_YYYY)
                                : "-"}
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row className="edit-blog-overview-even">
                        <Col span={24}>
                          <div className="left-column">{pageData.view}</div>
                          <div className="right-column">
                            <div className="fnb-form-label-right">
                              {formatNumber(blog?.totalView)}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </FnbCard>
              </Col>
            </Col>
          </Row>
        </div>
      </Form>
      <DeleteConfirmComponent
        title={pageData.leaveDialog.confirmLeaveTitle}
        content={pageData.leaveDialog.confirmLeaveContent}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.btnDiscard}
        okText={pageData.leaveDialog.confirmLeave}
        onCancel={onDiscard}
        onOk={onCompleted}
        isChangeForm={isChangeForm}
      />
    </>
  );
}
