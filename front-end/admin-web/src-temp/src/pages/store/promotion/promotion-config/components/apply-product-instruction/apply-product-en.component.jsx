import { languageCode } from "../../../../../../constants/language.constants";
import TooltipPromotionConfig from "../tooltipPromotionConfig.component";
import { useTranslation } from "react-i18next";
import ExampleInstruction, { TYPE_EXAMPLE } from "../example-intruction/index.component";

function ApplyProductEN() {
  const [t] = useTranslation();
  const translatedData = {
    on: t("promotion.promotionSetting.on"),
    off: t("promotion.promotionSetting.off"),
    and: t("promotion.promotionSetting.and"),
    flashSaleTooltip: t("promotion.promotionSetting.flashSaleTooltip"),
    discountAmountThenPercent: t("promotion.promotionSetting.discountAmountThenPercent"),
  };
  return (
    <>
      {/* ON */}
      <div className="wrapper-content wrapper-content--rg-12">
        <span className="title-danger">{translatedData.on}</span>
        <ul className="wrapper-content wrapper-content--rg-12 wrapper-content--list">
          <li className="text-default">
            The promotions <span className="title-default"> can be able </span> to combine together on{" "}
            <span className="title-default"> the same product </span>
            {"("}not including the
            <TooltipPromotionConfig
              text=" Flash sales product"
              textTooltip={translatedData.flashSaleTooltip}
              className="title-primary"
            />
            {")"}
          </li>
        </ul>
      </div>
      {/* Off */}
      <div className="wrapper-content wrapper-content--rg-12">
        <span className="title-danger">{translatedData.off}</span>
        <ul className="wrapper-content wrapper-content--rg-12 wrapper-content--list">
          <li className="text-default">
            The promotions <span className="title-default"> cannot </span> be combined together on the same product.
            They will only be chosen 1, depending on the priority and the most valuable discounted.
          </li>
        </ul>
      </div>

      {/* Example: */}
      <ExampleInstruction type={TYPE_EXAMPLE.PRODUCT} language={languageCode.en} />

      <div className="wrapper-content wrapper-content--rg-12">
        <ul className="wrapper-content wrapper-content--list">
          <li className="text-default">
            If we configured <span className="title-success"> {translatedData.on} </span> (mean ALLOW to combine
            promotions together)
            {" -> "} The Buyer will get all discounts on the product Coffee
            <span className="title-default"> {translatedData.and} </span> all discounts on product Milk tea:
          </li>
        </ul>
        <div className="wrapper-content wrapper-content--rg-12" style={{ paddingLeft: "50px" }}>
          <span className="title-primary">
            Total discount amount on product Coffee =
            <span className="text-primary">
              {" 20.000đ + (20% x "}
              <TooltipPromotionConfig
                text="80.000đ "
                textTooltip={
                  <>
                    100.000đ - 20.000đ = 80.000đ
                    <br />
                    {translatedData.discountAmountThenPercent}
                  </>
                }
                className="text-primary"
              />
              {" ) + (50% x "}
              <TooltipPromotionConfig
                text="80.000đ "
                textTooltip={
                  <>
                    100.000đ - 20.000đ = 80.000đ
                    <br />
                    {translatedData.discountAmountThenPercent}
                  </>
                }
                className="text-primary"
              />
              {") "}
            </span>
            = 76.000đ
          </span>
          <span className="title-primary">
            Total discount amount on product Milk tea =
            <span className="text-primary">
              {" [20.000đ + (50% x"}
              <TooltipPromotionConfig
                text="80.000đ "
                textTooltip={
                  <>
                    100.000đ - 20.000đ = 80.000đ
                    <br />
                    {translatedData.discountAmountThenPercent}
                  </>
                }
                className="text-primary"
              />
              {" )] x 2 "}
            </span>
            {" = 120.000đ"}
          </span>
          <span className="title-danger">
            {"=>"} Total discount amount for the ORDER =<span className="text-danger"> 76.000đ + 120.000đ </span>=
            196.000đ
          </span>
        </div>
      </div>
      <div className="wrapper-content wrapper-content--rg-12">
        <ul className="wrapper-content wrapper-content--list">
          <li className="text-default">
            If we configured <span className="title-danger"> {translatedData.off} </span> (mean DO NOT ALLOW to combine
            promotions together) {"->"} The Buyer will get only 1 highest discounted promotion for product Coffee
            <span className="title-default"> {translatedData.and} </span> only 1 highest discounted promotion for
            product Milk tea:
          </li>
        </ul>
        <div className="wrapper-content wrapper-content--rg-12" style={{ paddingLeft: "50px" }}>
          <span className="title-primary">
            Total discount amount on product Coffee =<span className="text-primary"> (50% x 100.000đ) </span> = 50.000đ
          </span>
          <span className="title-primary">
            Total discount amount on product Milk tea =<span className="text-primary"> (50% x 100.000đ) x 2 </span> =
            100.000đ
          </span>
          <span className="title-danger">
            {"=>"} Total discount amount for the ORDER =<span className="text-danger"> 50.000đ + 100.000đ </span>=
            150.000đ
          </span>
        </div>
      </div>
    </>
  );
}

export default ApplyProductEN;
