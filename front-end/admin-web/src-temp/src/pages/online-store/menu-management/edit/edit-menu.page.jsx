import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Col, Form, message, Row } from "antd";
import { CancelButton } from "components/cancel-button";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import FnbCard from "components/fnb-card/fnb-card.component";
import { FnbInput } from "components/fnb-input/fnb-input.component";
import { FnbPageHeader } from "components/fnb-page-header/fnb-page-header";
import { ON_VIEW_MENU_MANAGEMENT } from "constants/level-menu.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import {
  deleteMenu,
  getMenuByIdAsync,
  getMenuPrepareData,
  menuManagementActions,
  menuManagementSelector,
  updateMenu,
} from "store/modules/menu-management/menu-management.reducer";
import ListMenuTree from "../components/list-menu-tree.component";
import { menuManagementHelper } from "../menu-management.helper";
import "./edit-menu.style.scss";

export default function EditMenuPage(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const param = useParams();
  const dispatch = useDispatch();

  const menu = useSelector(menuManagementSelector).edit.menu;
  const multiLevelMenus = useSelector(menuManagementSelector).edit.multiLevelMenus;
  const originalMultiLevelMenus = useSelector(menuManagementSelector).edit.originalMultiLevelMenus;
  const requestingGetDetail = useSelector(menuManagementSelector).edit.requestingGetDetail;

  const [form] = Form.useForm();
  const [contentModalDelete, setContentModalDelete] = useState("");
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [isFormChange, setIsFormChange] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const translatedData = {
    update: t("button.update", "Update"),
    delete: t("button.delete", "Delete"),
    ignore: t("button.ignore", "Ignore"),
    confirmation: t("messages.confirmation", "Confirmation"),
    confirmDeleteMessageMenuItem: t("messages.confirmDeleteMessageMenuItem"),
    updateMenuSuccess: t("menuOnlineStore.updateMenuSuccessfully", "Update menu successfully"),
    updateMenuFailed: t("menuOnlineStore.updateMenuFailed", "Update menu failed"),
    generalInformation: t("createQrCode.generalInformation", "General information"),
    menuName: t("onlineStore.menuName", "Menu name"),
    pleaseEnterMenuName: t("menuOnlineStore.pleaseEnterTheMenuName", "Please enter the menu name"),
    enterMenuName: t("menuOnlineStore.enterMenuName", "Enter menu name"),
    deleteMenuSuccess: t("onlineStore.deleteMenuSuccess"),
    deleteMenuFail: t("onlineStore.deleteMenuFail"),
    pleaseEnterAllInformation: t("menuManagement.menuItem.pleaseEnterAllInformation"),
  };

  useEffect(() => {
    setContentModalDelete(translatedData.confirmDeleteMessageMenuItem.replace("{{name}}", menu?.name));
  }, [translatedData, menu]);

  useEffect(() => {
    dispatch(getMenuPrepareData());
    dispatch(getMenuByIdAsync(param.menuId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    form.setFields([
      {
        name: "id",
        value: menu?.id,
      },
      {
        name: "name",
        value: menu?.name,
      },
    ]);
  }, [form, menu]);

  const onClickEditMenu = async () => {
    const formValues = await form.validateFields();
    const isValidForm = menuManagementHelper.checkIsValidFormMenuItems(multiLevelMenus);

    if (isValidForm) {
      const data = {
        menu: {
          id: formValues?.id,
          name: formValues?.name,
        },
        multiLevelMenus: multiLevelMenus,
      };
      const resUpdate = unwrapResult(await dispatch(updateMenu(data)));
      if (resUpdate?.isSuccess) {
        message.success(translatedData.updateMenuSuccess);
        setIsFormChange(false);
        dispatch(menuManagementActions.updateOriginalMenuEdit());
        redirectToPageManagement();
      } else {
        message.error(translatedData.updateMenuFailed);
      }
    } else {
      message.error(translatedData.pleaseEnterAllInformation);
      dispatch(menuManagementActions.validateForm({ onView: ON_VIEW_MENU_MANAGEMENT.EDIT }));
    }
  };

  const onConfirmDeleteMenu = async () => {
    const resDelete = unwrapResult(await dispatch(deleteMenu(menu.id)));
    if (resDelete.isSuccess) {
      message.success(translatedData.deleteMenuSuccess);
      setIsFormChange(false);
      dispatch(menuManagementActions.updateOriginalMenuEdit());
      redirectToPageManagement();
    } else {
      message.error(translatedData.deleteMenuFail);
    }
  };

  const redirectToPageManagement = () => {
    setTimeout(() => {
      history.push("/online-store/menu-management");
    }, 100);
  };

  const checkIsFormChange = () => {
    // eslint-disable-next-line eqeqeq
    const isChangeTreeData = originalMultiLevelMenus != multiLevelMenus;
    return isChangeTreeData || isFormChange;
  };

  const getActionButtons = () => {
    const actionButtons = [
      {
        action: <FnbAddNewButton hideIcon onClick={onClickEditMenu} text={translatedData.update} />,
        permission: PermissionKeys.EDIT_MENU_MANAGEMENT,
      },
      {
        action: <CancelButton showWarning={() => checkIsFormChange()} onOk={redirectToPageManagement} />,
      },
      {
        action: (
          <Button
            className="button-stop-qr-code button-delete-qr-code"
            type="link"
            onClick={() => setShowModalDelete(true)}
          >
            {translatedData.delete}
          </Button>
        ),
        permission: PermissionKeys.DELETE_MENU_MANAGEMENT,
      },
    ];

    if (menu?.isDefault) {
      actionButtons.pop();
    }
    return actionButtons;
  };

  return (
    <>
      {!requestingGetDetail && (
        <div className="page-edit-multilevel-menu">
          <FnbPageHeader
            actionDisabled={isFormChange ? false : true}
            title={menu?.name}
            actionButtons={getActionButtons()}
          />
          <Form
            className="form-menu-management"
            form={form}
            layout="vertical"
            autoComplete="off"
            onFieldsChange={() => setIsFormChange(true)}
          >
            <FnbCard title={translatedData.generalInformation} className="pt-4">
              <Row gutter={[16, 16]}>
                <Col sm={24} lg={12} className="w-100">
                  <Form.Item name="id" hidden="true"></Form.Item>
                  <Form.Item
                    name="name"
                    label={translatedData.menuName}
                    rules={[{ required: true, message: translatedData.pleaseEnterMenuName }]}
                  >
                    <FnbInput
                      defaultValue={menu?.name}
                      showCount
                      placeholder={translatedData.enterMenuName}
                      maxLength={100}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </FnbCard>
          </Form>
          <ListMenuTree onView={ON_VIEW_MENU_MANAGEMENT.EDIT} />
          <DeleteConfirmComponent
            title={translatedData.confirmation}
            content={contentModalDelete}
            visible={showModalDelete}
            skipPermission={true}
            cancelText={translatedData.ignore}
            okText={translatedData.delete}
            onCancel={() => setShowModalDelete(false)}
            onOk={onConfirmDeleteMenu}
          />
        </div>
      )}
    </>
  );
}
