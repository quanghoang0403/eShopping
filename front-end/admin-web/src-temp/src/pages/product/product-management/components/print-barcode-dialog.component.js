import { Button, Col, Image, InputNumber, Modal, Row, Tooltip } from "antd";
import SearchProductComponent from "components/search-product/search-product.component";
import comboDataService from "data-services/combo/combo-data.service";

import productImageDefault from "assets/images/product-img-default.png";
import { Printer } from "components/Printer";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { BarcodeType } from "constants/barcode-type.constants";
import { TrashFill } from "constants/icons.constants";
import barcodeDataService from "data-services/barcode/barcode-data.service";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { convertTextToBarcodeBase64, executeAfter, formatTextNumber, replaceParameter } from "utils/helpers";
import "./print-barcode-dialog.component.scss";

export default function PrintBarcodeDialogComponent(props) {
  const { visible, onCancel, onPrint } = props;
  const printerRef = React.useRef(null);

  const [t] = useTranslation();
  const translateData = {
    button: {
      delete: t("button.delete", "Delete"),
      printBarcode: t("button.printBarcode", "Print barcode"),
      ignore: t("button.ignore", "Ignore"),
    },
    barcode: {
      printProductBarcode: t("barcode.printProductBarcode", "Print product barcode"),
    },
    stampSize: t("stamp.stampSize", "Stamp size"),
  };
  const [products, setProducts] = useState([]);
  const [productsSelected, setProductsSelected] = useState([]);
  const [stampTypes, setStampTypes] = useState([]);
  const [template, setTemplate] = useState("");
  const [contentPrint, setContentPrint] = useState("");
  const [heightModal, setHeightModal] = useState("100px");

  useEffect(() => {
    getPrepareData();
    const _heightModal = window.innerHeight - 400;
    setHeightModal(_heightModal + "px");
  }, []);

  useEffect(() => {
    if (contentPrint?.content) {
      printStamp();
    }
  }, [contentPrint]);

  const GetProductNameDisplay = (name, priceName) => {
    return name + (priceName && " - " + priceName);
  };

  const getContentToPrint = () => {
    let content = "";

    products?.map((product) => {
      product?.productPrices
        ?.filter((item) => item?.isSelected)
        ?.map((item) => {
          let base64Image = convertTextToBarcodeBase64(item?.barcode, { displayValue: false });
          const parameter = {
            productName: product?.name,
            productPriceName: item?.priceName ?? "",
            code: item?.barcode,
            price: formatTextNumber(item?.priceValue),
            base64Image: base64Image,
          };

          const _content = replaceParameter(template, parameter);

          for (let index = 0; index < item?.numberOfPrints ?? 1; index++) {
            content += _content;
          }
        });
    });

    return content;
  };

  const handleOnChange = (e, option) => {
    const lastIndex = option?.length - 1;
    const data = option?.[lastIndex];
    if (data) {
      const productsNew = [...products];
      const productPriceSelected = productsNew?.[data?.index]?.productPrices?.[data?.indexSize];
      if (productPriceSelected) {
        productPriceSelected.isSelected = true;
        productPriceSelected.isHidden = true;
        productPriceSelected.numberOfPrints = 1;

        setProducts(productsNew);
        setProductsSelected(e);
      }
    }
  };

  const handleDelete = (indexProduct, indexSize, productNameSelected) => {
    const productsNew = [...products];
    const productPriceSelected = productsNew?.[indexProduct]?.productPrices?.[indexSize];
    if (productPriceSelected) {
      productPriceSelected.isSelected = false;
      productPriceSelected.isHidden = false;
      setProducts(productsNew);

      const indexProductDelete = productsSelected?.findIndex((item) => item === productNameSelected);
      if (indexProductDelete !== -1) {
        const productsSelectedNew = [...productsSelected];
        productsSelectedNew.splice(indexProductDelete, 1);
        setProductsSelected(productsSelectedNew);
      }
    }
  };

  const handleChangeNumberOfPrints = (indexProduct, indexSize, value) => {
    executeAfter(500, () => {
      const productsNew = [...products];
      const productPriceSelected = productsNew?.[indexProduct]?.productPrices?.[indexSize];
      if (productPriceSelected) {
        productPriceSelected.numberOfPrints = value ?? 1;
        setProducts(productsNew);
      }
    });
  };

  const handleOnChangeStampType = (value) => {
    if (value) {
      const _template = stampTypes?.find((item) => item?.id === value)?.template ?? "";
      setTemplate(_template);
    }
  };

  const getPrepareData = () => {
    comboDataService.getPrepareCreateProductComboDataAsync().then((data) => {
      const { products } = data;
      setProducts(products);
    });

    barcodeDataService.getBarcodeStampsByStoreIdAsync(BarcodeType.barcode).then((res) => {
      setStampTypes(res?.stamps ?? []);
      setTemplate(res?.stamps?.[0]?.template);
    });
  };

  const renderFooter = () => {
    return (
      <Row className="footer-print-barcode">
        <Col span={12}>
          <Row className="stamp-size">
            <div className="title">{translateData.stampSize}:</div>
            <FnbSelectSingle
              placeholder={""}
              className="form-select"
              defaultValue={stampTypes?.[0]?.id}
              option={stampTypes}
              onChange={(value) => {
                handleOnChangeStampType(value);
              }}
            />
          </Row>
        </Col>
        <Col span={12} className="btn-group">
          <Button className="btn-cancel-print-barcode" onClick={handleCancel}>
            {translateData.button.ignore}
          </Button>
          <Button
            className="btn-print-barcode"
            disabled={productsSelected?.length > 0 ? false : true}
            onClick={handlePrint}
          >
            {translateData.button.printBarcode}
          </Button>
        </Col>
      </Row>
    );
  };

  const renderProductsSelected = () => {
    return products?.map((product, indexProduct) =>
      product?.productPrices?.map((item, indexSize) => {
        const tooltipProductName = GetProductNameDisplay(product?.name, item?.priceName);
        return (
          item?.isSelected && (
            <Row className="item-selected">
              <Col xs={15}>
                <Row>
                  <Image
                    wrapperClassName="square-frame-pictures"
                    src={product?.thumbnail ?? productImageDefault}
                    preview={false}
                  ></Image>
                  <div className="name">
                    <Tooltip
                      overlayClassName="tooltip-print-barcode"
                      placement="top"
                      title={tooltipProductName}
                      zIndex={1000}
                    >
                      <div className="text">
                        {product?.name}
                        {item?.priceName && " - "} <span className="size-name">{item?.priceName}</span>
                      </div>
                    </Tooltip>
                  </div>
                </Row>
              </Col>
              <Col xs={4} className="align-items-center">
                <div className="text">{product?.unit?.name}</div>
              </Col>
              <Col xs={4} className="align-items-center">
                <InputNumber
                  className="fnb-input input-quantity input-quantity-print"
                  min={1}
                  max={999}
                  defaultValue={1}
                  onChange={(value) => {
                    handleChangeNumberOfPrints(indexProduct, indexSize, value);
                  }}
                />
              </Col>
              <Col xs={1} className="align-items-center delete-print-barcode">
                <Tooltip
                  overlayClassName="tooltip-print-barcode"
                  placement="top"
                  title={translateData.button.delete}
                  zIndex={1000}
                >
                  <TrashFill
                    className="icon-svg-hover cursor-pointer"
                    onClick={() => handleDelete(indexProduct, indexSize, tooltipProductName)}
                  />
                </Tooltip>
              </Col>
            </Row>
          )
        );
      })
    );
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const printStamp = () => {
    if (printerRef && printerRef.current) {
      printerRef.current.printTemplate();
    }
  };

  const handlePrint = () => {
    //set content then print
    const content = {
      printTime: moment.now(),
      content: getContentToPrint(),
    };
    setContentPrint(content);

    if (onPrint) {
      onPrint();
    }
  };

  return (
    <>
      <Printer ref={printerRef} htmlContent={contentPrint?.content} paddingBottom={0} />
      <Modal
        centered
        wrapClassName="print-barcode-dialog"
        title={translateData.barcode.printProductBarcode}
        visible={visible}
        closable={false}
        onCancel={handleCancel}
        footer={renderFooter()}
        bodyStyle={{ height: heightModal }}
      >
        <SearchProductComponent products={products} onChange={handleOnChange} value={productsSelected} />
        <div className="products-selected">{renderProductsSelected()}</div>
      </Modal>
    </>
  );
}
