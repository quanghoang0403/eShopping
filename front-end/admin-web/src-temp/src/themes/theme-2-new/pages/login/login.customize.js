import { LoginPageStoreWebIcon } from "../../assets/icons.constants";
import SelectBackgroundComponent from "../../components/select-background/select-background.component";
import SelectColorGroupComponent from "../../components/select-color-group/select-color-group.component";
import { theme2ElementCustomize } from "../../constants/store-web-page.constants";
import defaultConfig from "../../default-store.config";

import "./login.style.scss";

export const LoginCustomizes = [
  {
    icon: <LoginPageStoreWebIcon />,
    title: "Login Page",
    isNormal: true,
    defaultActiveKey: 1,
    iconRight: <></>,
    collapsible: false,
    name: "login",
    content: (props) => {
      const defaultConfigLogin =
        defaultConfig?.pages.find((login) => login.id === props?.pageId) ??
        "/images/default-theme/background-default-login-theme-2.png";
      return (
        <div className={`${theme2ElementCustomize.LoginPage}`}>
          <SelectBackgroundComponent
            {...props}
            formItemPreName={["config"]}
            backgroundCustomize={props?.pageConfig?.config}
            maxSizeUploadMb={20}
            defaultImage={defaultConfigLogin?.config?.backgroundImage}
          />
          <SelectColorGroupComponent {...props} formItemPreName={["config"]} />
        </div>
      );
    },
  },
];
