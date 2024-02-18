import { Select, Tooltip } from "antd";
import { AllProduts, Container, GroupVariants, Menus, NoDataFounded, ProductHasVariants, ProductNoneVariants, TooltipContent } from "./styled";
import { ArrowDownOutlined } from "constants/icons.constants";
import { useTranslation } from "react-i18next";
import { useLayoutEffect, useState } from "react";
import DefaultThumbnail from 'assets/images/product-img-default.png'
import NoItems from 'assets/images/no-item.png'

const { OptGroup, Option } = Select;

const DEFAULT_LIST_HEIGHT = 395;

const ProductSelect = (props) => {
  const { options, placeholder, onChange, defaultSelectedAll, value } = props;
  const [t] = useTranslation();
  const [selectedAll, setSelectedAll] = useState();

  const pageData = {
    noDataFound: t("reservation.noDataFound"),
  };

  useLayoutEffect(() => {
    setSelectedAll(value?.includes(defaultSelectedAll));
  }, [value]);

  const handleFilterOption = (input, product) => {
    const keysearch = input?.removeVietnamese()?.trim()?.toLowerCase();

    if (product?.options?.length > 1) {
      return product?.options?.some((option) =>
        (option?.label?.removeVietnamese()?.trim()?.toLowerCase() || "")?.includes(keysearch),
      );
    } else if (typeof product?.label === "string") {
      return (product?.label?.removeVietnamese()?.trim()?.toLowerCase() || "")?.includes(keysearch);
    }
  };

  const handleSelect = (newValue) => {
    const optionsTotal = newValue?.length;
    const indexOfOptionAll = newValue?.indexOf(defaultSelectedAll);
    const optionsExceptAll = newValue?.filter((option) => option !== defaultSelectedAll) || [];

    if (optionsTotal && indexOfOptionAll < 1) {
      onChange && onChange(optionsExceptAll);
    } else {
      onChange && onChange([defaultSelectedAll]);
    }
  }

  const renderMaxTagPlaceholder = (omittedValues) => {
    return (
      <Tooltip
        placement="bottomRight"
        title={
          <TooltipContent>
            {Array.from(omittedValues)?.map((value, index) => (
              <li key={index}>{value?.label}</li>
            ))}
          </TooltipContent>
        }
      >
        <span>{Array.from(omittedValues)?.length}+</span>
      </Tooltip>
    );
  };

  const renderProductHasVariants = (option) => {
    return (
      <OptGroup
        label={
          <GroupVariants>
            <img src={option?.thumbnail || DefaultThumbnail} alt={option?.name} />
            <span title={option?.name}>{option?.name}</span>
          </GroupVariants>
        }
      >
        {option?.productPrices?.map((productPrice) => (
          <Option value={productPrice?.id} label={`${option?.name} (${productPrice?.priceName})`}>
            <ProductHasVariants>{productPrice?.priceName}</ProductHasVariants>
          </Option>
        ))}
      </OptGroup>
    );
  };

  const renderProductNoneVariants = (option) => {
    return (
      <Option value={option?.productPrices?.[0]?.id} label={option?.name}>
        <ProductNoneVariants>
          <img src={option?.thumbnail || DefaultThumbnail} alt={option?.name} />
          <span title={option?.name}>{option?.name}</span>
        </ProductNoneVariants>
      </Option>
    );
  };

  return (
    <Container selectedAll={selectedAll}>
      <Select
        showArrow
        allowClear
        mode="multiple"
        style={{ width: "100%" }}
        value={value}
        onChange={handleSelect}
        dropdownRender={(menu) => <Menus>{menu}</Menus>}
        placeholder={placeholder}
        suffixIcon={<ArrowDownOutlined />}
        maxTagCount="responsive"
        maxTagPlaceholder={renderMaxTagPlaceholder}
        dropdownMatchSelectWidth={false}
        listHeight={DEFAULT_LIST_HEIGHT}
        notFoundContent={
          <NoDataFounded>
            <img src={NoItems} alt="" />
            <span>{pageData.noDataFound}</span>
          </NoDataFounded>
        }
        filterOption={handleFilterOption}
        optionLabelProp="label"
      >
        <Option value={defaultSelectedAll} label={placeholder}>
          <AllProduts>
            <span>{placeholder}</span>
          </AllProduts>
        </Option>
        {options?.map((option) =>
          option?.hasVariants ? renderProductHasVariants(option) : renderProductNoneVariants(option),
        )}
      </Select>
    </Container>
  );
};

export default ProductSelect;
