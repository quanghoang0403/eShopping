import { languageCode } from "../../../../../../constants/language.constants";
import TooltipPromotionConfig from "../tooltipPromotionConfig.component";
import { useTranslation } from "react-i18next";
import ExampleInstruction, { TYPE_EXAMPLE } from "../example-intruction/index.component";

function ApplyBothEN() {
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
            The promotions for <span className="title-default">Product:</span> CAN be combined together on
            <span className="title-default"> the same product </span>
            {"("}not including the
            <TooltipPromotionConfig
              text=" Flash sales product"
              textTooltip={translatedData.flashSaleTooltip}
              className="title-primary"
            />
            {")"}
          </li>
          <li className="text-default">
            The promomtions for the <span className="title-default">Total bill:</span> CAN be combined to gether in
            <span className="title-default"> 1 order</span>
          </li>
        </ul>
      </div>
      {/* Off */}
      <div className="wrapper-content wrapper-content--rg-12">
        <span className="title-danger">{translatedData.off}</span>
        <ul className="wrapper-content wrapper-content--rg-12 wrapper-content--list">
          <li className="text-default">
            The promotions for <span className="title-default">Product:</span> CANNOT be combined together on the same
            product. The promotion that has the highest discount value will be applied.
          </li>
          <li className="text-default">
            The promotions for <span className="title-default">Total bill:</span> CANNOT be combined together on the
            entire order. The promotion that has the highest discount value will be applied.
          </li>
        </ul>
      </div>

      {/* Example: */}
      <ExampleInstruction type={TYPE_EXAMPLE.BOTH} language={languageCode.en} />

      <div className="wrapper-content wrapper-content--rg-12">
        <ul className="wrapper-content wrapper-content--list">
          <li className="text-default">
            If we configured <span className="title-success"> {translatedData.on} </span> (mean ALLOW to combine
            promotions together)
            {"->"} The Buyer will get all discounts on the product Coffee
            <span className="title-default"> {translatedData.and} </span>
            all discounts on the product Milk tea <span className="title-default"> {translatedData.and} </span> all
            discounts on the Total bill:
          </li>
        </ul>
        <div className="wrapper-content wrapper-content--rg-12" style={{ paddingLeft: "50px" }}>
          <span className="title-primary">
            Total discount amount on product Coffee =
            <span className="text-primary">
              {" "}
              20.000đ + {"("}20% x
              <TooltipPromotionConfig
                text=" 80.000đ "
                textTooltip={
                  <>
                    100.000đ - 20.000đ = 80.000đ <br />
                    {translatedData.discountAmountThenPercent}
                  </>
                }
                className="text-primary"
              />
              {") "} + (50% x
              <TooltipPromotionConfig
                text=" 80.000đ "
                textTooltip={
                  <>
                    100.000đ - 20.000đ = 80.000đ <br />
                    {translatedData.discountAmountThenPercent}
                  </>
                }
                className="text-primary"
              />
              )
            </span>{" "}
            = 76.000đ
          </span>
          <span className="title-primary">
            Total discount amount on product Milk tea =
            <span className="text-primary">
              {" [20.000đ + (50% x"}
              <TooltipPromotionConfig
                text=" 80.000đ "
                textTooltip={
                  <>
                    100.000đ - 20.000đ = 80.000đ <br />
                    {translatedData.discountAmountThenPercent}
                  </>
                }
                className="text-primary"
              />
              {" )] x 2 "}
            </span>
            {"= 120.000đ "}
          </span>
          <span className="title-success">
            {"Discount on the Total bill ="}
            <span className="text-success">
              {"  20.000đ + ("}
              <TooltipPromotionConfig
                text="280.000đ "
                textTooltip={
                  <>
                    {"300.000đ - 20.000đ = 280.000đ"}
                    <br />
                    {translatedData.discountAmountThenPercent}
                  </>
                }
                className="text-success"
              />
              {"  - 76.000đ - 120.000đ) x 20%"}
            </span>
            {" = 36.800đ"}
          </span>
          <span className="title-danger">
            {"=> Total discount amount for the ORDER ="}
            <span className="text-danger"> {" 76.000đ + 120.000đ + 36.800đ "} </span>
            {" = 232.800đ"}
          </span>
        </div>
      </div>
      <div className="wrapper-content wrapper-content--rg-12">
        <ul className="wrapper-content wrapper-content--list">
          <li className="text-default">
            If we configured <span className="title-danger"> {translatedData.off} </span>(mean DO NOT ALLOW to combine
            promotions together) {"->"} The Buyer will get only 1 highest discounted promotion for the product Coffee{" "}
            <span className="title-default"> AND </span> only 1 highest discounted promotion for the product Milk tea{" "}
            <span className="title-default"> AND </span> only 1 highest discounted promotion for the Total bill:
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
          <span className="title-success">
            Discount on the Total bill =<span className="text-success"> (300.000đ - 50.000đ - 100.000đ) x 20% </span>=
            30.000đ
          </span>
          <span className="title-danger">
            {"=>"} Total discount amount for the ORDER =
            <span className="text-danger"> 50.000đ + 100.000đ + 30.000đ </span>= 180.000đ
          </span>
        </div>
      </div>
    </>
  );
}

export default ApplyBothEN;
