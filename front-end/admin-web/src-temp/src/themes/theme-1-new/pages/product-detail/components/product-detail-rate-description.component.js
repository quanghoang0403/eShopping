import { Rate } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import { t } from "i18next";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "./product-detail-images.component.scss";
import { useAppCtx } from "../../../../providers/app.provider";

export default function ProductDetailRateDescriptionComponent(props) {
  const {
    title,
    content,
    numberOfReview = 0,
    styleTitle,
    classNameRate,
    defaultValueRate = 5,
    classNameDescription = "description-content",
    styleContent,
    isViewMore = false,
    classNameTotalReview = "total-review",
  } = props;
  const translatedData = {
    review: t("storeWebPage.generalUse.review"),
  };
  const { fontFamily } = useAppCtx();

  return (
    <>
      <div className="product-rate">
        <Rate count={1} disabled className={classNameRate} defaultValue={defaultValueRate} />
        <span className="rate-number">{defaultValueRate}</span>
        <span>-</span>
        <span className={classNameTotalReview}>
          {numberOfReview} {translatedData.review}
        </span>
      </div>
      <div span={12} xs={24} sm={12}>
        {content && title && (
          <div className="description-title" style={styleTitle}>
            {title}
          </div>
        )}
        {isViewMore ? (
          <div className={classNameDescription}>
            <Paragraph
              ellipsis={{
                rows: 2,
                expandable: true,
                symbol: "View more",
              }}
              style={{ ...styleContent, fontFamily: fontFamily }}
            >
              {content}
            </Paragraph>
          </div>
        ) : (
          <div className={classNameDescription} style={styleContent}>
            {content}
          </div>
        )}
      </div>
    </>
  );
}
