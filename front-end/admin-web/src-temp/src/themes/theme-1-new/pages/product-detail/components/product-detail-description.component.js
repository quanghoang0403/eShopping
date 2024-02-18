import Paragraph from "antd/lib/typography/Paragraph";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppCtx } from "../../../../providers/app.provider";

export default function ProductDetailDescriptionComponent(props) {
  const {
    title,
    content,
    styleTitle,
    classNameDescription = "description-content",
    styleContent,
    isViewMore = false,
  } = props;
  const [isExpanded, setIsExpanded] = useState(false);
  const { fontFamily } = useAppCtx();
  const [t] = useTranslation();
  const translatedData = {
    viewMore: t("blogs.btnSeeMore", "Home Page"),
    collapse: t("storeWebPage.productDetailPage.collapse", "Home Page"),
  };

  return (
    <div span={12} xs={24} sm={12} md={12} lg={12} xl={12} xxl={12} style={{ width: "100%" }}>
      {content && (
        <>
          {title && (
            <div className="description-title" style={styleTitle}>
              {title}
            </div>
          )}
          {isViewMore ? (
            <div className={classNameDescription}>
              {isExpanded ? (
                <span className="description-content ant-typography">
                  {content}
                  <span
                    onClick={() => {
                      setIsExpanded(false);
                    }}
                    className="collapse-custom"
                  >
                    {" "}
                    {translatedData.collapse}
                  </span>
                </span>
              ) : (
                <Paragraph
                  ellipsis={{
                    rows: 3,
                    expandable: true,
                    symbol: translatedData.viewMore,
                    onExpand: () => setIsExpanded(true),
                  }}
                  style={{ ...styleContent, fontFamily: fontFamily }}
                >
                  {content}
                </Paragraph>
              )}
            </div>
          ) : (
            <div className={classNameDescription} style={styleContent}>
              {content}
            </div>
          )}
        </>
      )}
    </div>
  );
}
