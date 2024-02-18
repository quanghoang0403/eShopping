import { Button, Col, Form, message, Modal, Row } from "antd";
import { CancelButton } from "components/cancel-button";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import FnbCard from "components/fnb-card/fnb-card.component";
import { FnbInput } from "components/fnb-input/fnb-input.component";
import { FnbPageHeader } from "components/fnb-page-header/fnb-page-header";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { DELAYED_TIME } from "constants/default.constants";
import { Hyperlink } from "constants/hyperlink.constants";
import { LevelMenu } from "constants/level-menu.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import menuManagementDataService from "data-services/menu-management/menu-management-data.service";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import { getValidationMessages } from "utils/helpers";
import { ListMenuItemForEditComponent } from "../components/list-menu-item-for-edit.component";

export default function EditMenuPage(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const param = useParams();
  const [form] = Form.useForm();
  const [formDataChanged, setFormDataChanged] = useState(false);
  const [menuData, setMenuData] = useState(null);
  const [menuItemsData, setMenuItemsData] = useState(null);
  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMenuName, setConfirmMenuName] = useState("");
  const [showModalCanDelete, setShowModalCanDelete] = useState(false);
  const [contentModalCanDelete, setContentModalCanDelete] = useState("");
  const [showModalCanNotDelete, setShowModalCanNotDelete] = useState(false);
  const [contentModalCanNotDelete, setContentModalCanNotDelete] = useState();
  const [menuIdCanDelete, setMenuIdCanDelete] = useState();
  const editMenuItemRef = useRef(null);

  const translateData = {
    btnUpdate: t("button.update", "Update"),
    btnIgnore: t("button.ignore", "Ignore"),
    btnDelete: t("button.delete", "Delete"),
    btnIgnoreDelete: t("marketing.qrCode.ignoreText"),
    iGotIt: t("button.iGotIt"),
    updateMenuSuccess: t("menuOnlineStore.updateMenuSuccessfully", "Update menu successfully"),
    updateMenuFailed: t("menuOnlineStore.updateMenuFailed", "Update menu failed"),
    generalInformation: t("createQrCode.generalInformation", "General information"),
    menuName: t("onlineStore.menuName", "Menu name"),
    pleaseEnterMenuName: t("menuOnlineStore.pleaseEnterTheMenuName", "Please enter the menu name"),
    enterMenuName: t("menuOnlineStore.enterMenuName", "Enter menu name"),
    level: t("menuOnlineStore.level", "Level"),
    menuItem: t("onlineStore.menuItem", "Menu Items"),
    createNewMenu: t("menuOnlineStore.createNewMenu", "Create new menu"),
    confirmChangeFromLevel1ToLevel2: t("menuManagement.menuItem.confirmChangeFromLevel1ToLevel2"),
    confirmChangeFromLevel2ToLevel1: t("menuManagement.menuItem.confirmChangeFromLevel2ToLevel1"),
    confirmation: t("messages.confirmation", "Confirmation"),
    confirmChange: t("menuManagement.menuItem.confirmChange", "Confirm change"),
    menuBeingUseOnStoreWebsite: t("onlineStore.menuBeingUseOnStoreWebsite"),
    menuIsBeingLinked: t("onlineStore.menuIsBeingLinked"),
    pleaseUnlinkFirst: t("onlineStore.pleaseUnlinkFirst"),
    confirmDeleteMessage: t("onlineStore.confirmDeleteMenuMessage"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    deleteMenuSuccess: t("onlineStore.deleteMenuSuccess"),
    deleteMenuFail: t("onlineStore.deleteMenuFail"),
    confirmCannotDeleted: t("onlineStore.confirmCannotDeleted"),
  };

  useEffect(() => {
    const fetchData = async () => {
      await getInitDataForEditMenu();
    };

    fetchData();
  }, []);

  const getInitDataForEditMenu = async () => {
    let promises = [];
    promises.push(menuManagementDataService.getCreateMenuPrepareDataAsync());
    promises.push(menuManagementDataService.getOnlineStoreMenuByIdAsync(param.menuId));
    let [prepareDataResponse, menuDataResponse] = await Promise.all(promises);

    const { levels } = prepareDataResponse;
    let levelOption = levels?.map((level) => {
      const { levelId, levelName } = level;
      return {
        id: levelId,
        name: levelName,
      };
    });
    setLevels(levelOption);

    /// Set menu data
    const { menu } = menuDataResponse;
    setMenuData(menu);
    setCurrentLevel(menu.level);

    /// Set prepare data
    if (editMenuItemRef && editMenuItemRef.current) {
      editMenuItemRef.current.setPrepareData(prepareDataResponse);
      editMenuItemRef.current.setEditData(menu);
      editMenuItemRef.current.setCurrentLevel(menu.level);
    }

    form.setFieldsValue({
      id: menu.id,
      menuName: menu.name,
      levelId: menu.level,
    });

    /// Set menu item data
    const menuItemsData = menu?.onlineStoreMenuItems;
    if (menuItemsData) {
      let currentMenuItems = menuItemsData.map((item, index) => {
        return {
          ...item,
          menuItemName: item.name,
          position: index + 1,
        };
      });
      setMenuItemsData(currentMenuItems);
    }
  };

  const getMenuItemRequestData = (data) => {
    setFormDataChanged(true);
    setMenuItemsData(data);
  };

  const onClickEditMenu = async () => {
    const formValues = await form.validateFields();
    let request = {
      ...formValues,
      menuItems: menuItemsData,
    };

    const updateMenuResponse = await menuManagementDataService.updateMenuAsync(request).catch((errs) => {
      form.setFields(getValidationMessages(errs));
    });

    if (updateMenuResponse === true) {
      message.success(translateData.updateMenuSuccess);
      redirectToPageManagement();
    } else {
      message.error(translateData.updateMenuFailed);
    }
  };

  const onChangeLevel = async (level) => {
    let formValue = form.getFieldsValue();
    formValue.levelId = currentLevel;

    const res = await menuManagementDataService.checkMenuItemReferenceToParentMenuAsync(menuData?.id, currentLevel);
    if (res) {
      const { name } = res;
      setConfirmMenuName(name);

      if (name && name !== "") {
        setShowConfirm(true);
      } else {
        formValue.levelId = level;
        setCurrentLevel(level);

        if (editMenuItemRef && editMenuItemRef.current) {
          editMenuItemRef.current.setCurrentLevel(level);
        }
      }
    }
    form.setFieldsValue(formValue);
  };

  const onClickConfirmChange = async () => {
    const otherLevel = levels?.filter((x) => x.id !== currentLevel)[0]?.id;

    let formValue = form.getFieldsValue();
    formValue.levelId = otherLevel;
    form.setFieldsValue(formValue);

    setCurrentLevel(otherLevel);

    if (editMenuItemRef && editMenuItemRef.current) {
      editMenuItemRef.current.setCurrentLevel(otherLevel);
    }

    let request = {
      menuId: menuData?.id,
      currentLevel: currentLevel,
    };

    const res = await menuManagementDataService.updateMenuConditionAfterChangeLevelAsync(request);
    if (res) {
      let newMenuItems = menuItemsData?.filter((x) => x.hyperlinkOption !== Hyperlink.SUB_MENU);
      setMenuItemsData(newMenuItems);
      setShowConfirm(false);
    }
  };

  const formatConfirmMessage = (name, currentLevel) => {
    let mess = t(
      currentLevel === LevelMenu.Level1
        ? translateData.confirmChangeFromLevel1ToLevel2
        : translateData.confirmChangeFromLevel2ToLevel1,
      { name: name }
    );
    return mess;
  };

  const redirectToPageManagement = () => {
    setFormDataChanged(false);
    setTimeout(() => {
      history.push("/online-store/menu-management");
    }, DELAYED_TIME);
  };

  //#region Delete menu
  const showConfirmDelete = async (id, name) => {
    const response = await menuManagementDataService.checkMenuManagementUseOnStore(id);
    const { isSubMenuBeingUsed, isUseOnStoreWeb, onlineStoreMenus } = response;

    if (isUseOnStoreWeb) {
      let messageContent = <span dangerouslySetInnerHTML={{ __html: translateData.menuBeingUseOnStoreWebsite }}></span>;
      setContentModalCanNotDelete(messageContent);
      setShowModalCanNotDelete(true);
    } else if (isSubMenuBeingUsed) {
      if (onlineStoreMenus?.length === 1) {
        let messageHtml = (
          <>
            {translateData.menuIsBeingLinked}
            <br />
            <a
              style={{ color: "#F5832B" }}
              onClick={() => {
                moveToEditPage(onlineStoreMenus[0].id);
              }}
            >
              <span style={{ wordBreak: "break-word" }}>{onlineStoreMenus[0].name}</span>
            </a>
            <br />
            {translateData.pleaseUnlinkFirst}
          </>
        );

        setContentModalCanNotDelete(messageHtml);
      } else {
        const listItems = (
          <div className="table-notification-confirm-delete">
            <ul>
              {onlineStoreMenus?.map((item) => {
                return (
                  <li>
                    <a onClick={() => moveToEditPage(item.id)}>{item.name}</a>
                  </li>
                );
              })}
            </ul>
          </div>
        );

        const contentMessage = (
          <>
            <span
              dangerouslySetInnerHTML={{
                __html: `${translateData.menuIsBeingLinked} <br/> ${translateData.pleaseUnlinkFirst}`,
              }}
            ></span>
            {listItems}
          </>
        );
        setContentModalCanNotDelete(contentMessage);
      }

      setShowModalCanNotDelete(true);
    } else {
      setMenuIdCanDelete(id);
      setContentModalCanDelete(t(translateData.confirmDeleteMessage, { name: name }));
      setShowModalCanDelete(true);
    }
  };

  const onDeleteMenuManagement = async (id) => {
    const res = await menuManagementDataService.deleteMenuManagementByIdAsync(id);
    if (res) {
      message.success(translateData.deleteMenuSuccess);
      setShowModalCanDelete(false);
      redirectToPageManagement();
    } else {
      message.error(translateData.deleteMenuFail);
    }
  };

  const moveToEditPage = (id) => {
    history.push(`/menu-management/edit/${id}`);
  };
  //#endregion

  return (
    <>
      <FnbPageHeader
        actionDisabled={formDataChanged ? false : true}
        title={menuData?.name}
        actionButtons={[
          {
            action: <FnbAddNewButton hideIcon onClick={onClickEditMenu} text={translateData.btnUpdate} />,
            permission: PermissionKeys.EDIT_MENU_MANAGEMENT,
          },
          {
            action: <CancelButton showWarning={formDataChanged} onOk={redirectToPageManagement} />,
          },
          {
            action: (
              <Button
                className="button-stop-qr-code button-delete-qr-code"
                type="link"
                onClick={() => showConfirmDelete(menuData?.id, menuData?.name)}
              >
                {translateData.btnDelete}
              </Button>
            ),
            permission: PermissionKeys.DELETE_MENU_MANAGEMENT,
          },
        ]}
      />
      <Form form={form} layout="vertical" autoComplete="off" onFieldsChange={() => setFormDataChanged(true)}>
        <FnbCard title={translateData.generalInformation} className="pt-4">
          <Row gutter={[16, 16]}>
            <Col sm={24} lg={12} className="w-100">
              <Form.Item name="id" hidden="true"></Form.Item>
              <Form.Item
                name="menuName"
                label={translateData.menuName}
                rules={[{ required: true, message: translateData.pleaseEnterMenuName }]}
              >
                <FnbInput showCount placeholder={translateData.enterMenuName} maxLength={100} />
              </Form.Item>
            </Col>
            <Col sm={24} lg={12} className="w-100">
              <Form.Item name="levelId" label={translateData.level}>
                <FnbSelectSingle fixed option={levels} onChange={onChangeLevel} />
              </Form.Item>
            </Col>
          </Row>
        </FnbCard>
      </Form>

      {/* List menu item card */}
      <ListMenuItemForEditComponent
        t={t}
        ref={editMenuItemRef}
        setMenuItemRequestData={getMenuItemRequestData}
        setFormDataChanged={setFormDataChanged}
      ></ListMenuItemForEditComponent>

      {/* Popup when change level */}
      <DeleteConfirmComponent
        title={translateData.confirmation}
        content={formatConfirmMessage(confirmMenuName, currentLevel)}
        okText={translateData.confirmChange}
        visible={showConfirm}
        skipPermission={true}
        cancelText={translateData.btnIgnore}
        onOk={() => onClickConfirmChange()}
        onCancel={() => setShowConfirm(false)}
      />

      {/* Modal delete */}
      <Modal
        className={`delete-confirm-modal`}
        title={translateData.confirmDelete}
        open={showModalCanNotDelete}
        okText={translateData.iGotIt}
        closable={false}
        onOk={() => setShowModalCanNotDelete(false)}
        onCancel={() => setShowModalCanNotDelete(false)}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <span>{contentModalCanNotDelete}</span>
      </Modal>

      <Modal
        className={`delete-confirm-modal`}
        title={translateData.confirmDelete}
        open={showModalCanDelete}
        okText={translateData.btnDelete}
        okType={"danger"}
        closable={false}
        cancelText={translateData.btnIgnore}
        onCancel={() => setShowModalCanDelete(false)}
        onOk={() => onDeleteMenuManagement(menuIdCanDelete)}
      >
        <span dangerouslySetInnerHTML={{ __html: `${contentModalCanDelete}` }}></span>
      </Modal>
    </>
  );
}
