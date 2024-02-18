import { Button, Col, Collapse, Input, Radio, Rate, Row } from "antd";
import CollapsePanel from "antd/lib/collapse/CollapsePanel";
import { formatTextNumber } from "../../../../utils/helpers";
import React from "react";
import { MinusOutlined, PlusOutlined } from "../../../assets/icons.constants";
import "./option-topping-product.component.scss";

export function OptionToppingProductComponent(props) {
  const {
    productPrices,
    productPriceDefault,
    options,
    optionsSelected,
    toppings,
    updateQuantityTopping,
    onChangeSize,
    onChangeOptions,
    maximumQuantityCustom,
    headStyle,
  } = props;

  let defaultActiveKey = ["Size"];
  let maximumQuantity = maximumQuantityCustom ?? 99;

  const renderSize = () => {
    if (productPrices?.length <= 1) return <></>;
    let render = (
      <CollapsePanel header="Chọn size" key="Size">
        <Radio.Group defaultValue={productPriceDefault} size="large" onChange={(e) => onChangeSize(e)}>
          {productPrices.map((productPrice, index) => (
            <Radio.Button className="radio-option" value={productPrice}>
              {productPrice?.priceName} <br />
              <p className="radio-option-price">{formatTextNumber(productPrice?.priceValue)}đ</p>
            </Radio.Button>
          ))}
        </Radio.Group>
      </CollapsePanel>
    );
    return render;
  };

  const renderOptions = () => {
    if (!options) return <></>;
    let render = options?.map((option, index) => (
      <CollapsePanel header={option?.name} key={option?.id}>
        <span className="d-none">{defaultActiveKey.push(option?.id)}</span>
        <Radio.Group defaultValue={optionsSelected[index]} size="large" onChange={(e) => onChangeOptions(e, index)}>
          {option?.optionLevels?.map((optionLevel, index) => (
            <Radio.Button className="radio-option" value={optionLevel}>
              {optionLevel?.name}
            </Radio.Button>
          ))}
        </Radio.Group>
      </CollapsePanel>
    ));
    return render;
  };

  const renderTopping = () => {
    if (!toppings) return <></>;
    defaultActiveKey.push("topping");
    let render = (
      <CollapsePanel header="Thêm topping" key="topping" className="topping">
        {toppings.map((topping, index) => (
          <Row className="topping-item">
            <Col span={12} xs={13} sm={16} className="style-text-customize">
              <span className="topping-name">{topping?.name}</span>
              <br />
              <p className="topping-price">{formatTextNumber(topping?.priceValue)}đ</p>
            </Col>
            <Col span={8} xs={11} sm={8} className="modify-quantity">
              {topping?.quantity < maximumQuantity ? (
                <Button
                  icon={<PlusOutlined />}
                  className="btn-increase"
                  onClick={() => updateQuantityTopping(index, 1, topping?.priceValue)}
                ></Button>
              ) : (
                <Button icon={<PlusOutlined />} className="btn-increase" disabled></Button>
              )}
              <span className="quantity-product">{topping?.quantity}</span>
              {topping?.quantity > 0 ? (
                <Button
                  icon={<MinusOutlined />}
                  className="btn-reduce"
                  onClick={() => updateQuantityTopping(index, -1, topping?.priceValue)}
                ></Button>
              ) : (
                <Button icon={<MinusOutlined />} className="btn-reduce d-none"></Button>
              )}
            </Col>
          </Row>
        ))}
      </CollapsePanel>
    );
    return render;
  };
  return (
    <Collapse className="product-detail-collapse" headStyle={headStyle} defaultActiveKey={defaultActiveKey}>
      {renderSize()}
      {renderOptions()}
      {renderTopping()}
    </Collapse>
  );
}
