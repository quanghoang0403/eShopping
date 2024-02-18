import { Form, Input, Modal, Button } from "antd";
import { FnbModal } from "components/fnb-modal/fnb-modal-component";
import { FnbSelectHyperlink } from "components/fnb-select-hyperlink/fnb-select-hyperlink";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import {
  DYNAMIC_HYPERLINK,
  Hyperlink,
  HYPERLINK_SELECT_OPTION,
} from "constants/hyperlink.constants";
import { PatternConstants } from "constants/pattern.constants";
import { useState, forwardRef, useImperativeHandle } from "react";
import { randomGuid } from "utils/helpers";

export const FormAddMenuItemComponent = forwardRef((props, ref) => {
  const {
    t,
    showAddNewMenuItemForm,
    onCancel,
    setMenuItemData,
    setFormDataChanged,
  } = props;
  const [hyperlinkSelectOptions, setHyperlinkSelectOptions] = useState(
    HYPERLINK_SELECT_OPTION
  );
  const [hyperlink, setHyperlink] = useState(null);
  const [products, setProducts] = useState(null);
  const [productCategories, setProductCategories] = useState(null);
  const [subMenus, setSubMenus] = useState(null);
  const [pages, setPages] = useState(null);
  const [blogs, setBlogs] = useState(null);
  const [menuItem, setMenuItem] = useState(null);
  const [isEdit, setIsEdit] = useState(null);
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    setPrepareData(prepareData) {
      const { products, productCategories, subMenus, pages, blogs } = prepareData;
      setProducts(products);
      setProductCategories(productCategories);
      setSubMenus(subMenus);
      setPages(pages);
      const mappingBlogs = blogs?.filter(blog => blog?.urlEncode)?.map((blog) => ({ name: blog?.name, id: blog?.urlEncode }));
      setBlogs(mappingBlogs);
    },
    setEditMenuItem(isEdit) {
      if (!isEdit) {
        form.resetFields();
        setHyperlink(null);
      }
      setIsEdit(isEdit);
    },
    setDataForEdit(data) {
      if (data) {
        setMenuItem(data);
        setHyperlink(data.hyperlinkOption);
        form.setFieldsValue(data);
      }
    },
    setIsHideSubmenuOption(isHideSubmenu) {
      if (isHideSubmenu) {
        let newOptions = hyperlinkSelectOptions.filter(
          (x) => x.id !== Hyperlink.SUB_MENU
        );
        setHyperlinkSelectOptions(newOptions);
      } else {
        setHyperlinkSelectOptions(HYPERLINK_SELECT_OPTION);
      }
    },
  }));

  const pageData = {
    btnCancel: t("button.cancel", "Cancel"),
    btnSave: t("button.save", "Save"),
    btnAdd: t("button.add", "Add"),
    btnUpdate: t("button.update", "Update"),
    confirmDelete: t("leaveDialog.confirmDelete", "Confirm Delete"),
    confirmDeleteMessage: t("messages.confirmDeleteMessage"),
    contentConfirmDelete: t(
      "leaveDialog.contentConfirmDelete",
      "Confirm Delete"
    ),
    menuItem: {
      title: t("menuManagement.menuItem.title", "Menu items"),
      addMenuItem: t("menuManagement.menuItem.addMenuItem", "Add menu item"),
      editMenuItem: t("menuManagement.menuItem.editMenuItem", "Edit menu item"),
      empty: t(
        "menuManagement.menuItem.empty",
        "This menu doesn't have any items"
      ),
      name: t(
        "menuManagement.menuItem.name",
        "There is no Sub-menu for this menu item"
      ),
      namePlaceholder: t(
        "menuManagement.menuItem.namePlaceholder",
        "e.g. About us"
      ),
      nameValidation: t(
        "menuManagement.menuItem.nameValidation",
        "Please enter menu item name"
      ),
      item: t("menuManagement.menuItem.item", "Item"),
      no: t("menuManagement.menuItem.no", "No"),
      action: t("menuManagement.menuItem.action", "Action"),
    },
    hyperlink: {
      title: t("menuManagement.menuItem.hyperlink.title", "Hyperlink"),
      homePage: t("menuManagement.menuItem.hyperlink.homePage", "Home page"),
      product: t("menuManagement.menuItem.hyperlink.product", "Products"),
      contact: t("menuManagement.menuItem.hyperlink.contact", "Contact"),
      aboutUs: t("menuManagement.menuItem.hyperlink.aboutUs", "About us"),
      blogs: t("menuManagement.menuItem.hyperlink.blogs", "Blogs"),
      url: t("menuManagement.menuItem.hyperlink.url", "URL"),
      category: t("menuManagement.menuItem.hyperlink.category", "Category"),
      productDetail: t(
        "menuManagement.menuItem.hyperlink.productDetail",
        "Product detail"
      ),
      myPage: t("menuManagement.menuItem.hyperlink.myPage", "My pages"),
      blogDetail: t(
        "menuManagement.menuItem.hyperlink.blogDetail",
        "Blog detail"
      ),
      subMenu: t("menuManagement.menuItem.hyperlink.subMenu", "Sub-menu"),
      placeholder: t(
        "menuManagement.menuItem.hyperlink.placeholder",
        "Select hyperlink"
      ),
      validation: t(
        "menuManagement.menuItem.hyperlink.validation",
        "Please select hyperlink"
      ),
      dynamic: {
        url: {
          title: t(
            "menuManagement.menuItem.hyperlink.dynamic.url.title",
            "URL"
          ),
          placeholder: t(
            "menuManagement.menuItem.hyperlink.dynamic.url.placeholder",
            "Enter URL link"
          ),
          validation: t(
            "menuManagement.menuItem.hyperlink.dynamic.url.validation",
            "Please enter URL link"
          ),
          invalidUrl: t(
            "menuManagement.menuItem.hyperlink.dynamic.url.invalidUrl"
          ),
        },
        blog: {
          title: t(
            "menuManagement.menuItem.hyperlink.dynamic.blog.title",
            "Blog"
          ),
          placeholder: t(
            "menuManagement.menuItem.hyperlink.dynamic.blog.placeholder",
            "Select blog"
          ),
          validation: t(
            "menuManagement.menuItem.hyperlink.dynamic.blog.validation",
            "Please select blog"
          ),
        },
        product: {
          title: t(
            "menuManagement.menuItem.hyperlink.dynamic.product.title",
            "Product"
          ),
          placeholder: t(
            "menuManagement.menuItem.hyperlink.dynamic.product.placeholder",
            "Search product by name"
          ),
          validation: t(
            "menuManagement.menuItem.hyperlink.dynamic.product.validation",
            "Please select a product"
          ),
        },
        category: {
          title: t(
            "menuManagement.menuItem.hyperlink.dynamic.category.title",
            "Category"
          ),
          placeholder: t(
            "menuManagement.menuItem.hyperlink.dynamic.category.placeholder",
            "Select category"
          ),
          validation: t(
            "menuManagement.menuItem.hyperlink.dynamic.category.validation",
            "Please select category"
          ),
        },
        page: {
          title: t(
            "menuManagement.menuItem.hyperlink.dynamic.page.title",
            "Page"
          ),
          placeholder: t(
            "menuManagement.menuItem.hyperlink.dynamic.page.placeholder",
            "Select page"
          ),
          validation: t(
            "menuManagement.menuItem.hyperlink.dynamic.page.validation",
            "Please select a page"
          ),
        },
        subMenu: {
          title: t(
            "menuManagement.menuItem.hyperlink.dynamic.subMenu.title",
            "Sub-menu"
          ),
          placeholder: t(
            "menuManagement.menuItem.hyperlink.dynamic.subMenu.placeholder",
            "Select sub-menu"
          ),
          validation: t(
            "menuManagement.menuItem.hyperlink.dynamic.subMenu.validation",
            "Please select sub-menu"
          ),
        },
      },
    },
  };

  const onChangeHyperlink = (id) => {
    setHyperlink(id);
    let formValue = form.getFieldsValue();
    formValue.url = null;
    form.setFieldsValue(formValue);
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const showConfirm = () => {
    handleCancel();
  };

  const onSubmitForm = async () => {
    let subMenuData = null;
    const formValues = await form.validateFields();
    const { hyperlinkOption, url } = formValues;

    if (hyperlinkOption === Hyperlink.SUB_MENU) {
      subMenuData = subMenus?.find((x) => x.id === url);
    }

    let menuItem = {
      ...formValues,
      id: isEdit ? formValues?.id : randomGuid(),
      subMenu: subMenuData,
    };

    setMenuItemData(menuItem, isEdit);
  };

  const renderHyperlinkOption = () => {
    let formLabel = "";
    let placeholder = "";
    let validationMessage = "";
    let invalidUrl = "";
    let selectOptionData = null;

    switch (hyperlink) {
      case Hyperlink.URL:
        formLabel = pageData.hyperlink.dynamic.url.title;
        placeholder = pageData.hyperlink.dynamic.url.placeholder;
        validationMessage = pageData.hyperlink.dynamic.url.validation;
        invalidUrl = pageData.hyperlink.dynamic.url.invalidUrl;
        break;
      case Hyperlink.CATEGORY:
        formLabel = pageData.hyperlink.dynamic.category.title;
        placeholder = pageData.hyperlink.dynamic.category.placeholder;
        validationMessage = pageData.hyperlink.dynamic.category.validation;
        selectOptionData = productCategories;
        break;
      case Hyperlink.PRODUCT_DETAIL:
        formLabel = pageData.hyperlink.dynamic.product.title;
        placeholder = pageData.hyperlink.dynamic.product.placeholder;
        validationMessage = pageData.hyperlink.dynamic.product.validation;
        selectOptionData = products;
        break;
      case Hyperlink.BLOG_DETAIL:
        formLabel = pageData.hyperlink.dynamic.blog.title;
        placeholder = pageData.hyperlink.dynamic.blog.placeholder;
        validationMessage = pageData.hyperlink.dynamic.blog.validation;
        selectOptionData = blogs;
        break;
      case Hyperlink.MY_PAGES:
        formLabel = pageData.hyperlink.dynamic.page.title;
        placeholder = pageData.hyperlink.dynamic.page.placeholder;
        validationMessage = pageData.hyperlink.dynamic.page.validation;
        selectOptionData = pages;
        break;
      case Hyperlink.SUB_MENU:
        formLabel = pageData.hyperlink.dynamic.subMenu.title;
        placeholder = pageData.hyperlink.dynamic.subMenu.placeholder;
        validationMessage = pageData.hyperlink.dynamic.subMenu.validation;
        selectOptionData = subMenus;
        break;
      default:
        break;
    }

    const validateURL = (rule, value, callback) => {
      if (hyperlink === Hyperlink.URL) {
        if (value && !isValidURL(value)) {
          value > 0 ? callback(validationMessage) : callback(invalidUrl);
        } else {
          callback();
        }
      } else {
        callback();
      }
    };

    const isValidURL = (url) => {
      const regex = PatternConstants.ALLOW_URL_ONLY;
      return regex.test(url);
    };

    return (
      <>
        {DYNAMIC_HYPERLINK.includes(hyperlink) && (
          <>
            <h4 className="fnb-form-label mt-36">
              {formLabel}
              <span className="text-danger">*</span>
            </h4>
            <Form.Item
              name="url"
              rules={[
                {
                  required: true,
                  message: validationMessage,
                },
                {
                  validator: validateURL,
                },
              ]}
            >
              {hyperlink === Hyperlink.URL ? (
                <Input
                  className="fnb-input-with-count"
                  showCount
                  maxLength={2000}
                  placeholder={placeholder}
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
                />
              )}
            </Form.Item>
          </>
        )}
      </>
    );
  };

  const renderContent = () => {
    return (
      <Form
        form={form}
        name="basic"
        autoComplete="off"
        onFieldsChange={() => setFormDataChanged(true)}
      >
        {/* Name */}
        <h4 className="fnb-form-label">
          {pageData.menuItem.name}
          <span className="text-danger">*</span>
        </h4>
        <Form.Item
          name="menuItemName"
          rules={[
            {
              required: true,
              message: pageData.menuItem.nameValidation,
            },
          ]}
        >
          <Input
            className="fnb-input-with-count"
            showCount
            maxLength={100}
            placeholder={pageData.menuItem.namePlaceholder}
          />
        </Form.Item>

        {/* Hyperlink */}
        <h4 className="fnb-form-label mt-36">
          {pageData.hyperlink.title}
          <span className="text-danger">*</span>
        </h4>
        <Form.Item
          name="hyperlinkOption"
          rules={[
            {
              required: true,
              message: pageData.hyperlink.validation,
            },
          ]}
        >
          <FnbSelectHyperlink
            showSearch
            allowClear
            fixed
            placeholder={pageData.hyperlink.placeholder}
            onChange={onChangeHyperlink}
            option={hyperlinkSelectOptions}
          ></FnbSelectHyperlink>
        </Form.Item>

        {/* Hyperlink option */}
        <div>{renderHyperlinkOption()}</div>

        <Form.Item name="id" hidden="true"></Form.Item>
      </Form>
    );
  };

  return (
    <FnbModal
      className="add-menu-item-modal"
      width={"778px"}
      closeIcon
      title={
        isEdit ? pageData.menuItem.editMenuItem : pageData.menuItem.addMenuItem
      }
      visible={showAddNewMenuItemForm}
      handleCancel={showConfirm}
      cancelText={pageData.btnCancel}
      okText={isEdit ? pageData.btnUpdate : pageData.btnAdd}
      onOk={onSubmitForm}
      content={renderContent()}
    ></FnbModal>
  );
});
