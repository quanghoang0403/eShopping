import { Select, Tooltip } from "antd";
import { Container, Menus, NoDataFounded, TooltipContent } from "./styled";
import { ArrowDownOutlined } from "constants/icons.constants";
import NoItems from 'assets/images/no-item.png'
import { useTranslation } from "react-i18next";

const MultipleSelect = (props) => {
  const { options, placeholder, onChange, value } = props;
  const [t] = useTranslation();

  const pageData = {
    noDataFound: t("reservation.noDataFound"),
  };

  const handleSelect = (newValue) => {
    onChange && onChange(newValue);
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

  return (
    <Container>
      <Select
        showArrow
        allowClear
        mode="multiple"
        style={{ width: "100%" }}
        value={value}
        options={options || []}
        onChange={handleSelect}
        dropdownRender={(menu) => <Menus>{menu}</Menus>}
        placeholder={placeholder}
        suffixIcon={<ArrowDownOutlined />}
        maxTagCount="responsive"
        maxTagPlaceholder={renderMaxTagPlaceholder}
        notFoundContent={
          <NoDataFounded>
            <img src={NoItems} alt="" />
            <span>{pageData.noDataFound}</span>
          </NoDataFounded>
        }
        filterOption={(input, option) =>
          (option?.label?.removeVietnamese()?.trim()?.toLowerCase() || "")?.includes(
            input?.removeVietnamese()?.trim()?.toLowerCase(),
          )
        }
      />
    </Container>
  );
};

export default MultipleSelect;
