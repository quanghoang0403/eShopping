import { useTranslation } from "react-i18next";
import { BucketGeneralCustomizeIcon } from "../../assets/icons.constants";
import SelectBackgroundComponent from "../../components/select-background/select-background.component";
import SelectColorGroupComponent from "../../components/select-color-group/select-color-group.component";
import PageType from "../../constants/page-type.constants";
import defaultConfig from "../../default-store.config";

function GeneralMyProfileCustomize(props) {
  const { form } = props;
  const { getFieldsValue } = form;
  const [t] = useTranslation();
  const defaultThemePageConfig = defaultConfig?.pages?.find((p) => p.id === PageType.MY_PROFILE_PAGE);

  const translateData = {
    generalCustomization: t("onlineStore.introductionConfiguration.generalCustomization", "General customization"),
  };
  const setFocusElementProfile = () => {
    try {
      const element = document.querySelector('.profile-page-background');
        if (element) {
          // set border element on focused
          element.setAttribute("style", "border: 5px solid #50429b !important;");
          element.scrollIntoView({ behavior: "smooth" });
        }
    } catch {}
  };
  return (
      <div onClick={setFocusElementProfile}>
        <SelectBackgroundComponent
          {...props}
          defaultColorPath="config.backgroundColor"
          defaultConfig={defaultConfig}
          formItemPreName={["config"]}
          backgroundCustomize={getFieldsValue()?.config}
          defaultThemeColor={defaultThemePageConfig?.config?.backgroundColor}
        />
        <SelectColorGroupComponent {...props} formItemPreName={["config"]} />
      </div>
  );
}

export const ProfilePageCustomizes = [
  {
    icon: <BucketGeneralCustomizeIcon />,
    title: "General customization",
    isNormal: true,
    defaultActiveKey: 1,
    iconRight: <></>,
    collapsible: false,
    content: (props) => {
      return <GeneralMyProfileCustomize {...props} />;
    },
  },
];
