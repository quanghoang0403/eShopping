import Paragraph from "antd/lib/typography/Paragraph";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppCtx } from "../../../providers/app.provider";

export default function ProductDetailDescriptionComponent({
  title,
  content,
  styleTitle,
  classNameDescription = "description-content",
  styleContent,
  isViewMore = false,
  idDescription,
}) {

  const [t] = useTranslation();
  const [isExpand, setIsExpand] = useState(false);
  const [counter, setCounter] = useState(0);
  const { fontFamily } = useAppCtx();

  const pageData = {
    viewMore: t("storeWebPage.productDetailPage.viewMore", "View more"),
    seeLess: t("storeWebPage.productDetailPage.seeLess", "See less"),
  };

  const handleExpand = () => {
    setIsExpand(true);
    if(isExpand) {
      setCounter(counter + 1);
    }
    else {
      setCounter(counter + 0);
    }
  }

  const handleCollapse = () => {
    setIsExpand(false);
    if(isExpand) {
      setCounter(counter + 1);
    }
    else {
      setCounter(counter + 0);
    }
  }

  return (
    <div span={12} xs={24} sm={12}>
      {title && (
        <div className="description-title" style={styleTitle}>
          {title}
        </div>
      )}
      {isViewMore ? (
        <div className={classNameDescription} id={idDescription} key={counter}>
          <Paragraph
            ellipsis={{
              rows: 2,
              expandable: true,
              symbol: pageData.viewMore,
              onExpand: handleExpand
            }}
            style={{...styleContent, fontFamily : fontFamily}}
          >
            {content}
            { isExpand && <a className="ant-typography-expand" aria-label="Expand" onClick={() => handleCollapse()}>{pageData.seeLess}</a> }
          </Paragraph>
        </div>
      ) : (
        <div className={classNameDescription} style={styleContent} id={idDescription}>
          {content}
        </div>
      )}
    </div>
  );
}
