import { Rate } from "antd";
import { t } from "i18next";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "./product-detail-rate.component.scss";

export default function ProductDetailRateComponent({
  numberOfReview = 0,
  classNameRate,
  defaultValueRate = 5,
  styleContent,
  classNameTotalReview = "total-review",
  groupRateStart = "",
}) {
  const translatedData = {
    review: t("storeWebPage.productDetailPage.reviewTitle", "Review"),
  };
  return (
    <div className={groupRateStart}>
      <Rate disabled className={classNameRate} defaultValue={defaultValueRate} />
      <span className={classNameTotalReview} style={styleContent}>
        {numberOfReview} {translatedData.review}
      </span>
    </div>
  );
}
