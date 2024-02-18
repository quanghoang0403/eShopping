import { Rate } from "antd";
import { t } from "i18next";

export default function ProductDetailRateComponent(props) {
  const { numberOfReview = 0, classNameRate, defaultValueRate = 5, classNameTotalReview = "total-review" } = props;
  const translatedData = {
    review: t("storeWebPage.generalUse.review"),
  };

  return (
    <div className="product-rate">
      <Rate count={1} disabled className={classNameRate} defaultValue={defaultValueRate} />
      <span className="rate-number">{defaultValueRate}</span>
      <span>-</span>
      <span className={classNameTotalReview}>
        {numberOfReview} {translatedData.review}
      </span>
    </div>
  );
}
