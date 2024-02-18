import { Select } from "antd";
import { Container, Menus, NoDataFounded } from "./styled";
import NoItems from 'assets/images/no-item.png'
import { useTranslation } from "react-i18next";
import { ArrowDownOutlined } from "constants/icons.constants";

const { Option } = Select;

const DEFAULT_ALL_VALUE = "";
const DEFAULT_ITEM_HEIGHT = 5;
const DEFAULT_LIST_HEIGHT = 225;

const SingleSelect = (props) => {
  const { options, placeholder, onChange, value } = props;
  const [t] = useTranslation();

  const pageData = {
    noDataFound: t("reservation.noDataFound"),
  };

  const handleSelect = (newValue) => {
    onChange && onChange(newValue);
  }

  return (
    <Container>
      <Select
        showSearch
        style={{ width: "100%" }}
        value={value}
        defaultValue={DEFAULT_ALL_VALUE}
        onChange={handleSelect}
        dropdownRender={(menu) => <Menus>{menu}</Menus>}
        suffixIcon={<ArrowDownOutlined />}
        listItemHeight={DEFAULT_ITEM_HEIGHT}
        listHeight={DEFAULT_LIST_HEIGHT}
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
        defaultActiveFirstOption
      >
        <Option value={DEFAULT_ALL_VALUE}>
          {placeholder}
        </Option>
        {options?.map((option) => (
          <Option key={option?.value} value={option?.value}>
            {option?.label}
          </Option>
        ))}
      </Select>
    </Container>
  );
};

export default SingleSelect;
