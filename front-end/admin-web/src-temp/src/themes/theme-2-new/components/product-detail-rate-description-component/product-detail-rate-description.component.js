import { Rate } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import { t } from "i18next";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

export default function ProductDetailRateDescriptionComponent({
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
  idDescription,
  groupRateStart = "",
}) {
  const translatedData = {
    review: t("storeWebPage.generalUse.review", "Review"),
  };
  return (
    <>
      <div className={groupRateStart}>
        <Rate disabled className={classNameRate} defaultValue={defaultValueRate} />
        <span className={classNameTotalReview} style={styleContent}>
          {numberOfReview} {translatedData.review}
        </span>
      </div>
      <div span={12} xs={24} sm={12}>
        {title && (
          <div className="description-title" style={styleTitle}>
            {title}
          </div>
        )}
        {isViewMore ? (
          <div className={classNameDescription} id={idDescription}>
            <Paragraph
              ellipsis={{
                rows: 2,
                expandable: true,
                symbol: "View more",
              }}
              style={styleContent}
            >
              {content}
            </Paragraph>
          </div>
        ) : (
          <div className={classNameDescription} style={styleContent} id={idDescription}>
            {content}
          </div>
        )}
      </div>
    </>
  );
}
