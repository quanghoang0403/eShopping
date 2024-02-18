import { Dropdown } from "antd";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbInput } from "components/fnb-input/fnb-input.component";
import { FnbSelectHyperlink } from "components/fnb-select-hyperlink/fnb-select-hyperlink";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { Hyperlink, HYPERLINK_SELECT_OPTION } from "constants/hyperlink.constants";
import { DragIcon, EllipsisOutlined } from "constants/icons.constants";
import { ACTION_MENU_ITEMS } from "constants/level-menu.constants";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FORM_FIELD_SORTABLE_TREE_TYPE,
  menuManagementActions,
  menuManagementSelector,
} from "store/modules/menu-management/menu-management.reducer";
import { useTranslation } from "react-i18next";
import "./menu-tree-item.style.scss";

function MenuTreeItem(props) {
  const { showLevel = true, nodeInfo, onView } = props;
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const menuPrepareData = useSelector(menuManagementSelector).menuPrepareData;
  const CHANGE_INPUT_TYPE = {
    NAME: "name",
    HYPERLINK: "hyperlink",
    ...Hyperlink,
  };

  const translatedData = {
    delete: t("button.delete"),
    confirmDelete: t("messages.pageConfirmationDeleteTitle"),
    confirmation: t("messages.confirmation", "Confirmation"),
    deleteContent: t("menuManagement.menuItem.deleteContent"),
    ignore: t("menuManagement.menuItem.ignore"),
    addItemAbove: t("menuManagement.menuItem.addItemAbove"),
    addItemBelow: t("menuManagement.menuItem.addItemBelow"),
    form: {
      name: {
        placeholder: t("menuManagement.menuItem.enterItemName"),
        validation: t("menuManagement.menuItem.nameValidation"),
      },
      hyperlink: {
        placeholder: t("menuManagement.menuItem.hyperlink.placeholder"),
        validation: t("menuManagement.menuItem.hyperlink.validation"),
      },
      url: {
        placeholder: t("menuManagement.menuItem.hyperlink.dynamic.url.placeholder"),
        validation: t("menuManagement.menuItem.hyperlink.dynamic.url.validation"),
      },
      category: {
        placeholder: t("menuManagement.menuItem.hyperlink.dynamic.category.placeholder"),
        validation: t("menuManagement.menuItem.hyperlink.dynamic.category.validation"),
      },
      product: {
        placeholder: t("menuManagement.menuItem.hyperlink.dynamic.product.placeholder"),
        validation: t("menuManagement.menuItem.hyperlink.dynamic.product.validation"),
      },
      page: {
        placeholder: t("menuManagement.menuItem.hyperlink.dynamic.page.placeholder"),
        validation: t("menuManagement.menuItem.hyperlink.dynamic.page.validation"),
      },
      blog: {
        placeholder: t("menuManagement.menuItem.hyperlink.dynamic.blog.placeholder"),
        validation: t("menuManagement.menuItem.hyperlink.dynamic.blog.validation"),
      },
    },
  };

  const [hyperlinkSelectOptions] = useState(HYPERLINK_SELECT_OPTION.filter((item) => item.id !== Hyperlink.SUB_MENU));
  const [name, setName] = useState("");
  const [hyperlinkOptionValue, setHyperlinkOptionValue] = useState();
  const [url, setUrl] = useState("");
  const [categoryId, setCategoryId] = useState(undefined);
  const [productId, setProductId] = useState(undefined);
  const [pageId, setPageId] = useState(undefined);
  const [blogId, setBlogId] = useState(undefined);
  const [showModalDelete, setShowModalDelete] = useState(false);

  const timeoutUrlRef = useRef(null);
  const timeoutNameRef = useRef(null);

  const onChangeUrl = (value) => {
    setUrl(value);
    if (timeoutUrlRef.current) {
      clearTimeout(timeoutUrlRef.current);
    }
    timeoutUrlRef.current = setTimeout(() => {
      onChangeValue(value, CHANGE_INPUT_TYPE.URL);
    }, 200);
  };

  const onChangeName = (value) => {
    setName(value);
    if (timeoutNameRef.current) {
      clearTimeout(timeoutNameRef.current);
    }
    timeoutNameRef.current = setTimeout(() => {
      onChangeValue(value, CHANGE_INPUT_TYPE.NAME);
    }, 200);
  };

  const onChangeValue = (value, type) => {
    let newNode = { ...nodeInfo?.node, url: nodeInfo?.hyperlinkOption === Hyperlink.URL ? nodeInfo?.url : "" };
    let typeFormField = "";
    switch (type) {
      case CHANGE_INPUT_TYPE.NAME:
        newNode = {
          ...newNode,
          name: value,
        };

        typeFormField = FORM_FIELD_SORTABLE_TREE_TYPE.name;
        setName(value);
        break;
      case CHANGE_INPUT_TYPE.HYPERLINK:
        newNode = {
          ...newNode,
          hyperlinkOption: value,
        };

        typeFormField = FORM_FIELD_SORTABLE_TREE_TYPE.hyperlinkOption;
        setHyperlinkOptionValue(value);
        break;
      case CHANGE_INPUT_TYPE.URL:
        newNode = {
          ...newNode,
          url: value,
        };
        typeFormField = FORM_FIELD_SORTABLE_TREE_TYPE.url;
        break;
      case Hyperlink.CATEGORY:
        newNode = {
          ...newNode,
          categoryId: value,
        };

        typeFormField = FORM_FIELD_SORTABLE_TREE_TYPE.categoryId;
        setCategoryId(value);
        break;
      case Hyperlink.PRODUCT_DETAIL:
        newNode = {
          ...newNode,
          productId: value,
        };

        typeFormField = FORM_FIELD_SORTABLE_TREE_TYPE.productId;
        setProductId(value);
        break;
      case Hyperlink.MY_PAGES:
        newNode = {
          ...newNode,
          pageId: value,
        };

        typeFormField = FORM_FIELD_SORTABLE_TREE_TYPE.pageId;
        setPageId(value);
        break;
      case Hyperlink.BLOG_DETAIL:
        newNode = {
          ...newNode,
          blogId: value,
        };

        typeFormField = FORM_FIELD_SORTABLE_TREE_TYPE.blogId;
        setBlogId(value);
        break;
      default:
        break;
    }

    newNode = {
      ...newNode,
      invalidFormField: { ...newNode?.invalidFormField, [typeFormField]: value ? false : true },
    };
    dispatch(menuManagementActions.updateDataInNode({ nodeModified: newNode, onView: onView }));
  };

  useEffect(() => {
    const node = nodeInfo?.node;
    setHyperlinkOptionValue(node?.hyperlinkOption ? node?.hyperlinkOption : undefined);
    setName(node?.name ?? "");
    setUrl(node?.hyperlinkOption === Hyperlink.URL ? node?.url : "");
    setCategoryId(node?.categoryId ? node?.categoryId : undefined);
    setProductId(node?.productId ? node?.productId : undefined);
    setPageId(node?.pageId ? node?.pageId : undefined);
    setBlogId(node?.blogId ? node?.blogId : undefined);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeInfo?.node]);

  const handleClickMenuDropdown = (e) => {
    switch (e.key) {
      case ACTION_MENU_ITEMS.ADD_ABOVE:
        dispatch(
          menuManagementActions.addNode({
            onView: onView,
            nodeItem: {
              id: nodeInfo?.node?.id,
              behavior: ACTION_MENU_ITEMS.ADD_ABOVE,
              treeIndex: nodeInfo?.treeIndex,
              path: nodeInfo?.path,
            },
          }),
        );
        break;
      case ACTION_MENU_ITEMS.ADD_BELOW:
        dispatch(
          menuManagementActions.addNode({
            onView: onView,
            nodeItem: {
              id: nodeInfo?.node?.id,
              behavior: ACTION_MENU_ITEMS.ADD_BELOW,
              treeIndex: nodeInfo?.treeIndex,
              path: nodeInfo?.path,
            },
          }),
        );
        break;
      case ACTION_MENU_ITEMS.DELETE:
        setShowModalDelete(true);
        break;
      default:
        break;
    }
  };
  const menuDropdownProps = {
    items: [
      {
        key: ACTION_MENU_ITEMS.ADD_ABOVE,
        label: translatedData.addItemAbove,
      },
      {
        key: ACTION_MENU_ITEMS.ADD_BELOW,
        label: translatedData.addItemBelow,
      },
      {
        key: ACTION_MENU_ITEMS.DELETE,
        label: translatedData.delete,
      },
    ],
    onClick: handleClickMenuDropdown,
  };

  const onConfirmDeleteNode = () => {
    setShowModalDelete(false);
    dispatch(
      menuManagementActions.deleteNode({
        onView: onView,
        nodeModified: { id: nodeInfo?.node?.id, path: nodeInfo?.path },
      }),
    );
  };

  useEffect(() => {
    const elementSortableTree = document.getElementById("id-sortable-tree-list-menu");
    if (elementSortableTree) {
      const columnGap = 80;
      const widthSortableTree = elementSortableTree.offsetWidth;
      const minWidthNode = 1200;
      const level = nodeInfo?.path?.length;
      const elementItemNode = document.getElementById(`id-menu-tree-item-${nodeInfo?.node?.id}`);
      const widthExpected = widthSortableTree - level * columnGap;
      if (widthExpected < widthSortableTree) {
        elementItemNode.style.width = `${widthExpected > minWidthNode ? widthExpected : minWidthNode}px`;
      }
    }
  }, [nodeInfo]);

  return (
    <div className="menu-tree-item" id={`id-menu-tree-item-${nodeInfo?.node?.id}`}>
      {showLevel && (
        <div className="level-menu-multi-level" id={`level-menu-multi-level__${nodeInfo?.node?.id}`}>
          {nodeInfo?.path?.length}
        </div>
      )}
      <DragIcon className="icon-drag-menu-tree-item" />
      <>
        <FnbInput
          showCount
          maxLength={100}
          className={`item-input-menu-tree ${
            nodeInfo?.node?.invalidFormField?.name ? "item-input-menu-tree--invalid" : ""
          }`}
          value={name}
          onChange={(e) => onChangeName(e.target.value)}
          placeholder={
            !nodeInfo?.node?.invalidFormField?.name
              ? translatedData.form.name.placeholder
              : translatedData.form.name.validation
          }
        />
        <FnbSelectHyperlink
          showSearch
          placeholder={
            !nodeInfo?.node?.invalidFormField?.hyperlinkOption
              ? translatedData.form.hyperlink.placeholder
              : translatedData.form.hyperlink.validation
          }
          className={`item-selection-menu-tree ${
            nodeInfo?.node?.invalidFormField?.hyperlinkOption ? "item-selection-menu-tree--invalid" : ""
          }`}
          allowClear
          fixed
          value={hyperlinkOptionValue}
          onChange={(e) => onChangeValue(e, CHANGE_INPUT_TYPE.HYPERLINK)}
          option={hyperlinkSelectOptions}
          listHeight={400}
        ></FnbSelectHyperlink>

        {hyperlinkOptionValue === Hyperlink.URL && (
          <FnbInput
            name="url"
            placeholder={
              !nodeInfo?.node?.invalidFormField?.url
                ? translatedData.form.url.placeholder
                : translatedData.form.url.validation
            }
            className={`item-input-menu-tree fnb-input ${
              nodeInfo?.node?.invalidFormField?.url ? "item-input-menu-tree--invalid" : ""
            }`}
            value={url}
            onChange={(e) => onChangeUrl(e.target.value)}
          />
        )}
        {hyperlinkOptionValue === Hyperlink.CATEGORY && (
          <FnbSelectSingle
            placeholder={
              !nodeInfo?.node?.invalidFormField?.categoryId
                ? translatedData.form.category.placeholder
                : translatedData.form.category.validation
            }
            className={`item-selection-menu-tree ${
              nodeInfo?.node?.invalidFormField?.categoryId ? "item-selection-menu-tree--invalid" : ""
            }`}
            showSearch
            fixed
            option={menuPrepareData?.productCategories?.map((item) => ({
              id: item.id,
              name: item.name,
            }))}
            allowClear
            value={categoryId}
            onChange={(e) => onChangeValue(e, CHANGE_INPUT_TYPE.CATEGORY)}
          />
        )}
        {hyperlinkOptionValue === Hyperlink.PRODUCT_DETAIL && (
          <FnbSelectSingle
            placeholder={
              !nodeInfo?.node?.invalidFormField?.productId
                ? translatedData.form.product.placeholder
                : translatedData.form.product.validation
            }
            className={`item-selection-menu-tree ${
              nodeInfo?.node?.invalidFormField?.productId ? "item-selection-menu-tree--invalid" : ""
            }`}
            showSearch
            fixed
            option={menuPrepareData?.products?.map((item) => ({
              id: item.id,
              name: item.name,
            }))}
            allowClear
            value={productId}
            onChange={(e) => onChangeValue(e, CHANGE_INPUT_TYPE.PRODUCT_DETAIL)}
          />
        )}
        {hyperlinkOptionValue === Hyperlink.MY_PAGES && (
          <FnbSelectSingle
            placeholder={
              !nodeInfo?.node?.invalidFormField?.pageId
                ? translatedData.form.page.placeholder
                : translatedData.form.page.validation
            }
            className={`item-selection-menu-tree ${
              nodeInfo?.node?.invalidFormField?.pageId ? "item-selection-menu-tree--invalid" : ""
            }`}
            showSearch
            fixed
            option={menuPrepareData?.pages?.map((item) => ({
              id: item.id,
              name: item.name,
            }))}
            allowClear
            value={pageId}
            onChange={(e) => onChangeValue(e, CHANGE_INPUT_TYPE.MY_PAGES)}
          />
        )}
        {hyperlinkOptionValue === Hyperlink.BLOG_DETAIL && (
          <FnbSelectSingle
            placeholder={
              !nodeInfo?.node?.invalidFormField?.blogId
                ? translatedData.form.blog.placeholder
                : translatedData.form.blog.validation
            }
            className={`item-selection-menu-tree ${
              nodeInfo?.node?.invalidFormField?.blogId ? "item-selection-menu-tree--invalid" : ""
            }`}
            showSearch
            fixed
            option={menuPrepareData?.blogs?.map((item) => ({
              id: item.id,
              name: item.name,
            }))}
            allowClear
            value={blogId}
            onChange={(e) => onChangeValue(e, CHANGE_INPUT_TYPE.BLOG_DETAIL)}
          />
        )}
      </>
      <Dropdown menu={menuDropdownProps} placement="bottomRight" overlayClassName="dropdown-option-menu-tree-item">
        <EllipsisOutlined className="icon-option-menu-tree-item" />
      </Dropdown>
      <DeleteConfirmComponent
        title={translatedData.confirmation}
        content={translatedData.deleteContent}
        visible={showModalDelete}
        skipPermission={true}
        cancelText={translatedData.ignore}
        okText={translatedData.confirmDelete}
        onCancel={() => setShowModalDelete(false)}
        onOk={onConfirmDeleteNode}
      />
    </div>
  );
}

export default MenuTreeItem;
