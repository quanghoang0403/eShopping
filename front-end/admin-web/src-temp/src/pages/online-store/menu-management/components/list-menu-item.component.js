import { Button, Card } from "antd";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { EditButtonComponent } from "components/edit-button/edit-button.component";
import { FnbTable } from "components/fnb-table/fnb-table";
import { Hyperlink } from "constants/hyperlink.constants";
import {
  PlusOrangeIcon,
  VectorDownBlackIcon,
  VectorRightBlackIcon,
  VectorSortDownIcon,
  VectorSortUpFirstRowIcon,
  VectorSortUpIcon,
} from "constants/icons.constants";
import { LevelMenu } from "constants/level-menu.constants";
import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { FormAddMenuItemComponent } from "./form-add-menu-item.component";
import "./menu-item.style.scss";

export const ListMenuItemComponent = forwardRef((props, ref) => {
  const { t, setMenuItemRequestData, setFormDataChanged } = props;
  const [showAddNewMenuItem, setShowAddNewMenuItem] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const addMenuItemRef = useRef(null);
  const LIMIT_MENU_ITEMS = 100;
  const pageData = {
    title: t("menuManagement.menuItem.title", "Menu items"),
    btnDelete: t("button.delete", "Delete"),
    btnIgnore: t("button.ignore", "Ignore"),
    confirmDelete: t("leaveDialog.confirmDelete", "Confirm Delete"),
    confirmDeleteMessageMenuItem: t("messages.confirmDeleteMessageMenuItem"),
    addMenuItem: t("menuManagement.menuItem.addMenuItem", "Add menu item"),
    empty: t("menuManagement.menuItem.empty", "This menu doesn't have any items"),
    table: {
      no: t("table.no", "No"),
      action: t("table.action", "Action"),
      item: t("menuManagement.menuItem.item", "Item"),
    },
  };

  useImperativeHandle(ref, () => ({
    setPrepareData(data) {
      if (addMenuItemRef && addMenuItemRef.current) {
        addMenuItemRef.current.setPrepareData(data);
      }
    },
    setCurrentLevel(level) {
      if (addMenuItemRef && addMenuItemRef.current) {
        addMenuItemRef.current.setIsHideSubmenuOption(level === LevelMenu.Level2 ? true : false);
        if (level === LevelMenu.Level2) {
          let newMenuItems = menuItems?.filter((x) => x.hyperlinkOption !== Hyperlink.SUB_MENU);
          setMenuItems(newMenuItems);
        }
      }
    },
  }));

  const onClickAddMenuItem = () => {
    setShowAddNewMenuItem(true);

    if (addMenuItemRef && addMenuItemRef.current) {
      addMenuItemRef.current.setEditMenuItem(false);
    }
  };

  const setMenuItemData = (data, isEdit) => {
    setShowAddNewMenuItem(false);
    let result = [];
    let menuItem = {
      ...data,
      position: menuItems.length + 1,
    };

    if (isEdit) {
      const currentMenuItems = menuItems;
      const newMenuItems = [menuItem];

      result = currentMenuItems.map((obj) => newMenuItems.find((o) => o.id === obj.id) || obj);
      result = result.map((item, index) => ({
        ...item,
        position: index + 1,
      }));
    } else {
      result = menuItems.concat(menuItem);
    }

    setMenuItems(result);
    setMenuItemRequestData(result);
  };

  const onEditItem = (data) => {
    setShowAddNewMenuItem(true);

    if (addMenuItemRef && addMenuItemRef.current) {
      addMenuItemRef.current.setEditMenuItem(true);
      addMenuItemRef.current.setDataForEdit(data);
    }
  };

  const formatDeleteMessage = (name) => {
    let mess = t(pageData.confirmDeleteMessageMenuItem, { name: name });
    return mess;
  };

  const onRemoveItem = (id) => {
    let newMenuItems = menuItems?.filter((x) => x.id !== id);
    newMenuItems = newMenuItems.map((item, index) => ({
      ...item,
      position: index + 1,
    }));

    setMenuItems(newMenuItems);
    setMenuItemRequestData(newMenuItems);
  };

  const onChangePosition = (id, isSortUp) => {
    if (isSortUp) {
      let index = menuItems.findIndex((e) => e.id === id);
      if (index > 0) {
        let el = menuItems[index];
        menuItems[index] = menuItems[index - 1];
        menuItems[index - 1] = el;
      }
    } else {
      let index = menuItems.findIndex((e) => e.id === id);
      if (index !== -1 && index < menuItems.length - 1) {
        let el = menuItems[index];
        menuItems[index] = menuItems[index + 1];
        menuItems[index + 1] = el;
      }
    }

    let result = menuItems.map((obj) => menuItems.find((o) => o.id === obj.id) || obj);
    result = result.map((item, index) => ({
      ...item,
      position: index + 1,
    }));

    setMenuItems(result);
    setMenuItemRequestData(result);
  };

  const expandedRowRender = (record) => {
    return (
      <div class="expanded-record">
        {record?.subMenu?.onlineStoreMenuItems?.map((item) => {
          return (
            <div className="expand-record-item">
              <span className="item-text"> {item?.name}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const tableMenuItemSettings = {
    columns: [
      {
        title: pageData.table.no,
        dataIndex: "position",
        key: "position",
        width: "132px",
      },
      {
        title: pageData.table.item,
        dataIndex: "menuItemName",
        key: "menuItemName",
        width: "1076px",
        render: (_, record) => <span className="text-name">{record?.menuItemName}</span>,
      },
      {
        title: pageData.table.action,
        key: "action",
        width: "220px",
        render: (_, record) => {
          return (
            <div className="action-container">
              <div className="sort-container">
                <div
                  className={record?.position > 1 && "cursor-pointer"}
                  onClick={record?.position > 1 ? () => onChangePosition(record?.id, true) : () => null}
                >
                  {record?.position > 1 ? <VectorSortUpIcon /> : <VectorSortUpFirstRowIcon />}
                </div>
                <div
                  className={record?.position < menuItems.length && "cursor-pointer"}
                  onClick={record?.position < menuItems.length ? () => onChangePosition(record?.id, false) : () => null}
                >
                  <VectorSortDownIcon />
                </div>
              </div>
              <div>
                <EditButtonComponent className="mr-3" onClick={() => onEditItem(record)} />
                <DeleteConfirmComponent
                  title={pageData.confirmDelete}
                  content={formatDeleteMessage(record?.menuItemName)}
                  okText={pageData.btnDelete}
                  cancelText={pageData.btnIgnore}
                  onOk={() => onRemoveItem(record?.id)}
                />
              </div>
            </div>
          );
        },
      },
    ],
  };

  return (
    <>
      <Card className="w-100 fnb-card menu-item-card">
        <div className="menu-item-header-box">
          <h3 className="menu-item-title mb-0">{pageData.title}</h3>
          <Button
            disabled={menuItems.length >= LIMIT_MENU_ITEMS}
            icon={<PlusOrangeIcon className={menuItems.length >= LIMIT_MENU_ITEMS ? "icon-disabled" : ""} />}
            className="btn-add-menu-item float-right"
            onClick={() => onClickAddMenuItem()}
          >
            {pageData.addMenuItem}
          </Button>
        </div>
        <div className="table-menu-item-container">
          <FnbTable
            className="table-menu-item"
            columns={tableMenuItemSettings.columns}
            expandable={{
              expandedRowRender,
              rowExpandable: (record) => record.subMenu && record.subMenu?.onlineStoreMenuItems?.length > 0,
              expandIcon: ({ expanded, onExpand, record }) =>
                record.subMenu &&
                record.subMenu?.onlineStoreMenuItems?.length > 0 &&
                (expanded ? (
                  <VectorDownBlackIcon onClick={(e) => onExpand(record, e)} />
                ) : (
                  <VectorRightBlackIcon onClick={(e) => onExpand(record, e)} />
                )),
            }}
            dataSource={menuItems}
            scrollY={96 * 5}
            rowKey="id"
            emptyText={pageData.empty}
          ></FnbTable>
        </div>
      </Card>

      {/* Add menu item */}
      <FormAddMenuItemComponent
        t={t}
        onCancel={() => setShowAddNewMenuItem(false)}
        ref={addMenuItemRef}
        showAddNewMenuItemForm={showAddNewMenuItem}
        setMenuItemData={setMenuItemData}
        setFormDataChanged={setFormDataChanged}
      />
    </>
  );
});
