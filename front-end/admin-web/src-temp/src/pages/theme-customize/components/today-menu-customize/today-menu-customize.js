import { Checkbox, Col, Form, Row } from "antd";
import { FnbInput } from "components/fnb-input/fnb-input.component";
import { FnbSelectMultiple } from "components/fnb-select-multiple/fnb-select-multiple";
import {
  ArrowMenuCustomizeIcon,
  BucketGeneralCustomizeIcon,
  FoodTrayCustomizeIcon,
  HideCustomizeIcon,
} from "constants/icons.constants";
import { backgroundTypeEnum } from "constants/store-web-page.constants";
import productCategoryDataService from "data-services/product-category/product-category-data.service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FnbBackgroundCustomizeComponent } from "../../../store-web/components/fnb-background-customize/fnb-background-customize";
import "./today-menu-customize.scss";

export function TodayMenuCustomizeComponent(props) {
  const { storeThemeData, setStoreThemeData, form, newStoreThemeData } = props;
  const [selectedMenu, setSelectedMenu] = useState(false);
  const [todayMenuSelect, setTodayMenuSelect] = useState(false);
  const [colorGroup, setColorGroup] = useState([]);
  const [categorySelected, setCategorySelected] = useState(
    storeThemeData.storeThemeConfiguration?.pages?.home?.todayMenu?.productCategoryIds
  );
  const [t] = useTranslation();
  const pageData = {
    header: t("emailCampaign.header", "Header"),
    title: t("emailCampaign.title", "Title"),
    enterTitle: t("emailCampaign.enterTitle", "Title"),
    menuSpecial: t("storeWebPage.menuSpecial"),
    category: t("storeWebPage.category"),
    selectCategoryValidateMessage: t("storeWebPage.selectCategoryValidateMessage"),
    selectCategoryPlaceholder: t("storeWebPage.selectCategoryPlaceholder"),
    maxSizeUploadMb: 20,
    todayMenu: t("storeWebPage.todayMenu"),
  };

  const [categories, setCategories] = useState([]);
  const [categoryOptionValue, setCategoryOptionValue] = useState(false);
  const [disableAllCategories, setDisableAllCategories] = useState(false);

  useEffect(() => {
    getCategories();

    initData();
  }, []);

  const initData = async () => {
    if (storeThemeData) {
      const { color } = storeThemeData?.storeThemeConfiguration?.general;
      const { todayMenu } = storeThemeData?.storeThemeConfiguration?.pages?.home;
      if (color) {
        setColorGroup(color.colorGroups);
      }
      if (form && todayMenu) {
        form.setFieldsValue({
          todayMenu: {
            ...todayMenu,
          },
        });
      }
    }
  };

  const onChangeTitle = (e) => {
    if (newStoreThemeData) {
      const { storeThemeConfiguration } = newStoreThemeData;
      const { pages } = storeThemeConfiguration;
      const { home } = pages;
      const { todayMenu } = home;

      let newData = {
        storeThemeConfiguration: {
          ...storeThemeConfiguration,
          pages: {
            ...pages,
            home: {
              ...home,
              todayMenu: {
                ...todayMenu,
                titleText: e.target.value,
              },
            },
          },
        },
      };
      setStoreThemeData(newData);
    }
    form.setFields([
      {
        name: ["todayMenu", "titleText"],
        value: e.target.value,
      },
    ]);
  };
  const onChangeHeader = (e) => {
    if (newStoreThemeData) {
      const { storeThemeConfiguration } = newStoreThemeData;
      const { pages } = storeThemeConfiguration;
      const { home } = pages;
      const { todayMenu } = home;

      let newData = {
        storeThemeConfiguration: {
          ...storeThemeConfiguration,
          pages: {
            ...pages,
            home: {
              ...home,
              todayMenu: {
                ...todayMenu,
                headerText: e.target.value,
              },
            },
          },
        },
      };
      setStoreThemeData(newData);
    }
    form.setFields([
      {
        name: ["todayMenu", "headerText"],
        value: e.target.value,
      },
    ]);
  };

  const onchangeCategory = async (values) => {
    if (newStoreThemeData) {
      const { storeThemeConfiguration } = newStoreThemeData;
      const { pages } = storeThemeConfiguration;
      const { home } = pages;
      const { todayMenu } = home;

      let newData = {
        storeThemeConfiguration: {
          ...storeThemeConfiguration,
          pages: {
            ...pages,
            home: {
              ...home,
              todayMenu: {
                ...todayMenu,
                productCategoryIds: values,
              },
            },
          },
        },
      };
      setStoreThemeData(newData);
      setCategorySelected(values);
    }
  };
  const onChangeOption = (e) => {
    const isChecked = e.target.checked;
    setCategoryOptionValue(isChecked);
    setDisableAllCategories(isChecked);

    let categoryIds = [];
    if (isChecked) {
      categories?.map((item) => {
        categoryIds.push(item.id);
      });
      if (newStoreThemeData) {
        const { storeThemeConfiguration } = newStoreThemeData;
        const { pages } = storeThemeConfiguration;
        const { home } = pages;
        const { todayMenu } = home;

        let newData = {
          storeThemeConfiguration: {
            ...storeThemeConfiguration,
            pages: {
              ...pages,
              home: {
                ...home,
                todayMenu: {
                  ...todayMenu,
                  productCategoryIds: categoryIds,
                },
              },
            },
          },
        };
        setStoreThemeData(newData);
      }
    } else {
      if (newStoreThemeData) {
        const { storeThemeConfiguration } = newStoreThemeData;
        const { pages } = storeThemeConfiguration;
        const { home } = pages;
        const { todayMenu } = home;

        let newData = {
          storeThemeConfiguration: {
            ...storeThemeConfiguration,
            pages: {
              ...pages,
              home: {
                ...home,
                todayMenu: {
                  ...todayMenu,
                  productCategoryIds: categorySelected,
                },
              },
            },
          },
        };
        setStoreThemeData(newData);
      }
    }
  };
  const getCategories = async () => {
    var res = await productCategoryDataService.getAllProductCategoriesAsync();
    if (res) {
      setCategories(res.allProductCategories);
    }
  };
  const renderSelectCategory = () => {
    return (
      <>
        <h3 className="fnb-form-label">{pageData.category}</h3>
        <div className="check-box-select-all-categories">
          <Checkbox onChange={(event) => onChangeOption(event)} checked={categoryOptionValue}>
            {pageData.category.all}
          </Checkbox>
        </div>
        <Form.Item
          hidden={disableAllCategories}
          name={["todayMenu", "productCategoryIds"]}
          className="last-item"
          rules={[
            {
              required: !disableAllCategories,
              message: pageData.selectCategoryValidateMessage,
            },
          ]}
        >
          <FnbSelectMultiple
            placeholder={pageData.selectCategoryPlaceholder}
            className="w-100"
            allowClear
            option={categories?.map((item, index) => ({
              key: index,
              id: item.id,
              name: item.name,
            }))}
            onChange={onchangeCategory}
          ></FnbSelectMultiple>
        </Form.Item>
        <Form.Item hidden={!disableAllCategories} className="last-item">
          <FnbSelectMultiple disabled={true}></FnbSelectMultiple>
        </Form.Item>
      </>
    );
  };
  const changeValueOfKey = (key, value) => {
    if (newStoreThemeData) {
      const { storeThemeConfiguration } = newStoreThemeData;
      const { pages } = storeThemeConfiguration;
      const { home } = pages;
      const { todayMenu } = home;
      const { generalCustomization } = todayMenu;

      let newData = {
        storeThemeConfiguration: {
          ...storeThemeConfiguration,
          pages: {
            ...pages,
            home: {
              ...home,
              todayMenu: {
                ...todayMenu,
                generalCustomization: {
                  ...generalCustomization,
                  [key]: value,
                },
              },
            },
          },
        },
      };
      setStoreThemeData(newData);
    }
  };
  return (
    <Form form={form}>
      {!selectedMenu && (
        <ul className="menu-right-content">
          <li>
            <FoodTrayCustomizeIcon className="padding-icon" onClick={() => setSelectedMenu(true)} />{" "}
            <span onClick={() => setSelectedMenu(true)}>{pageData.todayMenu}</span>
            <HideCustomizeIcon style={{ marginLeft: "auto", cursor: "pointer" }} />
          </li>
        </ul>
      )}
      {selectedMenu && (
        <>
          <div className="selected-menu-back" onClick={() => setSelectedMenu(false)}>
            <ArrowMenuCustomizeIcon className="padding-icon" />
            {pageData.todayMenu}
          </div>
          <div
            className={`selected-menu ${!todayMenuSelect ? "selected-menu-active" : ""}`}
            onClick={() => setTodayMenuSelect(false)}
          >
            <BucketGeneralCustomizeIcon className="padding-icon" /> General customization
          </div>
          {!todayMenuSelect && (
            <div className="generalCustomize">
              <FnbBackgroundCustomizeComponent
                defaultOption={
                  storeThemeData?.storeThemeConfiguration?.pages?.home?.todayMenu?.generalCustomization
                    ?.backgroundType ?? backgroundTypeEnum.Image
                }
                bestDisplay={"1920 x 569 px"}
                prevName={"todayMenu,generalCustomization"}
                primaryColorDefault="#fff"
                storeThemeData={storeThemeData}
                form={form}
                changeValueOfKey={changeValueOfKey}
              ></FnbBackgroundCustomizeComponent>
            </div>
          )}
          <div
            className={`selected-menu ${todayMenuSelect ? "selected-menu-active" : ""}`}
            onClick={() => setTodayMenuSelect(true)}
          >
            <FoodTrayCustomizeIcon className="padding-icon" />
            {pageData.todayMenu}
          </div>
          {todayMenuSelect && (
            <>
              <Row className="mt-3">
                <Col span={24} className="mb-2">
                  <span className="text-title">{pageData.header}</span>
                </Col>
                <Col span={24} className="m-auto">
                  <Form.Item
                    name={["todayMenu", "headerText"]}
                    rules={[
                      {
                        type: "string",
                        max: 100,
                      },
                    ]}
                  >
                    <FnbInput
                      showCount
                      allowClear
                      placeholder={pageData.menuSpecial}
                      maxLength={100}
                      onChange={onChangeHeader}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col span={24} className="mb-2">
                  <span className="text-title">{pageData.title}</span>
                </Col>
                <Col span={24} className="m-auto">
                  <Form.Item
                    name={["todayMenu", "titleText"]}
                    rules={[
                      {
                        type: "string",
                        max: 255,
                      },
                    ]}
                  >
                    <FnbInput
                      showCount
                      allowClear
                      placeholder={pageData.enterTitle}
                      maxLength={255}
                      onChange={onChangeTitle}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[24, 24]} className="mt-3">
                <Col xs={24} sm={24} md={24} lg={24} span={24}>
                  {renderSelectCategory()}
                </Col>
              </Row>
            </>
          )}
        </>
      )}
    </Form>
  );
}
