import { Container } from "./styled";
import { Checkbox } from "antd";
import { CheckOutlined } from "constants/icons.constants";
import { useTranslation } from "react-i18next";

const GroupButton = (props) => {
  const { options, allowdAll = true, onChange, defaultCheckedAll, value } = props;
  const [t] = useTranslation();

  const pageData = {
    all: t("reservation.all"),
  };

  const handleCheckedAll = (event) => {
    const { checked } = event.target;
    if (checked) {
      onChange && onChange([defaultCheckedAll]);
    }
  };

  const handleChangeOptions = (event) => {
    if (event.target.checked) {
      const checkedOptions = value?.filter(option => option !== defaultCheckedAll);
      onChange && onChange([...checkedOptions, event.target.value]);
    } else {
      const checkedOptions = value?.filter(option => option !== event.target.value);
      onChange && onChange([...checkedOptions]);
    }
  };

  return (
    <Container>
      {options && (
        <Checkbox.Group style={{ width: "100%" }} value={value}>
          {allowdAll && (
            <Checkbox value={defaultCheckedAll} onChange={handleCheckedAll}>
              <CheckOutlined className="checked-icon" />
              {pageData.all}
            </Checkbox>
          )}
          {options?.map((option) => (
            <Checkbox key={option?.value} value={option?.value} onChange={handleChangeOptions}>
              <CheckOutlined className="checked-icon" />
              {option?.label}
            </Checkbox>
          ))}
        </Checkbox.Group>
      )}
    </Container>
  );
};

export default GroupButton;
