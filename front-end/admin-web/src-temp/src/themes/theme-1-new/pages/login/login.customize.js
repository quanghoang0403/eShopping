import { Form } from "antd";
import { StoreWebBannerIcon } from "../../assets/icons.constants";
import { FnbInput } from "../../components/fnb-input/fnb-input.component";
import SelectBackgroundComponent from "../../components/select-background.component";
import SelectColorGroupComponent from "../../components/select-color-group.component";
import PageType from "../../constants/page-type.constants";
import defaultConfig from "../../default-store.config";
import "./login.style.scss";

export const LoginCustomizes = [
  {
    icon: <StoreWebBannerIcon />,
    title: "General customization",
    isNormal: true,
    defaultActiveKey: 1,
    iconRight: <></>,
    collapsible: true,
    name: "login",
    content: (props) => {
      const { form } = props;
      const bestDisplay = "1920 x 569 px";
      const defaultThemePageConfig = defaultConfig?.pages?.find((p) => p.id === PageType.LOGIN_PAGE);
      const { getFieldsValue } = form;
      return (
        <>
          <SelectBackgroundComponent
            {...props}
            defaultColorPath="config.backgroundColor"
            defaultConfig={defaultConfig}
            formItemPreName={["config"]}
            backgroundCustomize={getFieldsValue()?.config}
            bestDisplay={bestDisplay}
            defaultThemeColor={defaultThemePageConfig?.config?.backgroundColor}
            defaultImage={defaultThemePageConfig?.config?.backgroundImage}
          />
          <SelectColorGroupComponent {...props} formItemPreName={["config"]} />
          <div className="login-title">
            <p>Title</p>
            <Form.Item rules={[{ required: true, message: "Title is required" }]} name={["config", "title"]}>
              <FnbInput showCount allowClear placeholder="Title" maxLength={100} />
            </Form.Item>
          </div>
        </>
      );
    },
  },
];
