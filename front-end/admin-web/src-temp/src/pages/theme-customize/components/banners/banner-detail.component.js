import { Col, Form, Input, Row } from "antd";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import { FnbSelectHyperlink } from "components/fnb-select-hyperlink/fnb-select-hyperlink";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { FnbUploadImageCustomizeComponent } from "components/fnb-upload-image-customize/fnb-upload-image-customize";
import { DYNAMIC_HYPERLINK, Hyperlink, HYPERLINK_SELECT_OPTION } from "constants/hyperlink.constants";
import {
  ArrowLeftBannerIcon,
  StoreBannerTrashIcon,
  StoreWebBannerGeneralCustomizationIcon,
  StoreWebBannerIcon,
} from "constants/icons.constants";
import {
  amountMaximumOfBanner,
  backgroundTypeEnum,
  customizationElementPageEnum,
} from "constants/store-web-page.constants";
import menuManagementDataService from "data-services/menu-management/menu-management-data.service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FnbBackgroundCustomizeComponent } from "../../../store-web/components/fnb-background-customize/fnb-background-customize";
import CustomizationBlock from "../customization-block-component/customization-block.page";
import CustomizationGroup from "../customization-group-component/customization-group.page";
import "./banner-detail.component.scss";

export default function BannerDetailComponent({
  backToListPage,
  storeThemeData,
  formTheme,
  setStoreThemeData,
  newStoreThemeData,
}) {
  const [t] = useTranslation();
  const translateData = {
    title: t("storeWebPage.banner.title"),
    generalCustomizationTitle: t("storeWebPage.banner.generalCustomizationTitle"),
    imageTitle: t("storeWebPage.banner.imageTitle"),
    hyperlink: t("storeWebPage.banner.hyperlink"),
    btnAddNewBanner: t("storeWebPage.banner.btnAddNewBanner"),
    dynamic: {
      url: {
        title: t("menuManagement.menuItem.hyperlink.dynamic.url.title"),
        placeholder: t("menuManagement.menuItem.hyperlink.dynamic.url.placeholder"),
        validation: t("menuManagement.menuItem.hyperlink.dynamic.url.validation"),
      },
      blog: {
        title: t("menuManagement.menuItem.hyperlink.dynamic.blog.title"),
        placeholder: t("menuManagement.menuItem.hyperlink.dynamic.blog.placeholder"),
        validation: t("menuManagement.menuItem.hyperlink.dynamic.blog.validation"),
      },
      product: {
        title: t("menuManagement.menuItem.hyperlink.dynamic.product.title"),
        placeholder: t("menuManagement.menuItem.hyperlink.dynamic.product.placeholder"),
        validation: t("menuManagement.menuItem.hyperlink.dynamic.product.validation"),
      },
      category: {
        title: t("menuManagement.menuItem.hyperlink.dynamic.category.title"),
        placeholder: t("menuManagement.menuItem.hyperlink.dynamic.category.placeholder"),
        validation: t("menuManagement.menuItem.hyperlink.dynamic.category.validation"),
      },
      page: {
        title: t("menuManagement.menuItem.hyperlink.dynamic.page.title"),
        placeholder: t("menuManagement.menuItem.hyperlink.dynamic.page.placeholder"),
        validation: t("menuManagement.menuItem.hyperlink.dynamic.page.validation"),
      },
      subMenu: {
        title: t("menuManagement.menuItem.hyperlink.dynamic.subMenu.title"),
        placeholder: t("menuManagement.menuItem.hyperlink.dynamic.subMenu.placeholder"),
        validation: t("menuManagement.menuItem.hyperlink.dynamic.subMenu.validation"),
      },
    },
    bannerDefaultTitle: t("storeWebPage.banner.bannerDefaultTitle"),
    bannerImageRequiredMessage: t("storeWebPage.banner.bannerImageRequiredMessage"),
    hyperlinkTypePlaceholder: t("menuManagement.menuItem.hyperlink.placeholder"),
  };
  const [hyperlinkSelectOptions, setHyperlinkSelectOptions] = useState();
  const [products, setProducts] = useState(null);
  const [productCategories, setProductCategories] = useState(null);
  const [subMenus, setSubMenus] = useState(null);
  const [pages, setPages] = useState(null);
  const [isDisableBtnAddNewBanner, setIsDisableBtnAddNewBanner] = useState(false);
  const [primaryColorGeneral, setPrimaryColorGeneral] = useState();
  const [bannerDataInternal, setBannerDataInternal] = useState();
  const bannerDataDefault = {
    bannerBackgroundType: backgroundTypeEnum.Color,
    bannerBackgroundValue: "#ffffff",
    colorGroupId: null,
    backgroundColorHex: "",
    bannerList: [
      {
        imageUrl: "",
        hyperlinkType: Hyperlink.URL,
        hyperlinkValue: "",
      },
    ],
  };

  useEffect(() => {
    getDataPrepareForHyperlink();
    initialData();
  }, []);

  const initialData = () => {
    let hyperlinkOptions = HYPERLINK_SELECT_OPTION.filter((a) => a.id !== Hyperlink.SUB_MENU);
    setHyperlinkSelectOptions(hyperlinkOptions);

    let bannerModel = null;
    let primaryColor = null;
    let bannerFromNewStoreThemData = newStoreThemeData?.storeThemeConfiguration?.pages?.banner;
    if (bannerFromNewStoreThemData) {
      bannerModel = bannerFromNewStoreThemData;
      primaryColor = bannerFromNewStoreThemData?.bannerBackgroundValue;
    } else {
      bannerModel = bannerDataDefault;
      primaryColor = bannerModel?.bannerBackgroundValue;
    }

    formTheme.setFieldsValue({ banner: { ...bannerModel } });
    setPrimaryColorGeneral(primaryColor);
    setBannerDataInternal(bannerModel);
  };

  const getDataPrepareForHyperlink = async () => {
    const prepareData = await menuManagementDataService.getCreateMenuPrepareDataAsync();
    setProducts(prepareData?.products);
    setProductCategories(prepareData?.productCategories);
    setSubMenus(prepareData?.subMenus);
    setPages(prepareData?.pages);
  };

  const renderGeneralCustomizationGroup = () => {
    return (
      <FnbBackgroundCustomizeComponent
        defaultOption={
          newStoreThemeData?.storeThemeConfiguration?.pages?.banner?.backgroundType ?? backgroundTypeEnum.Color
        }
        bestDisplay={"1920 x 569 px"}
        maxSizeUploadMb={20}
        prevName={"banner"}
        primaryColorDefault={newStoreThemeData?.storeThemeConfiguration?.pages?.banner?.backgroundColorHex ?? "#ffffff"}
        storeThemeData={newStoreThemeData}
        form={formTheme}
        changeValueOfKey={changeValueOfKey}
        parentBlockCustom={"pages"}
      ></FnbBackgroundCustomizeComponent>
    );
  };

  const onChangeHyperlink = (id, index) => {
    let formBannerValue = newStoreThemeData?.storeThemeConfiguration?.pages?.banner?.bannerList;
    formBannerValue[index].hyperlinkValue = null;
    formBannerValue[index].hyperlinkType = id;
    let dataObject = {
      storeThemeConfiguration: {
        ...newStoreThemeData?.storeThemeConfiguration,
        pages: {
          ...newStoreThemeData?.storeThemeConfiguration?.pages,
          banner: {
            ...newStoreThemeData?.storeThemeConfiguration?.pages?.banner,
            bannerList: [...formBannerValue],
          },
        },
      },
    };

    let newBanner = dataObject?.storeThemeConfiguration?.pages?.banner;
    formTheme.setFieldsValue({ banner: { ...newBanner } });
    setBannerDataInternal(newBanner);
    setStoreThemeData(dataObject);
  };

  const renderBannerGroupItem = (banner, index) => {
    let bannerGroupItem = (
      <>
        <Row>
          <Col span={24}>
            <span className="label-banner-field">{translateData.imageTitle}</span>
          </Col>
          <Col span={24}>
            <Form.Item
              name={["banner", "bannerList", index, "imageUrl"]}
              rules={[
                {
                  required: true,
                  message: translateData.bannerImageRequiredMessage,
                },
              ]}
            >
              <FnbUploadImageCustomizeComponent
                bestDisplay={"1920 x 760px"}
                maxSizeUploadMb={20}
                onImageChange={(data) => onChangeImageBanner(data, index)}
                defaultImage={banner.imageUrl}
                onChangeImageFinish={(data) => onChangeImageBanner(data, index)}
              />
              <Input hidden />
            </Form.Item>
          </Col>
        </Row>
        <Row className="banner-field-margin-top">
          <Col span={24}>
            <span className="label-banner-field">{translateData.hyperlink}</span>
          </Col>
          <Col span={24}>
            <Form.Item
              name={["banner", "bannerList", index, "hyperlinkType"]}
              rules={[
                {
                  required: true,
                  message: translateData.title,
                },
              ]}
            >
              <FnbSelectHyperlink
                showSearch
                allowClear
                fixed
                placeholder={translateData.hyperlinkTypePlaceholder}
                onChange={(e) => onChangeHyperlink(e, index)}
                option={hyperlinkSelectOptions}
              ></FnbSelectHyperlink>
            </Form.Item>
          </Col>
          <Col className="banner-field-margin-top" span={24}>
            {renderHyperlinkOption(index)}
          </Col>
        </Row>
      </>
    );

    return bannerGroupItem;
  };

  const renderBannerGroup = () => {
    let bannerListData = newStoreThemeData?.storeThemeConfiguration?.pages?.banner?.bannerList;
    let contentBannerGroup = bannerListData?.map((banner, index) => {
      return (
        <div key={index}>
          <CustomizationGroup
            title={
              index <= 0
                ? translateData.bannerDefaultTitle
                : t(`storeWebPage.banner.bannerDefaultIndexTitle`, { index: index })
            }
            isNormal={true}
            defaultActiveKey={"1"}
            content={renderBannerGroupItem(banner, index)}
            icon={index <= 0 ? <></> : <StoreBannerTrashIcon />}
            className="group-banner-detail"
            isShowRightIconWhenHoverMouse={true}
            onClickIconRight={() => onDeleteBannerItem(index)}
            titleIconRight={t("storeWebPage.banner.iconDeleteTooltip", { index: index })}
          ></CustomizationGroup>
        </div>
      );
    });

    return (
      <>
        {contentBannerGroup}
        <FnbAddNewButton
          disabled={isDisableBtnAddNewBanner || bannerListData?.length >= amountMaximumOfBanner}
          onClick={addNewBanner}
          text={translateData.btnAddNewBanner}
          className="btn-add-new-banner"
        />
      </>
    );
  };

  const renderHyperlinkOption = (index) => {
    let formLabel = "";
    let placeholder = "";
    let validationMessage = "";
    let selectOptionData = null;
    let translateDataValue = null;
    let hyperlinkInfo = newStoreThemeData?.storeThemeConfiguration?.pages?.banner?.bannerList[index];

    switch (hyperlinkInfo?.hyperlinkType) {
      case Hyperlink.URL:
        translateDataValue = translateData.dynamic.url;
        break;
      case Hyperlink.CATEGORY:
        translateDataValue = translateData.dynamic.category;
        selectOptionData = productCategories;
        break;
      case Hyperlink.PRODUCT_DETAIL:
        translateDataValue = translateData.dynamic.product;
        selectOptionData = products;
        break;
      case Hyperlink.BLOG_DETAIL:
        translateDataValue = translateData.dynamic.blog;
        break;
      case Hyperlink.MY_PAGES:
        translateDataValue = translateData.dynamic.page;
        selectOptionData = pages;
        break;
      case Hyperlink.SUB_MENU:
        translateDataValue = translateData.dynamic.subMenu;
        selectOptionData = subMenus;
        break;
      default:
        break;
    }

    formLabel = translateDataValue?.title;
    placeholder = translateDataValue?.placeholder;
    validationMessage = translateDataValue?.validation;

    return (
      <>
        {DYNAMIC_HYPERLINK.includes(hyperlinkInfo?.hyperlinkType) && (
          <>
            <h4 className="fnb-form-label mt-36">
              {formLabel}
              <span className="text-danger">*</span>
            </h4>
            <Form.Item
              name={["banner", "bannerList", index, "hyperlinkValue"]}
              rules={[
                {
                  required: true,
                  message: validationMessage,
                },
              ]}
            >
              {hyperlinkInfo?.hyperlinkType === Hyperlink.URL ? (
                <Input
                  className="fnb-input-with-count"
                  showCount
                  maxLength={2000}
                  placeholder={placeholder}
                  onChange={(e) => onChangeHyperlinkValue(e, index, true)}
                />
              ) : (
                <FnbSelectSingle
                  placeholder={placeholder}
                  showSearch
                  fixed
                  option={selectOptionData?.map((item) => ({
                    id: item.id,
                    name: item.name,
                  }))}
                  allowClear
                  onChange={(e) => onChangeHyperlinkValue(e, index, false)}
                />
              )}
            </Form.Item>
          </>
        )}
      </>
    );
  };

  const addNewBanner = () => {
    formTheme.validateFields().then((values) => {
      //let formThemeValue = values;
      let newBanner = [];
      let bannerListOfForm = newStoreThemeData?.storeThemeConfiguration?.pages?.banner?.bannerList;
      if (bannerListOfForm?.length > 0) {
        newBanner = [...bannerListOfForm];
      } else {
        newBanner = [...bannerDataInternal?.bannerList];
      }

      if (newBanner.length + 1 <= amountMaximumOfBanner) {
        newBanner.push({
          imageUrl: "",
          hyperlinkType: Hyperlink.URL,
          hyperlinkValue: "",
        });
        let bannerModel = newStoreThemeData?.storeThemeConfiguration?.pages?.banner;

        let dataObject = {
          storeThemeConfiguration: {
            ...newStoreThemeData?.storeThemeConfiguration,
            pages: {
              ...newStoreThemeData?.storeThemeConfiguration?.pages,
              banner: {
                ...bannerModel,
                bannerList: [...newBanner],
              },
            },
          },
        };

        let newBannerObj = dataObject?.storeThemeConfiguration?.pages?.banner;
        formTheme.setFieldsValue({ banner: { ...newBannerObj } });
        setBannerDataInternal(newBanner);
        setStoreThemeData(dataObject);
      }
      newBanner.length >= amountMaximumOfBanner && setIsDisableBtnAddNewBanner(true);
    });
  };

  const onDeleteBannerItem = (index) => {
    let bannerList = newStoreThemeData?.storeThemeConfiguration?.pages?.banner?.bannerList;
    let newBannerList = [...bannerList];
    newBannerList.splice(index, 1);
    let dataObject = {
      storeThemeConfiguration: {
        ...newStoreThemeData?.storeThemeConfiguration,
        pages: {
          ...newStoreThemeData?.storeThemeConfiguration?.pages,
          banner: {
            ...newStoreThemeData?.storeThemeConfiguration?.pages?.banner,
            bannerList: [...newBannerList],
          },
        },
      },
    };

    let newBanner = dataObject?.storeThemeConfiguration?.pages?.banner;
    formTheme.setFieldsValue({ banner: { ...newBanner } });
    setBannerDataInternal(newBanner);
    setStoreThemeData(dataObject);
    setIsDisableBtnAddNewBanner(newBannerList.length >= amountMaximumOfBanner);
  };

  const onChangeImageBanner = (data, index) => {
    const bannerList = newStoreThemeData?.storeThemeConfiguration?.pages?.banner?.bannerList;
    bannerList[index].imageUrl = data?.url;
    let dataObject = {
      storeThemeConfiguration: {
        ...newStoreThemeData?.storeThemeConfiguration,
        pages: {
          ...newStoreThemeData?.storeThemeConfiguration?.pages,
          banner: {
            ...newStoreThemeData?.storeThemeConfiguration?.pages?.banner,
            bannerList: [...bannerList],
          },
        },
      },
    };

    let newBanner = dataObject?.storeThemeConfiguration?.pages?.banner;
    formTheme.setFieldsValue({ banner: { ...newBanner } });
    setBannerDataInternal(newBanner);
    setStoreThemeData(dataObject);
  };

  const onBackToCustomizePage = () => {
    let dataObject = {
      storeThemeConfiguration: {
        ...newStoreThemeData?.storeThemeConfiguration,
        pages: {
          ...newStoreThemeData?.storeThemeConfiguration?.pages,
          banner: {
            ...bannerDataInternal,
          },
        },
      },
    };

    let newBanner = dataObject?.storeThemeConfiguration?.pages?.banner;
    formTheme.setFieldsValue({ banner: { ...newBanner } });
    setStoreThemeData(dataObject);
    backToListPage(customizationElementPageEnum.Banner);
  };

  const changeValueOfKey = (key, value) => {
    let { banner } = newStoreThemeData?.storeThemeConfiguration?.pages;
    let dataObject = {
      storeThemeConfiguration: {
        ...newStoreThemeData?.storeThemeConfiguration,
        pages: {
          ...newStoreThemeData?.storeThemeConfiguration?.pages,
          banner: {
            ...banner,
            [key]: value,
          },
        },
      },
    };

    const newBanner = dataObject?.storeThemeConfiguration?.pages?.banner;
    formTheme.setFieldsValue({ banner: { ...newBanner } });
    setBannerDataInternal(newBanner);
    setStoreThemeData(dataObject);
  };

  const onChangeHyperlinkValue = (data, index, isTextbox) => {
    let value = data;
    if (isTextbox) {
      value = data?.target?.value;
    }
    let { banner } = newStoreThemeData?.storeThemeConfiguration?.pages;
    let bannerItem = banner?.bannerList[index];
    bannerItem.hyperlinkValue = value;
    let dataObject = {
      storeThemeConfiguration: {
        ...newStoreThemeData?.storeThemeConfiguration,
        pages: {
          ...newStoreThemeData?.storeThemeConfiguration?.pages,
          banner: {
            ...banner,
          },
        },
      },
    };

    const newBanner = dataObject.storeThemeConfiguration.pages.banner;
    setBannerDataInternal(newBanner);
    setStoreThemeData(dataObject);
  };

  return (
    <div className="banner-detail-content">
      <div className="banner-detail-header">
        <ArrowLeftBannerIcon className="banner-detail-icon-title" onClick={() => onBackToCustomizePage()} />
        <span className="banner-detail-title">{translateData.title}</span>
      </div>
      <div className="banner-detail-body">
        <CustomizationBlock
          icon={<StoreWebBannerGeneralCustomizationIcon></StoreWebBannerGeneralCustomizationIcon>}
          title={translateData.generalCustomizationTitle}
          isNormal={true}
          content={renderGeneralCustomizationGroup()}
          defaultActiveKey={1}
          className="banner-detail-body-general"
        ></CustomizationBlock>

        <CustomizationBlock
          icon={<StoreWebBannerIcon></StoreWebBannerIcon>}
          title={translateData.title}
          isNormal={true}
          content={renderBannerGroup()}
          className="banner-detail-body-content"
        ></CustomizationBlock>
      </div>
    </div>
  );
}
