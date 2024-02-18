import { Radio } from "antd";
import { formatTextNumber } from "../../../utils/helpers";
import "./product-detail-product-price.component.scss";

export default function ProductDetailProductPriceComponent(props) {
  const { productPrices, productPriceDefault, onChange, isStyleHorizontal = false } = props;
  return (
    <>
      {isStyleHorizontal ? (
        <div className="group-multiple-price-content radio-horizontal">
          <Radio.Group className="radio-style" onChange={(e) => onChange(e)} defaultValue={productPriceDefault.id}>
            {productPrices.map((productPrice) => {
              return (
                <div className="group-multiple-price-item">
                  <div className="price-name">
                    <span className="name">{productPrice?.priceName}</span>
                    <span className="price-name-value">{formatTextNumber(productPrice?.priceValue)}đ</span>
                  </div>
                  <Radio value={productPrice?.id} className="checkbox-price"></Radio>
                </div>
              );
            })}
          </Radio.Group>
        </div>
      ) : (
        <Radio.Group
          className="radio-style"
          defaultValue={productPriceDefault}
          size="large"
          onChange={(e) => onChange(e)}
        >
          {productPrices.map((productPrice) => (
            <Radio.Button className="radio-option" value={productPrice}>
              {productPrice?.priceName} <br />
              <p className="radio-option-price">{formatTextNumber(productPrice?.priceValue)}đ</p>
            </Radio.Button>
          ))}
        </Radio.Group>
      )}
    </>
  );
}
