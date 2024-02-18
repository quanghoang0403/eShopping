import { Col, Row } from "antd";
import React from "react";
import { formatTextNumber } from "../../../utils/helpers";
import { CartPlusIcon } from "../../assets/icons.constants";
import DisplayImageComponent from "../display-image/DisplayImageComponent";
import "./ProductCartComponent.scss";

function ProductCartComponent(props) {
  const { data, onClickButtonAdd, onClickTitle } = props;

  function handleOnClickButtonAdd() {
    if (onClickButtonAdd) {
      onClickButtonAdd();
    }
  }

  function handleOnClickTitle() {
    if (onClickTitle) {
      onClickTitle();
    }
  }

  return (
    <div className="product-cart">
      <DisplayImageComponent
        className="product-cart-image cursor-pointer"
        promotionTag={data?.promotionTag}
        src={data?.thumbnail}
        onClick={handleOnClickTitle}
      />
      <Row className="content">
        <Col span={24} className="title cursor-pointer" onClick={handleOnClickTitle}>
          {data?.name}
        </Col>
        <Col span={12} className="price">
          <div className="selling-price">{formatTextNumber(data?.sellingPrice)}đ</div>
          {data?.originalPrice > data?.sellingPrice && (
            <div className="original-price">{formatTextNumber(data?.originalPrice)}đ</div>
          )}
        </Col>
        <Col span={12} className="button" onClick={handleOnClickButtonAdd}>
          <CartPlusIcon className="cursor-pointer" />
        </Col>
      </Row>
    </div>
  );
}

export default React.memo(ProductCartComponent, (prevProps, nextProps) => prevProps.data === nextProps.data);
