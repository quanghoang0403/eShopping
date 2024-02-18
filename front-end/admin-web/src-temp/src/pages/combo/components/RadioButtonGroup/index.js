import { Radio } from "antd";
import { Container } from "./styled";
import { CheckOutlined } from "constants/icons.constants";
import { useTranslation } from "react-i18next";

const DEFAULT_CHECK_ALL = "";

const RadioButtonGroup = (props) => {
  const { options, onChange, value } = props;

  const [t] = useTranslation();

  const pageData = {
    all: t("combo.all"),
  };

  const handleOnChange = (event) => {
    onChange && onChange(event.target.value);
  };

  return (
    <Container>
      <Radio.Group defaultValue={DEFAULT_CHECK_ALL} onChange={handleOnChange} value={value}>
        <Radio.Button value={DEFAULT_CHECK_ALL}>
          <CheckOutlined />
          {pageData.all}
        </Radio.Button>
        {options?.map((option) => (
          <Radio.Button key={option?.value} value={option?.value}>
            <CheckOutlined />
            {option?.label}
          </Radio.Button>
        ))}
      </Radio.Group>
    </Container>
  );
};

export default RadioButtonGroup;
