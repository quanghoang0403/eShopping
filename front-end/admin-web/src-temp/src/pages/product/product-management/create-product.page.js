import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Image,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbDeleteIcon } from "components/fnb-delete-icon/fnb-delete-icon";
import { FnbModal } from "components/fnb-modal/fnb-modal-component";
import FnbSelectMaterialComponent from "components/fnb-select-material/fnb-select-material";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { FnbTable } from "components/fnb-table/fnb-table";
import { FnbTextArea } from "components/fnb-text-area/fnb-text-area.component";
import { FnbUploadImageComponent } from "components/fnb-upload-image/fnb-upload-image.component";
import PageTitle from "components/page-title";
import SelectEditComponent from "components/select-edit-new-item/select-edit-new-item";
import { DELAYED_TIME, inputNumberRange1To999999999, tableSettings } from "constants/default.constants";
import { DragIcon, IconBtnAdd, ImageMaterialDefault, TrashFill } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { Platform } from "constants/platform.constants";
import { currency } from "constants/string.constants";
import { TaxTypeStatus } from "constants/tax-type.constants";
import materialDataService from "data-services/material/material-data.service";
import optionDataService from "data-services/option/option-data.service";
import productCategoryDataService from "data-services/product-category/product-category-data.service";
import productDataService from "data-services/product/product-data.service";
import storeDataService from "data-services/store/store-data.service";
import taxDataService from "data-services/tax/tax-data.service";
import unitDataService from "data-services/unit/unit-data.service";
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import {
  formatCurrencyWithoutSuffix,
  formatNumberDecimalOrInteger,
  formatterDecimalNumber,
  getCurrency,
  getValidationMessagesWithParentField,
  isDecimalKey,
  parserDecimalNumber,
  randomGuid,
  roundNumber,
} from "utils/helpers";
import productDefaultImage from "../../../assets/images/combo-default-img.jpg";
import "../edit-product/edit-product.scss";

const { TextArea } = Input;
const { Text } = Typography;
const { TabPane } = Tabs;

export default function CreateProductPage() {
  const [t, i18n] = useTranslation();
  const history = useHistory();

  const arrPlatformIdSelected = [
    Platform.POS?.toLowerCase(),
    Platform.StoreWebsite?.toLowerCase(),
    Platform.StoreMobileApp?.toLowerCase(),
  ];

  const [blockNavigation, setBlockNavigation] = useState(false);
  const [image, setImage] = useState(null);
  const [prices, setPrices] = useState([{}]);
  const [initDataOptions, setInitDataOptions] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [initDataMaterials, setInitDataMaterials] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [listPlatforms, setListPlatforms] = useState([]);
  const [valuePlatforms, setValuePlatforms] = useState(arrPlatformIdSelected);
  const [dataSelectedMaterial, setDataSelectedMaterial] = useState([]);
  const [defaultValueNull, setDefaultValueNull] = useState(null);
  const [isUnitNameExisted, setIsUnitNameExisted] = useState(false);
  const [listAllProductCategory, setListAllProductCategory] = useState([]);
  const [listSellingTax, setListSellingTax] = useState([]);
  const [units, setUnits] = useState([]);
  const [nameUnit, setNameUnit] = useState("");
  const [isTopping, setTopping] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [disableCreateButton, setDisableCreateButton] = useState(false);
  const [numberRecordCurrent, setNumberRecordCurrent] = useState();
  const [showPaging, setShowPaging] = useState(false);
  const [pageNumber, setPageNumber] = useState(tableSettings.page);
  const [isChangeForm, setIsChangeForm] = useState(false);
  const [currencyCode, setCurrencyCode] = useState(false);
  const [newUnitName, setNewUnitName] = useState(null);
  const [showUnitNameValidateMessage, setShowUnitNameValidateMessage] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [allproductToppings, setAllProductToppings] = useState([]);
  const [productToppings, setProductToppings] = useState([]);
  const [productToppingSelected, setProductToppingSelected] = useState([]);
  const [isVisibaleProductToppingModal, setIsVisibaleProductToppingModal] = useState(false);
  const [activeKeyInventoryTracking, setActiveKeyInventoryTracking] = useState("0");
  const [defaultActiveKeyInventoryTracking, setDefaultActiveKeyInventoryTracking] = useState("0");

  const [showRecipeMessage, setShowRecipeMessage] = useState(false);
  const [isClickSubmitForm, setIsClickSubmitForm] = useState(false);
  const [unitName, setUnitName] = useState("");
  const [isMobileSize, setIsMobileSize] = useState(window.innerWidth < 500);
  const selectNewItemFuncs = React.useRef(null);

  useEffect(() => {
    getInitData();
    checkCurrencyVND();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const [form] = Form.useForm();
  const pageData = {
    title: t("productManagement.addProduct"),
    btnCancel: t("button.cancel"),
    btnSave: t("button.create"),
    btnAddNew: t("button.addNew"),
    generalInformation: {
      title: t("productManagement.generalInformation.title"),
      name: {
        label: t("productManagement.generalInformation.name"),
        placeholder: t("productManagement.generalInformation.namePlaceholder"),
        required: true,
        maxLength: 100,
        validateMessage: t("productManagement.generalInformation.nameValidateMessage"),
      },
      description: {
        label: t("productManagement.generalInformation.description"),
        placeholder: t("productManagement.generalInformation.descriptionPlaceholder"),
        required: false,
        maxLength: 255,
      },
      uploadImage: t("productManagement.generalInformation.addFile"),
    },
    pricing: {
      title: t("productManagement.pricing.price"),
      addPrice: t("productManagement.pricing.addPrice"),
      price: {
        label: t("productManagement.pricing.price"),
        placeholder: t("productManagement.pricing.pricePlaceholder"),
        required: true,
        max: 999999999,
        min: 0,
        format: "^[0-9]*$",
        validateMessage: t("productManagement.pricing.priceRange"),
      },
      priceName: {
        label: t("productManagement.pricing.priceName"),
        placeholder: t("productManagement.pricing.priceNamePlaceholder"),
        required: true,
        maxLength: 100,
        validateMessage: t("productManagement.pricing.priceNameValidateMessage"),
      },
    },
    unit: {
      title: t("productManagement.unit.title"),
      unitPlaceholder: t("productManagement.unit.unitPlaceholder"),
      pleaseSelectUnit: t("productManagement.unit.pleaseSelectUnit"),
      pleaseEnterNameUnit: t("productManagement.unit.pleaseEnterNameUnit"),
      unitNameExisted: t("productManagement.unit.unitNameExisted"),
      recipe: t("productManagement.unit.recipe"),
    },
    optionInformation: {
      title: t("option.title"),
      selectOption: t("option.selectOption"),
      pleaseSelectOption: t("option.pleaseSelectOption"),
    },
    inventoryTracking: {
      title: t("inventoryTracking.title"),
      byMaterial: t("inventoryTracking.byMaterial"),
      totalCost: t("table.totalCost"),
      pleaseEnterQuantity: t("inventoryTracking.pleaseEnterQuantity"),
      selectMaterial: t("inventoryTracking.selectMaterial"),
      pleaseSelectMaterial: t("inventoryTracking.pleaseSelectMaterial"),
      quantityMoreThanZero: t("inventoryTracking.quantityGreaterThanZero"),
      pleaseSetupRecipe: t("inventoryTracking.pleaseSetupRecipe"),
      table: {
        materialName: t("table.materialName"),
        quantity: t("table.quantity"),
        unit: t("table.unit"),
        cost: t("table.cost"),
        totalCost: t("table.totalCost"),
        action: t("table.action"),
      },
    },
    productCategory: {
      label: t("productManagement.category.title"),
      placeholder: t("productManagement.category.placeholder"),
    },
    productNameExisted: t("productManagement.productNameExisted"),
    fileSizeLimit: t("productManagement.fileSizeLimit"),
    productAddedSuccess: t("productManagement.productAddedSuccess"),
    topping: t("productManagement.isTopping"),
    tax: t("table.tax"),
    pleaseSelectTax: t("table.pleaseSelectTax"),
    media: {
      title: t("media.title"),
      textNonImage: t("media.textNonImage"),
    },
    platform: {
      title: t("platform.title"),
    },
    upload: {
      addFromUrl: t("upload.addFromUrl"),
    },
    discardBtn: t("button.discard"),
    confirmLeaveBtn: t("button.confirmLeave"),
    leaveDialog: {
      confirmation: t("leaveDialog.confirmation"),
      content: t("messages.leaveForm"),
    },
    btnAddNewUnit: t("productManagement.unit.btnAddNewUnit"),
    table: {
      name: t("productManagement.table.name"),
      action: t("productManagement.table.action"),
    },
    addTopping: t("productManagement.addTopping"),
    toppingSelected: t("productManagement.toppingSelected"),
    selectToppings: t("productManagement.selectToppings"),
    material: {
      minQuantity: 0.01,
      maxQuantity: 999999999,
    },
    bestDisplayImage: t("messages.imageBestDisplay"),
    validateMinQtyMessage: t("productManagement.pricing.priceRange"),
  };

  useEffect(() => {
    handleLanguageChange();
  }, [i18n.language]);

  // validate form again if clicked submit form and change language
  const handleLanguageChange = () => {
    if (isClickSubmitForm) {
      setShowRecipeMessage(true);
      form.validateFields();
    }
  };

  const getInitData = async () => {
    let resPlatform = await storeDataService.getAllPlatformActivatedAsync(true);
    if (resPlatform) {
      setListPlatforms(resPlatform?.platforms);
    }

    await getUnits();

    const resDataInitialCreateProduct = await productDataService.getInitialDataCreateProduct();
    if (resDataInitialCreateProduct) {
      const materials = resDataInitialCreateProduct?.materials;
      const allProductCategories = resDataInitialCreateProduct?.allProductCategories;
      const taxesByType = resDataInitialCreateProduct?.taxesByType;
      const options = resDataInitialCreateProduct?.options;
      const toppings = resDataInitialCreateProduct?.toppings;

      if (materials) {
        setMaterials(materials);
        setInitDataMaterials(materials);
      }

      if (allProductCategories) {
        setListAllProductCategory(allProductCategories);
      }

      if (taxesByType) {
        setListSellingTax(taxesByType);
      }

      if (options) {
        setOptions(options);
        setInitDataOptions(options);
      }

      if (toppings) {
        setAllProductToppings(toppings);
      }
    }
  };

  const getUnits = async () => {
    var resUnit = await unitDataService.getUnitsAsync();
    if (resUnit) {
      setUnits(resUnit.units);
    }
  };

  const scrollToElement = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "start",
      });
    }
  };

  const onSubmitForm = () => {
    setIsClickSubmitForm(true);
    setShowRecipeMessage(true);
    form
      .validateFields()
      .then(async (values) => {
        let optionIds = [];
        selectedOptions.map((o) => {
          optionIds.push(o.id);
        });
        const createProductRequestModel = {
          units: units,
          ...values.product,
          optionIds: optionIds,
          image: image?.url,
          isTopping: isTopping,
          platformIds: valuePlatforms,
          productToppingIds: productToppings?.map(function (item) {
            return item["id"];
          }),
        };

        if (
          createProductRequestModel.prices > 0 ||
          (createProductRequestModel.materials && createProductRequestModel.materials.priceName.length > 0)
        ) {
          if (createProductRequestModel.prices) {
            createProductRequestModel.prices.map((item, index) => {
              item.materials = createProductRequestModel.materials.priceName[index].material;
            });
            createProductRequestModel.materials = null;
          } else {
            createProductRequestModel.materials = createProductRequestModel.materials.priceName[0].material;
          }

          productDataService
            .createProductAsync(createProductRequestModel)
            .then((res) => {
              if (res) {
                message.success(pageData.productAddedSuccess);
                setIsChangeForm(false);
                history.push("/product-management");
              }
            })
            .catch((errs) => {
              form.setFields(getValidationMessagesWithParentField(errs, "product"));
            });
        } else {
          scrollToElement("receipe-message");
        }
      })
      .catch((errors) => {
        if (errors?.errorFields?.length > 0) {
          const elementId = `basic_${errors?.errorFields[0]?.name.join("_")}_help`;

          scrollToElement(elementId);

          let tabPanelMaterialErr = [];
          let otherErr = [];
          errors?.errorFields?.map((errorItem) => {
            let checkMaterialQuantityErr = errorItem?.name?.find((x) => x === "material");
            if (checkMaterialQuantityErr) {
              tabPanelMaterialErr.push(errorItem);
            } else {
              otherErr.push(errorItem);
            }
          });
          if (tabPanelMaterialErr.length > 0 && otherErr.length === 0) {
            message.error(tabPanelMaterialErr[0].errors[0]);
            setActiveKeyInventoryTracking(tabPanelMaterialErr[0].name[3].toString());
            let nameInputFirst = tabPanelMaterialErr[0].name.join("-");
            scrollToElement(nameInputFirst);
          }
        }
      });
  };

  const onSelectOption = (key) => {
    setIsChangeForm(true);
    let selectedOption = options.find((o) => o.id === key);
    let restOptions = options.filter((o) => o.id !== key);
    setOptions(restOptions);
    setDefaultValueNull(null);
    selectedOptions.push(selectedOption);
  };

  const onDeleteSelectedOption = (key) => {
    let restOptions = selectedOptions.filter((o) => o.id !== key);
    setSelectedOptions(restOptions);

    let initDataOption = initDataOptions.find((o) => o.id === key);
    options.push(initDataOption);
  };

  const onChangeImage = (file) => {
    setImage(file);
  };

  const onClickAddPrice = () => {
    let formValue = form.getFieldsValue();
    let { product } = formValue;

    const newPrice = {
      position: prices.length || 0,
      id: randomGuid(),
      isPriceBelongsCombo: false,
      name: "",
      price: "",
    };
    if (prices.length === 1) {
      const price = {
        position: 0,
        id: randomGuid(),
        isPriceBelongsCombo: false,
        name: "",
        price: product.price || "",
      };
      prices[0] = price;
    }
    const listPrice = [...(product.prices ?? prices), newPrice];
    product.prices = listPrice;
    setPrices(listPrice);
    form.setFieldsValue(formValue);
    setTimeout(() => {
      const dragDropPrices = document.getElementById("dragDropPrices");
      dragDropPrices.scrollTop = dragDropPrices.scrollHeight;
    }, 100);
  };

  const onDeletePrice = (index) => {
    let formValue = form.getFieldsValue();
    let { product } = formValue;
    if (product.prices.length > 0) {
      product.prices.splice(index, 1);
      product?.materials?.priceName?.splice(index, 1);
      product.prices.forEach((item, index) => (item.position = index));
    }
    setPrices(product.prices);
    if (product.prices.length === 1) {
      product.price = product.prices[0].price;
      product.prices[0].position = 0;
    }
    setActiveKeyInventoryTracking("0");
    form.setFieldsValue(formValue);
  };

  //Enter Unit name and check existed
  const onNameChange = (value) => {
    if (units.filter((u) => u.name.trim() === value.trim()).length > 0) {
      setIsUnitNameExisted(true);
    } else {
      setIsUnitNameExisted(false);
    }
    setNameUnit(value);
    setShowUnitNameValidateMessage(false);
    setNewUnitName(value);
  };

  const onChangeOption = (id) => {
    let formValue = form.getFieldsValue();
    let { product } = formValue;
    product.unitId = id;
    setUnitName(units?.find((u) => u.id === id)?.name);
    form.setFieldsValue(formValue);
    if (selectNewItemFuncs.current) {
      selectNewItemFuncs.current(id);
    }
  };

  const onChangePlatform = (values) => {
    setValuePlatforms(values);
  };

  //Handle add New Unit
  const addNewUnit = async (e) => {
    if (nameUnit) {
      e.preventDefault();
      let req = {
        name: nameUnit,
      };
      let res = await unitDataService.createUnitAsync(req);
      if (res.isSuccess) {
        let newItem = {
          id: res.id,
          name: res.name,
        };
        setUnits([newItem, ...units]);
        let formValue = form.getFieldsValue();
        let { product } = formValue;
        product.unitId = res.id;
        setUnitName(res.name);
        form.setFieldsValue(formValue);
        if (selectNewItemFuncs.current) {
          selectNewItemFuncs.current(res.id);
          setIsUnitNameExisted(true);
        }
      } else {
        message.error(pageData.unit.unitNameExisted);
      }
    }
  };

  //Handle check Topping
  function onTopicChange(e) {
    setTopping(e.target.checked);
    if (e.target.checked) {
      setPrices([{}]);
    }
  }

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    result.forEach((item, index) => (item.position = index));
    return result;
  };

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    let formValue = form.getFieldsValue();
    let { product } = formValue;
    const listPrice = reorder(product.prices, result.source.index, result.destination.index);

    setPrices(listPrice);
    product.prices = listPrice;
    form.setFieldsValue(formValue);
  };

  const renderPrices = () => {
    const addPriceButton = (
      <Button
        type="primary"
        icon={<IconBtnAdd className="icon-btn-add-topping" />}
        className="btn-add-topping"
        onClick={onClickAddPrice}
      >
        {pageData.pricing.addPrice}
      </Button>
    );

    const singlePrice = (
      <>
        <Row>
          <Col span={24}>
            <h4 className="fnb-form-label">{pageData.pricing.price.label}</h4>
            <Form.Item
              name={["product", "price"]}
              rules={[
                {
                  required: true,
                  message: pageData.pricing.price.validateMessage,
                },
                {
                  pattern: new RegExp(inputNumberRange1To999999999.range),
                  message: pageData.pricing.price.validateMessage,
                },
              ]}
            >
              <InputNumber
                className="w-100 fnb-input-number"
                placeholder={pageData.pricing.price.placeholder}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                addonAfter={currencyCode}
                precision={currencyCode === currency.vnd ? 0 : 2}
                id="product-price"
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <div className="mt-2" hidden={isTopping}>
              {addPriceButton}
            </div>
          </Col>
        </Row>
      </>
    );

    const multiplePrices = (
      <>
        <DragDropContext className="mt-4" onDragEnd={(result) => onDragEnd(result)}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="list-price">
                <div
                  id="dragDropPrices"
                  style={prices.length >= 6 ? { height: 640, overflowY: "scroll" } : { minHeight: prices.length * 127 }}
                >
                  <div style={{ minHeight: prices.length * 127 }}>
                    {prices.map((price, index) => {
                      const position = (price.position || 0) + 1;
                      return (
                        <Draggable key={price.id} draggableId={price.id} index={index}>
                          {(provided) => (
                            <Row
                              className={`mb-4 pointer price-item`}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Col span={24} className="col-title">
                                <DragIcon className="title-center drag-icon" width={38} height={38} />
                                <div className="m-4 title-center position-text">{position + "."}</div>
                                <Row className="mt-14 w-100">
                                  <Col span={isMobileSize ? 19 : 22}>
                                    <Row gutter={[16, 16]}>
                                      <Col xs={24} sm={24} md={24} lg={12}>
                                        <Form.Item
                                          name={["product", "prices", price.position, "position"]}
                                          hidden={true}
                                        >
                                          <Input />
                                        </Form.Item>
                                        <Form.Item name={["product", "prices", price.position, "id"]} hidden={true}>
                                          <Input />
                                        </Form.Item>
                                        <Form.Item
                                          name={["product", "prices", price.position, "isPriceBelongsCombo"]}
                                          hidden={true}
                                        >
                                          <Input />
                                        </Form.Item>
                                        <Form.Item
                                          name={["product", "prices", price.position, "name"]}
                                          rules={[
                                            {
                                              required: true,
                                              message: pageData.pricing.priceName.validateMessage,
                                            },
                                          ]}
                                        >
                                          <Input
                                            className="fnb-input"
                                            onInput={(evt) => onInputPriceName(price.position, evt)}
                                            placeholder={pageData.pricing.priceName.placeholder}
                                            maxLength={pageData.pricing.priceName.maxLength}
                                            disabled={price?.isPriceBelongsCombo}
                                            id={`product-prices-${price.position}-name`}
                                          />
                                        </Form.Item>
                                      </Col>
                                      <Col xs={24} sm={24} md={24} lg={12}>
                                        <Form.Item
                                          name={["product", "prices", price.position, "price"]}
                                          rules={[
                                            {
                                              required: true,
                                              message: pageData.pricing.price.validateMessage,
                                            },
                                            {
                                              pattern: new RegExp(inputNumberRange1To999999999.range),
                                              message: pageData.pricing.price.validateMessage,
                                            },
                                          ]}
                                        >
                                          <InputNumber
                                            className="fnb-input-number w-100"
                                            placeholder={pageData.pricing.price.placeholder}
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                                            addonAfter={currencyCode}
                                            precision={currencyCode === currency.vnd ? 0 : 2}
                                            onKeyPress={(event) => {
                                              if (!/[0-9]/.test(event.key)) {
                                                event.preventDefault();
                                              }
                                            }}
                                            disabled={price?.isPriceBelongsCombo}
                                            id={`product-prices-${price.position}-price`}
                                          />
                                        </Form.Item>
                                      </Col>
                                    </Row>
                                  </Col>
                                  <Col span={isMobileSize ? 5 : 2} className="icon-delete-price">
                                    <a
                                      className="m-2"
                                      hidden={price?.isPriceBelongsCombo}
                                      onClick={() => onDeletePrice(price.position)}
                                    >
                                      <FnbDeleteIcon />
                                    </a>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          )}
                        </Draggable>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <Col span={24}>
          <div className="mt-2" hidden={isTopping}>
            {addPriceButton}
          </div>
        </Col>
      </>
    );

    return (
      <>
        {prices.length === 1 && singlePrice}
        {prices.length > 1 && multiplePrices}

        <Row className="w-100 mt-3" gutter={[16, 0]}>
          <Col xs={24} sm={24} md={24} lg={12}>
            <h4 className="fnb-form-label">{pageData.tax}</h4>
            <Form.Item name={["product", "taxId"]}>
              <FnbSelectSingle
                placeholder={pageData.pleaseSelectTax}
                showSearch
                allowClear
                option={listSellingTax?.map((b) => ({
                  id: b.id,
                  name: b?.formatName,
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12}>
            <h4 className="fnb-form-label">{pageData.unit.title}</h4>
            <Form.Item
              name={["product", "unitId"]}
              rules={[
                {
                  required: true,
                  message: pageData.unit.pleaseSelectUnit,
                },
              ]}
            >
              <SelectEditComponent
                getPopupContainer={(trigger) => trigger.parentNode}
                showSearch
                allowClear
                functions={selectNewItemFuncs}
                placeholder={pageData.unit.unitPlaceholder}
                pleaseEnterName={pageData.unit.pleaseEnterNameUnit}
                nameExisted={pageData.unit.unitNameExisted}
                btnAddNew={pageData.btnAddNew}
                listOption={units}
                onChangeOption={onChangeOption}
                onSearch={onNameChange}
                addNewItem={addNewUnit}
                isNameExisted={isUnitNameExisted}
                name={nameUnit}
                isEditProduct={true}
              />
            </Form.Item>
            <Input name="product-unitId" style={{ display: "none" }} />
          </Col>
        </Row>
      </>
    );
  };

  //form item option
  const renderOptions = () => {
    return (
      <>
        <Row>
          <Col span={24}>
            <FnbSelectSingle
              placeholder={pageData.optionInformation.selectOption}
              showSearch
              option={options?.map((b) => ({
                id: b.id,
                name: b.name,
              }))}
              optionFilterProp="children"
              value={defaultValueNull}
              onChange={(value) => onSelectOption(value)}
            />
          </Col>
        </Row>
        <Row className="mt-3" gutter={[0, 16]}>
          {selectedOptions.map((option, index) => {
            option?.optionLevel.sort((elementA, elementB) => elementB.isSetDefault - elementA.isSetDefault);
            return (
              <>
                <Col span={20}>
                  <Paragraph
                    className="option-name"
                    placement="top"
                    ellipsis={{ tooltip: option.name }}
                    color="#50429B"
                    key={option.id}
                  >
                    <Text strong className="option-name-text">
                      {option.name}
                    </Text>
                  </Paragraph>
                </Col>
                <Col span={4}>
                  <a className="mr-3 float-right">
                    <a onClick={() => onDeleteSelectedOption(option.id)} className="icon-delete-option">
                      <FnbDeleteIcon />
                    </a>
                  </a>
                </Col>
                <Col span={24}>
                  <Row>
                    <Col span={24}>
                      <div id={"container-options-" + index} className="w-100 container-options">
                        {option.optionLevel.map((item) => {
                          return (
                            <>
                              <Tag
                                key={item.id}
                                className={
                                  item.isSetDefault === true
                                    ? `option-default option--border`
                                    : `option-value option--border`
                                }
                              >
                                <Paragraph id={item.id} ellipsis={{ tooltip: item.name }}>
                                  <span>{item.name}</span>
                                </Paragraph>
                              </Tag>
                            </>
                          );
                        })}
                      </div>
                    </Col>
                  </Row>
                </Col>
              </>
            );
          })}
        </Row>
      </>
    );
  };

  //form item Inventory Trackings
  const renderInventoryTrackings = () => {
    return (
      <>
        <Row>
          <h4 className="fnb-form-label">{pageData.inventoryTracking.byMaterial}</h4>
          <Col span={24}>
            <FnbSelectMaterialComponent
              status={showRecipeMessage && dataSelectedMaterial.length <= 0 ? "error" : ""}
              materialList={materials}
              onChangeEvent={onSelectMaterial}
              t={t}
            />
          </Col>
        </Row>
      </>
    );
  };

  const onSelectMaterial = (key, pageNumber, pageSize) => {
    setIsChangeForm(true);
    setPageNumber(pageNumber);
    const restMaterials = materials.filter((o) => o.id !== key);
    setMaterials(restMaterials);
    const selectedMaterials = initDataMaterials.find((o) => o.id === key);
    const newRow = {
      key: selectedMaterials.id,
      material: selectedMaterials.name,
      quantity: null,
      unit: selectedMaterials.unitName,
      unitCost: selectedMaterials.costPerUnit,
      cost: 0,
    };
    setDataSelectedMaterial([...dataSelectedMaterial, newRow]);

    let numberRecordCurrent = pageNumber * pageSize;
    if (numberRecordCurrent > dataSelectedMaterial.length) {
      numberRecordCurrent = dataSelectedMaterial.length + 1;
    }
    setNumberRecordCurrent(numberRecordCurrent);

    if (dataSelectedMaterial.length <= 20) {
      setShowPaging(false);
    } else {
      setShowPaging(true);
    }
  };

  const getFormSelectedMaterials = () => {
    let formValue = form.getFieldsValue();
    let { product } = formValue;
    let productPrices = product?.prices ?? prices;
    return (
      <>
        {prices?.length > 1 && dataSelectedMaterial.length > 0 && (
          <Row>
            <Tabs
              onChange={(index) => getTotalCost(index, true)}
              className="w-100"
              id="tab-inventory"
              defaultActiveKey={defaultActiveKeyInventoryTracking}
              activeKey={activeKeyInventoryTracking}
            >
              {productPrices?.map((p, index) => {
                return (
                  <TabPane tab={p?.name} key={index} forceRender={true}>
                    <Row>
                      <Col span={24}>
                        <FnbTable
                          columns={columnsMaterial(index)}
                          dataSource={dataSelectedMaterial}
                          pageSize={tableSettings.pageSize}
                          pageNumber={pageNumber}
                          total={dataSelectedMaterial.length}
                          numberRecordCurrent={numberRecordCurrent}
                          showPaging={!showPaging}
                          scrollY={96 * 5}
                          className="table-product-receipt"
                        />
                      </Col>
                    </Row>
                  </TabPane>
                );
              })}
            </Tabs>
          </Row>
        )}
        {prices?.length === 1 && dataSelectedMaterial.length > 0 && (
          <>
            <br />
            <Row className="w-100">
              <Col span={24}>
                <FnbTable
                  dataSource={dataSelectedMaterial}
                  columns={columnsMaterial(0)}
                  pageSize={tableSettings.pageSize}
                  pageNumber={pageNumber}
                  total={dataSelectedMaterial.length}
                  numberRecordCurrent={numberRecordCurrent}
                  showPaging={!showPaging}
                  scrollY={96 * 5}
                  className="table-product-receipt"
                />
              </Col>
            </Row>
          </>
        )}
        {prices?.length > 0 && dataSelectedMaterial.length > 0 && (
          <>
            <br />
            <Row className="float-right">
              <Text strong>{pageData.inventoryTracking.totalCost}: </Text>
              <Text col className="ml-3 mr-1" type="danger" strong>
                {totalCost ? formatCurrencyWithoutSuffix(roundNumber(totalCost, 2)) : 0}
              </Text>
              <Text>/ {unitName}</Text>
            </Row>
          </>
        )}
      </>
    );
  };

  const getTotalCost = (index, isChangeTab = false) => {
    let formValue = form.getFieldsValue();
    let { product } = formValue;
    const totalCost = product?.materials?.priceName[index].material?.reduce(
      (n, { quantity, unitCost }) => n + (quantity ?? 0) * (unitCost ?? 0),
      0,
    );
    if (isChangeTab) {
      form.validateFields();
      setActiveKeyInventoryTracking(index);
    }
    setTotalCost(totalCost);
  };

  const columnsMaterial = (indexPriceName) => {
    let columns = [
      {
        title: pageData.inventoryTracking.table.materialName,
        dataIndex: "material",
        align: "center",
        width: "20%",
        render: (_, record, index) => (
          <Form.Item
            name={["product", "materials", "priceName", indexPriceName, "material", index, "materialId"]}
            className="form-item-material"
          >
            <p>{record.material}</p>
          </Form.Item>
        ),
      },
      {
        title: pageData.inventoryTracking.table.quantity,
        dataIndex: "quantity",
        width: "20%",
        align: "center",
        editable: true,
        className: "inventory-tracking-material-item",
        render: (_, record, index) => (
          <Form.Item
            name={["product", "materials", "priceName", indexPriceName, "material", index, "quantity"]}
            rules={[
              {
                required: true,
                message: pageData.inventoryTracking.pleaseEnterQuantity,
              },
              () => ({
                validator(_, value) {
                  if (value > pageData.material.maxQuantity || value < pageData.material.minQuantity) {
                    return Promise.reject(pageData.validateMinQtyMessage);
                  }
                  return Promise.resolve();
                },
              }),
            ]}
            className="form-item-quantity"
          >
            <InputNumber
              className="fnb-input input-quantity"
              onChange={(value) => onChangeQuantity(record, indexPriceName, index)}
              defaultValue={record?.quantity}
              formatter={(value) => formatterDecimalNumber(value)}
              parser={(value) => parserDecimalNumber(value)}
              onKeyPress={(event) => {
                if (!isDecimalKey(event)) {
                  event.preventDefault();
                }
              }}
            />
          </Form.Item>
        ),
      },
      {
        title: pageData.inventoryTracking.table.unit,
        dataIndex: "unit",
        width: "20%",
        align: "center",
        render: (_, record, index) => <p>{record?.unit}</p>,
      },
      {
        title: `${pageData.inventoryTracking.table.cost} (${getCurrency()})`,
        dataIndex: "unitCost",
        align: "center",
        width: "20%",
        align: "center",
        render: (_, record, index) => (
          <Form.Item
            name={["product", "materials", "priceName", indexPriceName, "material", index, "unitCost"]}
            className="form-item-unit-cost"
          >
            <p>{formatNumberDecimalOrInteger(record?.unitCost)}</p>
          </Form.Item>
        ),
      },
      {
        title: `${pageData.inventoryTracking.table.totalCost} (${getCurrency()})`,
        dataIndex: "cost",
        align: "center",
        width: "15%",
        render: (_, record, index) => {
          let formValue = form.getFieldsValue();
          let { product } = formValue;
          const item = product.materials?.priceName[indexPriceName]?.material[index];
          return item && item?.quantity > 0 && item?.unitCost > 0 ? (
            <p>{formatNumberDecimalOrInteger(item?.quantity * item?.unitCost)}</p>
          ) : (
            <p>{formatNumberDecimalOrInteger(record?.quantity * record?.unitCost)}</p>
          );
        },
      },
      {
        title: pageData.inventoryTracking.table.action,
        dataIndex: "action",
        align: "center",
        width: "15%",
        render: (_, record, index) => (
          <a
            onClick={() => {
              onRemoveItemMaterial(index, record.key);
              getTotalCost(indexPriceName);
            }}
          >
            <FnbDeleteIcon />
          </a>
        ),
      },
    ];
    return columns;
  };

  //Hanlde change quantity and get total cost
  const onChangeQuantity = (record, indexPriceName, index) => {
    let formValue = form.getFieldsValue();
    let { product } = formValue;
    product.materials.priceName[indexPriceName].material[index].materialId = record.key;
    product.materials.priceName[indexPriceName].material[index].unitCost = record.unitCost;
    form.setFieldsValue(formValue);
    getTotalCost(indexPriceName);
  };

  const onRemoveItemMaterial = (index, key) => {
    let restMaterials = dataSelectedMaterial.filter((o) => o.key !== key);
    setDataSelectedMaterial(restMaterials);

    let initDataMaterial = initDataMaterials.find((o) => o.id === key);
    materials.push(initDataMaterial);
    let formValue = form.getFieldsValue();
    let { product } = formValue;

    product.materials.priceName?.map((item) => {
      item.material.splice(index, 1);
      return item;
    });

    form.setFieldsValue(formValue);
  };

  const changeForm = (e) => {
    setIsChangeForm(true);
    setDisableCreateButton(false);
  };

  const formCreateProductSubmitCapture = () => {
    let tabControl = document.getElementById("tab-inventory");
    if (tabControl) {
      let tabItem = tabControl.querySelectorAll(".ant-tabs-tab");
      tabItem?.forEach((itemControl, index) => {
        let breakException = {};
        let tabInventoryContent = document.getElementById(`tab-inventory-panel-${index}`);
        if (tabInventoryContent) {
          let errorControl = tabInventoryContent.querySelectorAll(".ant-form-item-explain-error");
          if (errorControl.length > 0) {
            let activeTab = document.getElementById(`tab-inventory-tab-${index}`);
            activeTab.click();
            onSubmitForm();
            throw breakException;
          }
        }
      });
    }
  };

  const checkCurrencyVND = async () => {
    let currencyCode = await storeDataService.getCurrencyByStoreId();
    setCurrencyCode(currencyCode);
  };

  const onAddNewUnit = async () => {
    if (!newUnitName) {
      setShowUnitNameValidateMessage(true);
      return;
    }

    let res = await unitDataService.createUnitAsync({ name: newUnitName });
    if (res.isSuccess) {
      /// Handle add new unit
      getUnits();

      /// Set unit selected is new unit
      form.setFieldsValue({
        product: {
          unitId: res.id,
        },
      });

      setNewUnitName(null);
    } else {
      setIsUnitNameExisted(true);
    }
  };

  const onSelectProductTopping = (id) => {
    const selectedTopping = allproductToppings.find((item) => item?.id === id);
    setProductToppingSelected([...productToppingSelected, selectedTopping]);
    setAllProductToppings(allproductToppings.filter((item) => item?.id !== id));
  };

  const onRemoveProductTopping = (id) => {
    const removedTopping = productToppingSelected.find((item) => item?.id === id);
    setProductToppingSelected(productToppingSelected.filter((item) => item?.id !== id));
    setAllProductToppings([...allproductToppings, removedTopping]);
  };

  const productToppingSelectedColumnTable = () => {
    const column = [
      {
        title: pageData.table.name,
        dataIndex: "thumbnail",
        render: (_, record) => {
          return <Image preview={false} src={record.thumbnail ?? "error"} fallback={productDefaultImage} />;
        },
      },
      {
        title: " ",
        width: "80%",
        dataIndex: "name",
        align: "left",
      },
      {
        title: pageData.table.action,
        key: "action",
        width: "20%",
        align: "center",
        render: (_, record) => {
          return (
            <>
              <a onClick={() => onRemoveProductTopping(record?.id)}>
                <div className="fnb-table-action-icon">
                  <Tooltip placement="top" title={t("button.delete")} color="#50429B">
                    <TrashFill className="icon-svg-hover" />
                  </Tooltip>
                </div>
              </a>
            </>
          );
        },
      },
    ];

    return column;
  };

  const renderModalContent = () => {
    return (
      <Form>
        <div className="modal-product-topping">
          <Row className="modal-product-topping-search" style={{ display: "contents" }}>
            <Col span={24}>
              <Select
                value={null}
                placeholder={pageData.selectToppings}
                showSearch
                className="fnb-select-multiple-product"
                popupClassName="fnb-select-multiple-product-dropdown"
                suffixIcon=""
                onChange={(key) => onSelectProductTopping(key)}
                listHeight={480}
                filterOption={(input, option) => {
                  const inputStr = input.removeVietnamese().trim().toLowerCase();
                  return option?.label?.trim().toLowerCase().removeVietnamese().indexOf(inputStr) >= 0;
                }}
              >
                {allproductToppings?.map((item) => (
                  <Select.Option key={item?.id} value={item?.id} label={item?.name}>
                    <div className="product-option-box">
                      <div className="img-box">
                        {item?.thumbnail ? <Image preview={false} src={item?.thumbnail} /> : <ImageMaterialDefault />}
                      </div>
                      <Text ellipsis={true} className="product-name">
                        {item?.name}
                      </Text>
                    </div>
                  </Select.Option>
                ))}
              </Select>
            </Col>
          </Row>
          <Row className="modal-product-topping-table">
            <Col span={24}>
              <FnbTable
                className="selected-product-topping-modal"
                dataSource={productToppingSelected}
                columns={productToppingSelectedColumnTable()}
              />
            </Col>
          </Row>
        </div>
      </Form>
    );
  };

  const handleCancel = () => {
    setIsVisibaleProductToppingModal(false);
    let toppings = allproductToppings.concat(productToppingSelected);
    setAllProductToppings(toppings?.filter((item) => !productToppings?.find((x) => x.id === item.id)));
    setProductToppingSelected([]);
  };

  const handleOK = () => {
    setIsVisibaleProductToppingModal(false);
    setProductToppings(productToppingSelected);
    setProductToppingSelected([]);

    if (!blockNavigation) setBlockNavigation(true);
  };

  const openModal = () => {
    setProductToppingSelected(productToppings);
    setIsVisibaleProductToppingModal(true);
  };

  const onCancel = () => {
    if (isChangeForm) {
      setShowConfirm(true);
    } else {
      setShowConfirm(false);
      onCompleted();
      return history.push("/product-management");
    }
  };

  const onDiscard = () => {
    setShowConfirm(false);
  };

  const onCompleted = () => {
    setIsChangeForm(false);
    setTimeout(() => {
      return history.push("/product-management");
    }, DELAYED_TIME);
  };

  const onInputPriceName = (index, evt) => {
    let valueInput = evt?.target?.value;
    if (valueInput.length > 0) {
      setActiveKeyInventoryTracking(index.toString());
    } else {
      setActiveKeyInventoryTracking("0");
    }
    setDefaultActiveKeyInventoryTracking(valueInput);
  };

  const updateDimensions = () => {
    setIsMobileSize(window.innerWidth < 500);
  };

  return (
    <>
      <Row className="fnb-row-page-header">
        <Col xs={24} sm={24} lg={12}>
          <p className="card-header">
            <PageTitle content={pageData.title} />
          </p>
        </Col>
        <Col span={12} xs={24} sm={24} md={24} lg={12} className="fnb-form-item-btn">
          <ActionButtonGroup
            arrayButton={[
              {
                action: (
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={disableCreateButton}
                    icon={<IconBtnAdd className="icon-btn-add-product" />}
                    className="btn-add-product"
                    onClick={onSubmitForm}
                  >
                    {pageData.btnSave}
                  </Button>
                ),
                permission: PermissionKeys.CREATE_PRODUCT,
              },
              {
                action: (
                  <a onClick={() => onCancel()} className="action-cancel">
                    {pageData.btnCancel}
                  </a>
                ),
                permission: null,
              },
            ]}
          />
        </Col>
      </Row>
      <Form
        form={form}
        name="basic"
        onFieldsChange={(e) => changeForm(e)}
        autoComplete="off"
        onChange={() => {
          if (!blockNavigation) setBlockNavigation(true);
        }}
        onSubmitCapture={() => formCreateProductSubmitCapture()}
      >
        <div className="col-input-full-width">
          <Row className="grid-container-create-product">
            <Col className="left-create-product" xs={24} sm={24} md={24} lg={24}>
              <Card className="w-100 fnb-card h-auto">
                <Row>
                  <Col span={24}>
                    <h4 className="title-group">{pageData.generalInformation.title}</h4>

                    <h4 className="fnb-form-label">
                      {pageData.generalInformation.name.label}
                      <span className="text-danger">*</span>
                    </h4>
                    <Form.Item
                      name={["product", "name"]}
                      rules={[
                        {
                          required: pageData.generalInformation.name.required,
                          message: pageData.generalInformation.name.validateMessage,
                        },
                      ]}
                      validateFirst={true}
                    >
                      <Input
                        showCount
                        className="fnb-input-with-count"
                        placeholder={pageData.generalInformation.name.placeholder}
                        maxLength={pageData.generalInformation.name.maxLength}
                        id="product-name"
                      />
                    </Form.Item>

                    <h4 className="fnb-form-label">{pageData.generalInformation.description.label}</h4>
                    <Form.Item name={["product", "description"]} rules={[]}>
                      <FnbTextArea
                        showCount
                        maxLength={pageData.generalInformation.description.maxLength}
                        autoSize={{ minRows: 2, maxRows: 6 }}
                        id="product-description"
                      ></FnbTextArea>
                    </Form.Item>

                    <Form.Item name={["product", "topping"]}>
                      <Checkbox onChange={onTopicChange}>{pageData.topping}</Checkbox>
                    </Form.Item>

                    <Form.Item className={`${isTopping === true ? "d-none" : ""}`}>
                      <Row>
                        <Col span={24}>
                          <Row>
                            <Col>
                              <Button
                                type="primary"
                                disabled={disableCreateButton}
                                icon={<IconBtnAdd className="icon-btn-add-topping" />}
                                className="btn-add-topping"
                                onClick={() => openModal()}
                              >
                                {pageData.addTopping}
                              </Button>
                            </Col>
                            {productToppings.length > 0 && (
                              <Col className="topping-text pl-16">
                                <Row onClick={() => openModal()}>
                                  <span className="topping-selected-count">{productToppings.length}</span>
                                  <span className="topping-selected-text">{pageData.toppingSelected}</span>
                                </Row>
                              </Col>
                            )}
                          </Row>
                        </Col>
                      </Row>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
              <br />
            </Col>

            <Col className="price-product" xs={24} sm={24} md={24} lg={24}>
              <Card className="w-100 mt-1 fnb-card h-auto">
                <Row>
                  <Col span={24}>
                    <h4 className="title-group">{pageData.pricing.title}</h4>
                    {renderPrices()}
                  </Col>
                </Row>
              </Card>
              <br />
              <Card className="w-100 mt-1 fnb-card fnb-card-recipe h-auto">
                <Row>
                  <Col span={24}>
                    <h4 className="title-group">{pageData.unit.recipe}</h4>
                    {renderInventoryTrackings()}
                  </Col>
                  <Col span={24}>
                    {getFormSelectedMaterials()}
                    {showRecipeMessage && dataSelectedMaterial.length <= 0 && (
                      <Text className="message-validate-recipe" type="danger" id="receipe-message">
                        {pageData.inventoryTracking.pleaseSetupRecipe}
                      </Text>
                    )}
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col className="right-create-product" xs={24} sm={24} md={24} lg={24}>
              <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Card className="w-100 fnb-card h-auto">
                    <h4 className="title-group">{pageData.media.title}</h4>
                    <Row className={`non-image ${image !== null ? "have-image" : ""}`}>
                      <Col span={24} className={`image-product ${image !== null ? "justify-left" : ""}`}>
                        <div style={{ display: "flex" }}>
                          <Form.Item name={["product", "media"]}>
                            <FnbUploadImageComponent
                              buttonText={pageData.generalInformation.uploadImage}
                              onChange={onChangeImage}
                            />
                          </Form.Item>
                          <a className="upload-image-url" hidden={image !== null ? true : false}>
                            {pageData.upload.addFromUrl}
                          </a>
                        </div>
                      </Col>
                      <Col
                        span={24}
                        className="create-edit-product-text-non-image"
                        hidden={image !== null ? true : false}
                      >
                        <Text disabled>
                          {pageData.media.textNonImage}
                          <br />
                          {pageData.bestDisplayImage}
                        </Text>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <br hidden={isTopping} />
                  <Card className={`w-100 mt-1 fnb-card h-auto ${isTopping === true ? "hidden" : ""}`}>
                    <h4 className="title-group">{pageData.productCategory.label}</h4>
                    <Form.Item name={["product", "productCategoryId"]}>
                      <FnbSelectSingle
                        placeholder={pageData.productCategory.placeholder}
                        showSearch
                        option={listAllProductCategory?.map((b) => ({
                          id: b.id,
                          name: b.name,
                        }))}
                      />
                    </Form.Item>
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <br hidden={isTopping} />
                  <Card className={`w-100 mt-1 fnb-card h-auto ${isTopping === true ? "hidden" : ""}`}>
                    <h4 className="title-group">{pageData.optionInformation.title}</h4>
                    {renderOptions()}
                  </Card>
                </Col>
              </Row>

              <Row hidden={listPlatforms.length > 0 ? "" : "hidden"}>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <br />
                  <Card className="w-100 mt-1 fnb-card platform-card">
                    <h4 className="title-platform">{pageData.platform.title}</h4>
                    <Form.Item name={["name", "platform"]}>
                      <div className="platform-group">
                        <Checkbox.Group defaultValue={valuePlatforms} onChange={onChangePlatform}>
                          {listPlatforms?.map((p, index) => {
                            return (
                              <div className={index === 0 ? "mt-1" : "mt-10"}>
                                <Checkbox defaultChecked={true} value={p.id}>
                                  {p.name}
                                </Checkbox>
                              </div>
                            );
                          })}
                        </Checkbox.Group>
                      </div>
                    </Form.Item>
                  </Card>
                  <br />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </Form>
      <FnbModal
        width={"800px"}
        title={pageData.addTopping}
        handleCancel={handleCancel}
        onOk={handleOK}
        cancelText={pageData.btnCancel}
        okText={pageData.btnAdd}
        visible={isVisibaleProductToppingModal}
        content={renderModalContent()}
      ></FnbModal>
      <DeleteConfirmComponent
        title={pageData.leaveDialog.confirmation}
        content={pageData.leaveDialog.content}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.discardBtn}
        okText={pageData.confirmLeaveBtn}
        onCancel={onDiscard}
        onOk={onCompleted}
        isChangeForm={isChangeForm}
      />
    </>
  );
}
