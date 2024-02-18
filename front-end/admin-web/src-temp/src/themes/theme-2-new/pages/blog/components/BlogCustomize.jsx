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
  theme2IdScrollView,
} from "../../../constants/store-web-page.constants";
import backgroundDefault from "../../../assets/images/product-detail-header-default.png";
import backgroundBlogDefault from "../../../assets/images/background-default-blog-theme-2.png";

const BlogCustomize = (props) => {
  const [t] = useTranslation();
  const { form, updateFormValues, onChange, pageConfig } = props;

  const translateData = {
    header: t("blog.header"),
    title: t("blog.title"),
    blogs: t("blog.blogs"),
  };

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
        title={translateData.header}
        defaultActiveKey={"0"}
        isNormal={true}
        content={
          <>
            <SelectBackgroundComponent
              {...props}
              formItemPreName={["config", "header"]}
              backgroundCustomize={pageConfig?.config?.header}
              onChangeBackgroundType={(value) =>
                onChangeBackgroundBlog(value, "header")
              }
              maxSizeUploadMb={20}
              defaultImage={backgroundDefault}
            />
            <SelectColorGroupComponent
              {...props}
              formItemPreName={["config", "header"]}
            />

            <div className="related-product-detail-title">
              <p>{translateData.title}</p>
              <Form.Item name={["config", "header", "title"]}>
                <FnbInput
                  showCount
                  allowClear
                  placeholder="Blog"
                  maxLength={255}
                />
              </Form.Item>
            </div>
          </>
        }
        clickToScroll={theme2IdScrollView.BlogHeader}
        customizeKey={theme2ElementCustomize.Blogs}
      ></CustomizationGroup>

      <CustomizationGroup
        title={translateData.blogs}
        defaultActiveKey={"1"}
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
              defaultImage={backgroundBlogDefault}
            />
            <SelectColorGroupComponent
              {...props}
              formItemPreName={["config", "blogs"]}
            />
          </>
        }
        clickToScroll={theme2IdScrollView.BlogList}
        customizeKey={theme2ElementCustomize.Blogs}
      ></CustomizationGroup>
    </>
  );
};

export default BlogCustomize;
