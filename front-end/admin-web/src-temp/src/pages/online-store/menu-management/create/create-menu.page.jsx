import { unwrapResult } from "@reduxjs/toolkit";
import { Col, Form, message, Row } from "antd";
import { CancelButton } from "components/cancel-button";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import FnbCard from "components/fnb-card/fnb-card.component";
import { FnbInput } from "components/fnb-input/fnb-input.component";
import { FnbPageHeader } from "components/fnb-page-header/fnb-page-header";
import { ON_VIEW_MENU_MANAGEMENT } from "constants/level-menu.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "react-sortable-tree/style.css";
import {
  createMenu,
  getMenuPrepareData,
  menuManagementActions,
  menuManagementSelector,
} from "store/modules/menu-management/menu-management.reducer";
import ListMenuTree from "../components/list-menu-tree.component";
import { menuManagementHelper } from "../menu-management.helper";
import "./create-menu.style.scss";

export default function CreateMenuPage() {
  const [t] = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();
  const [formDataChanged, setFormDataChanged] = useState(false);
  const multiLevelMenus = useSelector(menuManagementSelector).create.multiLevelMenus;
  const dispatch = useDispatch();

  const translateData = {
    addNew: t("createQrCode.addNew", "Add new"),
    createMenuSuccess: t("menuOnlineStore.createMenuSuccessfully", "Create menu successfully"),
    createMenuFailed: t("menuOnlineStore.createMenuFailed", "Create menu failed"),
    generalInformation: t("createQrCode.generalInformation", "General information"),
    menuName: t("onlineStore.menuName", "Menu name"),
    pleaseEnterMenuName: t("menuOnlineStore.pleaseEnterTheMenuName", "Please enter the menu name"),
    enterMenuName: t("menuOnlineStore.enterMenuName", "Enter menu name"),
    menuItem: t("onlineStore.menuItem", "Menu Items"),
    createNewMenu: t("menuOnlineStore.createNewMenu", "Create new menu"),
    pleaseEnterAllInformation: t("menuManagement.menuItem.pleaseEnterAllInformation"),
  };

  useEffect(() => {
    dispatch(menuManagementActions.resetDataInsert())
    dispatch(getMenuPrepareData());
  }, [dispatch]);

  const onClickCreateMenu = async () => {
    const formValues = await form.validateFields();
    const isValidForm = menuManagementHelper.checkIsValidFormMenuItems(multiLevelMenus);
    if (isValidForm) {
      setFormDataChanged(false);
      const data = {
        menu: { name: formValues.name },
        multiLevelMenus,
      };
      const resInsert = unwrapResult(await dispatch(createMenu(data)));
      if (resInsert?.isSuccess) {
        message.success(translateData.createMenuSuccess);
        dispatch(menuManagementActions.resetDataInsert());
        redirectToPageManagement();
      } else {
        message.error(translateData.createMenuFailed);
      }
    } else {
      message.error(translateData.pleaseEnterAllInformation);
      dispatch(menuManagementActions.validateForm({ onView: ON_VIEW_MENU_MANAGEMENT.CREATE }));
    }
  };

  const redirectToPageManagement = () => {
    setTimeout(() => {
      history.push("/online-store/menu-management");
    }, 100);
  };

  const checkIsFormChanged = () => {
    const isChangeTreeData =
      multiLevelMenus?.length !== 1 ||
      (multiLevelMenus?.length > 0 &&
        (multiLevelMenus[0]?.name || multiLevelMenus[0]?.hyperlinkOption > 0
          ? true
          : false));

    return isChangeTreeData || formDataChanged;
  };

  return (
    <div className="page-create-multilevel-menu">
      <FnbPageHeader
        title={translateData.createNewMenu}
        actionButtons={[
          {
            action: <FnbAddNewButton onClick={onClickCreateMenu} text={translateData.addNew} />,
            permission: PermissionKeys.CREATE_MENU_MANAGEMENT,
          },
          {
            action: <CancelButton showWarning={checkIsFormChanged} onOk={redirectToPageManagement} />,
          },
        ]}
      />
      <Form
        className="form-menu-management"
        form={form}
        layout="vertical"
        autoComplete="off"
        onFieldsChange={() => setFormDataChanged(true)}
      >
        <FnbCard title={translateData.generalInformation} className="pt-4">
          <Row gutter={[16, 16]}>
            <Col sm={24} lg={12} className="w-100">
              <Form.Item
                name="name"
                label={translateData.menuName}
                rules={[{ required: true, message: translateData.pleaseEnterMenuName }]}
              >
                <FnbInput showCount placeholder={translateData.enterMenuName} maxLength={100} />
              </Form.Item>
            </Col>
          </Row>
        </FnbCard>
      </Form>
      <ListMenuTree onView={ON_VIEW_MENU_MANAGEMENT.CREATE} />
    </div>
  );
}
