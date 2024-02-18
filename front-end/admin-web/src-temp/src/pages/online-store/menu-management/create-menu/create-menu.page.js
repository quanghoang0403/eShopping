import { Col, Form, message, Row } from "antd";
import { CancelButton } from "components/cancel-button";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import FnbCard from "components/fnb-card/fnb-card.component";
import { FnbInput } from "components/fnb-input/fnb-input.component";
import { FnbPageHeader } from "components/fnb-page-header/fnb-page-header";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { DELAYED_TIME } from "constants/default.constants";
import { LevelMenu } from "constants/level-menu.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import menuManagementDataService from "data-services/menu-management/menu-management-data.service";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { getValidationMessages } from "utils/helpers";
import { ListMenuItemComponent } from "../components/list-menu-item.component";
import "./create-menu.page.scss";

export default function CreateMenuPage({}) {
  const [t] = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();
  const [formDataChanged, setFormDataChanged] = useState(false);
  const [createMenuPrepareData, setCreateMenuPrepareData] = useState({});
  const [menuItemsData, setMenuItemsData] = useState(null);
  const createMenuItemRef = useRef(null);

  const translateData = {
    addNew: t("createQrCode.addNew", "Add new"),
    createMenuSuccess: t("menuOnlineStore.createMenuSuccessfully", "Create menu successfully"),
    createMenuFailed: t("menuOnlineStore.createMenuFailed", "Create menu failed"),
    generalInformation: t("createQrCode.generalInformation", "General information"),
    menuName: t("onlineStore.menuName", "Menu name"),
    pleaseEnterMenuName: t("menuOnlineStore.pleaseEnterTheMenuName", "Please enter the menu name"),
    enterMenuName: t("menuOnlineStore.enterMenuName", "Enter menu name"),
    level: t("menuOnlineStore.level", "Level"),
    menuItem: t("onlineStore.menuItem", "Menu Items"),
    createNewMenu: t("menuOnlineStore.createNewMenu", "Create new menu"),
  };

  useEffect(() => {
    const fetchData = async () => {
      await getInitDataForCreateMenu();
    };

    fetchData();
  }, []);

  const getInitDataForCreateMenu = async () => {
    const prepareData = await menuManagementDataService.getCreateMenuPrepareDataAsync();
    if (prepareData) {
      setCreateMenuPrepareData(prepareData);

      /// Set prepare data
      if (createMenuItemRef && createMenuItemRef.current) {
        createMenuItemRef.current.setPrepareData(prepareData);
      }
    }
  };

  const getLevels = () => {
    const { levels } = createMenuPrepareData;
    return levels?.map((level) => {
      const { levelId, levelName } = level;
      return {
        id: levelId,
        name: levelName,
      };
    });
  };

  const onClickCreateMenu = async () => {
    const formValues = await form.validateFields();

    let request = {
      ...formValues,
      menuItems: menuItemsData,
    };

    const createMenuResponse = await menuManagementDataService.createMenuAsync(request).catch((errs) => {
      form.setFields(getValidationMessages(errs));
    });

    if (createMenuResponse === true) {
      message.success(translateData.createMenuSuccess);
      redirectToPageManagement();
    } else {
      message.error(translateData.createMenuFailed);
    }
  };

  const getMenuItemRequestData = (data) => {
    setFormDataChanged(true);
    setMenuItemsData(data);
  };

  const onChangeLevel = (level) => {
    if (createMenuItemRef && createMenuItemRef.current) {
      createMenuItemRef.current.setCurrentLevel(level);
    }
  };

  const redirectToPageManagement = () => {
    setFormDataChanged(false);
    setTimeout(() => {
      history.push("/online-store/menu-management");
    }, DELAYED_TIME);
  };

  return (
    <>
      <FnbPageHeader
        actionDisabled={formDataChanged ? false : true}
        title={translateData.createNewMenu}
        actionButtons={[
          {
            action: <FnbAddNewButton onClick={onClickCreateMenu} text={translateData.addNew} />,
            permission: PermissionKeys.CREATE_MENU_MANAGEMENT,
          },
          {
            action: <CancelButton showWarning={formDataChanged} onOk={redirectToPageManagement} />,
          },
        ]}
      />
      <Form
        className="create-qr-code"
        form={form}
        layout="vertical"
        autoComplete="off"
        onFieldsChange={() => setFormDataChanged(true)}
      >
        <FnbCard title={translateData.generalInformation} className="pt-4">
          <Row gutter={[16, 16]}>
            <Col sm={24} lg={12} className="w-100">
              <Form.Item
                name="menuName"
                label={translateData.menuName}
                rules={[{ required: true, message: translateData.pleaseEnterMenuName }]}
              >
                <FnbInput showCount placeholder={translateData.enterMenuName} maxLength={255} />
              </Form.Item>
            </Col>
            <Col sm={24} lg={12} className="w-100">
              <Form.Item name="levelId" label={translateData.level} initialValue={LevelMenu.Level1}>
                <FnbSelectSingle option={getLevels()} onChange={onChangeLevel} />
              </Form.Item>
            </Col>
          </Row>
        </FnbCard>
      </Form>

      {/* List menu item card */}
      <ListMenuItemComponent
        t={t}
        ref={createMenuItemRef}
        setMenuItemRequestData={getMenuItemRequestData}
        setFormDataChanged={setFormDataChanged}
      ></ListMenuItemComponent>
    </>
  );
}
