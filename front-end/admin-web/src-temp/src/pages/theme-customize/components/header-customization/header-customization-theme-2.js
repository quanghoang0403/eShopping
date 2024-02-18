import { Col, Form, Input, Radio, Row } from "antd";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { store } from "store";
import {
  updateThemeHeaderMenu,
  updateThemeHeaderMenuScrollType,
} from "store/modules/theme-customize/theme-customize.actions";
import FnbUploadBackgroundImageCustomizeComponent from "themes/theme-2-new/components/fnb-upload-background-image-customize/fnb-upload-background-image-customize";
import logoDefault from "../../../../themes/theme-2-new/assets/images/logo-footer.png";
import SelectGeneralBackgroundComponent from "../select-general-background/select-general-background.component";
import "./header-customization-theme-2.scss";

const ScrollHeaderType = {
  SCROLL: 1,
  FIXED: 2,
};
export default function HeaderTheme2Customization(props) {
  const headerMenuOptions = useSelector((state) => state?.themeConfig?.headerMenuOptions);
  const headerConfig = useSelector((state) => state?.themeConfig?.data?.general?.header);
  const colorConfig = useSelector((state) => state?.themeConfig?.data?.general?.color);

  const [t] = useTranslation();
  const [menuList, setMenuList] = useState([]);
  const pageData = {
    logo: t("storeWebPage.header.logo"),
    selectMenu: t("storeWebPage.header.selectMenu"),
    pleaseSelectMenu: t("storeWebPage.header.pleaseSelectMenu"),
    pleaseUploadBackgroundImage: t("storeWebPage.header.pleaseUploadBackgroundImage"),
    stickyHeader: t("storeWebPage.header.stickyHeader"),
    scrolling: t("storeWebPage.header.scrolling"),
    fixed: t("storeWebPage.header.fixed"),
    maxSizeUploadMb: 5,
    maxSizeUploadBackgroundImage: 20,
  };

  useEffect(() => {
    setMenuList(headerMenuOptions);
  }, [headerMenuOptions]);

  function handleChangeMenu(menuId) {
    const headerMenuOption = headerMenuOptions?.find((x) => x.id === menuId);
    const menuItems = headerMenuOption?.onlineStoreMultiLevelMenus;
    // dispatch to redux menuItems
    store.dispatch(updateThemeHeaderMenu({ menuItems: menuItems, menuId: menuId }));
  }

  function handleChangeScrollType(scrollType) {
    store.dispatch(updateThemeHeaderMenuScrollType(scrollType));
  }

  return (
    <div className="headerCustomize">
      <div className="container">
        <SelectGeneralBackgroundComponent
          {...props}
          formItemPreName={["general", "header"]}
          bestDisplay={pageData.bestDisplay}
          backgroundCustomize={headerConfig}
          colorGroups={colorConfig?.colorGroups}
          maxSizeUploadMb={pageData.maxSizeUploadMb}
        />
        <Row gutter={[8, 16]} align="middle" className="row-header">
          <Col span={24}>{pageData.logo}</Col>
          <Col span={24}>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: pageData.pleaseUploadBackgroundImage,
                },
              ]}
              name={["general", "header", "logoUrl"]}
            >
              <FnbUploadBackgroundImageCustomizeComponent
                bestDisplay={"154 x 136 px"}
                maxSizeUploadMb={pageData.maxSizeUploadMb}
                imgFallbackDefault={logoDefault}
              />
            </Form.Item>
          </Col>
          <Col span={24}>{pageData.selectMenu}</Col>
          <Col span={24}>
            <Form.Item name={["general", "header", "menuId"]}>
              <FnbSelectSingle
                size="large"
                showSearch
                autoComplete="none"
                option={menuList?.map((item, index) => ({
                  id: item.id,
                  name: item.name,
                }))}
                placeholder={pageData.selectMenu}
                onChange={handleChangeMenu}
              />
            </Form.Item>
          </Col>
          <div className="mt-16" style={{ display: "none" }}>
            <h4 className="fnb-form-label">{pageData.selectMenu}</h4>
            <Form.List name={["general", "header", "menuItems"]}>
              {(fields) => (
                <>
                  {fields.map((field) => (
                    <div key={field.key}>
                      <Form.Item name={[field.name, "menuId"]}>
                        <Input />
                      </Form.Item>
                      <Form.Item name={[field.name, "url"]}>
                        <Input />
                      </Form.Item>
                      <Form.Item name={[field.name, "name"]}>
                        <Input />
                      </Form.Item>
                    </div>
                  ))}
                </>
              )}
            </Form.List>
          </div>

          <Col span={24}>{pageData.stickyHeader}</Col>
          <Col span={24}>
            <Form.Item name={["general", "header", "scrollType"]} initialValue={ScrollHeaderType.SCROLL}>
              <Radio.Group
                onChange={(event) => handleChangeScrollType(event?.target?.value)}
                defaultValue={ScrollHeaderType.SCROLL}
              >
                <Radio value={ScrollHeaderType.SCROLL}>
                  <p>{pageData.scrolling}</p>
                </Radio>
                <Radio value={ScrollHeaderType.FIXED}>
                  <p>{pageData.fixed}</p>
                </Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </div>
    </div>
  );
}
