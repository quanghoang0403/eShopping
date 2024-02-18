import { useEffect } from "react";
import { BucketGeneralCustomizeIcon } from "../../assets/icons.constants";
import SelectBackgroundComponent from "../../components/select-background.component";
import SelectColorGroupComponent from "../../components/select-color-group.component";
import PageType from "../../constants/page-type.constants";
import defaultConfig from "../../default-store.config";
import { backgroundTypeEnum } from "../../constants/store-web-page.constants";

function GeneralMyProfileCustomize(props) {
  const { pageConfig, updateFormValues, onChange } = props;
  const defaultThemePageConfig = defaultConfig?.pages?.find((p) => p.id === PageType.MY_PROFILE_PAGE);
  const colorGroup = pageConfig?.general?.color?.colorGroups?.filter(
    (color) => color?.isDefault
  );

  useEffect(() => {
    if (updateFormValues) {
      updateFormValues();
    }
  });

  const onChangeBackgroundProfile = (value) => {
    let changedValue = {
      key: [],
      value: null,
    };
    if (value === backgroundTypeEnum.IMAGE) {
      changedValue.key = ["config", "backgroundColor"];
    } else {
      changedValue.key = ["config", "backgroundImage"];
    }
    if (onChange) {
      onChange(changedValue);
    }
  };

  return (
    <>
      <SelectBackgroundComponent
        {...props}
        formItemPreName={["config"]}
        backgroundCustomize={pageConfig?.config}
        defaultThemeColor={defaultThemePageConfig?.config?.backgroundColor}
        onChangeBackgroundType={(value) => onChangeBackgroundProfile(value)}
      />
      <SelectColorGroupComponent
        {...props}
        formItemPreName={["config"]}
        defaultValue={colorGroup?.length ? colorGroup[0]?.id : ""}
      />
    </>
  );
}

export const MyProfileCustomizes = [
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
