import { Form } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import CustomizationGroup from "../../../components/customization-group-component/customization-group.page";
import { FnbInput } from "../../../components/fnb-input/fnb-input.component";
import SelectBackgroundComponent from "../../../components/select-background/select-background.component";
import SelectColorGroupComponent from "../../../components/select-color-group/select-color-group.component";
import {
  backgroundTypeEnum,
  theme2ElementCustomize,
} from "../../../constants/store-web-page.constants";

const BlogDetailCustomize = (props) => {
  const { updateFormValues, onChange, pageConfig } = props;

  useEffect(() => {
    if (updateFormValues) {
      updateFormValues();
    }
  });

  const onChangeBackgroundBlog = (value, name) => {
    let changedValue = {
      key: [],
      value: null,
    };
    if (value === backgroundTypeEnum.IMAGE) {
      changedValue.key = ["config", name, "backgroundColor"];
    } else {
      changedValue.key = ["config", name, "backgroundImage"];
    }
    if (onChange) {
      onChange(changedValue);
    }
  };

  return (
    <>
      <CustomizationGroup
        title={"Article detail"}
        defaultActiveKey={"0"}
        content={
          <>
            <SelectBackgroundComponent
              {...props}
              formItemPreName={["config", "blogs"]}
              backgroundCustomize={pageConfig?.config?.blogs}
              onChangeBackgroundType={(value) =>
                onChangeBackgroundBlog(value, "blogs")
              }
              maxSizeUploadMb={20}
            />
            <SelectColorGroupComponent
              {...props}
              formItemPreName={["config", "blogs"]}
            />
          </>
        }
        clickToScroll="#relatedProductsDetail"
        customizeKey={theme2ElementCustomize.BlogsDetail}
      ></CustomizationGroup>
    </>
  );
};

export default BlogDetailCustomize;
