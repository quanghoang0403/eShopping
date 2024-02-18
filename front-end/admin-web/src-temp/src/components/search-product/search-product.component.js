import { Col, Image, Row, Select } from "antd";
import productImageDefault from "assets/images/product-img-default.png";
import { ArrowDown, SearchIcon } from "constants/icons.constants";
import { useTranslation } from "react-i18next";
import { formatNumber } from "utils/helpers";
import "./search-product.component.scss";
const { Option, OptGroup } = Select;

export default function SearchProductComponent(props) {
  const { products, onChange, value } = props;

  const [t] = useTranslation();
  const pageData = {
    product: {
      productPlaceholder: t("productManagement.table.searchPlaceholder"),
    },
  };

  const renderItemOption = (data, indexProduct) => {
    let count = 0;
    let options = data?.productPrices?.map((item, index) => {
      const countItemVisible = data?.productPrices?.filter((item) => !item?.isHidden)?.length ?? 0;
      let firstClass = "top-option";
      let middleClass = "middle-option";
      let lastClass = "bottom-option";
      if (countItemVisible === 1) {
        firstClass = "only-option";
      }
      if (!item?.isHidden) {
        count++;
      }
      return (
        !item?.isHidden && (
          <Option
            label={data?.name}
            className={count === 1 ? firstClass : count === countItemVisible ? lastClass : middleClass}
            key={item?.id}
            index={indexProduct}
            indexSize={index}
            value={data?.name + " - " + item?.priceName}
          >
            <Row className="border-custom"></Row>
            <Row className="size-option">
              <Col xs={15}>
                <Row>
                  <div className="size">
                    <div className="text">
                      {data?.name + " - "} <span className="size-name">{item?.priceName}</span>
                    </div>
                    <div></div>
                  </div>
                </Row>
              </Col>
              <Col xs={4} className="align-items-center size-unit">
                <div className="text">{data?.unit?.name}</div>
              </Col>
              <Col xs={5} className="align-items-center price">
                <div className="text">{formatNumber(item?.priceValue ?? 0)}</div>
              </Col>
            </Row>
          </Option>
        )
      );
    });

    return options;
  };

  const renderGroupOption = (data, indexProduct) => {
    return (
      <OptGroup
        className="option-group"
        key={indexProduct}
        label={
          <Row>
            <Col xs={24}>
              <Row>
                <Image
                  wrapperClassName="square-frame-pictures"
                  src={data?.thumbnail ?? productImageDefault}
                  preview={false}
                ></Image>
                <div className="name">
                  <div className="text">{data?.name}</div>
                </div>
              </Row>
            </Col>
          </Row>
        }
      >
        {renderItemOption(data, indexProduct)}
      </OptGroup>
    );
  };

  const renderOptions = () => {
    return products?.map((item, index) =>
      item?.productPrices?.length === 1 && !item?.productPrices?.[0]?.isHidden ? (
        <Option label={item?.name} key={item?.productPrices?.[0]?.id} index={index} indexSize={0} value={item?.name}>
          <Row>
            <Col xs={15}>
              <Row>
                <Image
                  wrapperClassName="square-frame-pictures"
                  src={item?.thumbnail ?? productImageDefault}
                  preview={false}
                ></Image>
                <div className="name">
                  <div className="text">{item?.name}</div>
                </div>
              </Row>
            </Col>
            <Col xs={4} className="align-items-center">
              <div className="text">{item?.unit?.name}</div>
            </Col>
            <Col xs={5} className="align-items-center price">
              <div className="text">{formatNumber(item?.productPrices?.[0]?.priceValue ?? 0)}</div>
            </Col>
          </Row>
        </Option>
      ) : (
        item?.productPrices?.length > 1 &&
        item?.productPrices?.some((i) => !i?.isHidden) &&
        renderGroupOption(item, index)
      )
    );
  };

  const handleOnChange = (e, option) => {
    if (onChange) {
      onChange(e, option);
    }
  };

  return (
    <div className="search-product-component">
      <Row>
        <Col span={24}>
          <Select
            placement="bottomLeft"
            getPopupContainer={(trigger) => trigger.parentNode}
            mode="multiple"
            autoClearSearchValue={false}
            showSearch={true}
            optionLabelProp="label"
            showArrow
            allowClear={false}
            value={value}
            onChange={(e, option) => handleOnChange(e, option)}
            className="select-search-product"
            popupClassName="dropdown-product-data"
            suffixIcon={<ArrowDown />}
            placeholder={pageData.product.productPlaceholder}
            listHeight={window.innerHeight - 450}
          >
            {renderOptions()}
          </Select>
          <div className="icon-search-material">
            <SearchIcon />
          </div>
        </Col>
      </Row>
    </div>
  );
}
