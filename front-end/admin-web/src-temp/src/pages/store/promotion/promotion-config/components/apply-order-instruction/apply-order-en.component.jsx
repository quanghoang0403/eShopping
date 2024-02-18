import { languageCode } from "../../../../../../constants/language.constants";
import ExampleInstruction, { TYPE_EXAMPLE } from "../example-intruction/index.component";
import TooltipPromotionConfig from "../tooltipPromotionConfig.component";
import { useTranslation } from "react-i18next";

function ApplyOrderEN() {
  const [t] = useTranslation();
  const translatedData = {
    on: t("promotion.promotionSetting.on"),
    off: t("promotion.promotionSetting.off"),
    discountAmountThenPercent: t("promotion.promotionSetting.discountAmountThenPercent"),
  };
  return (
    <>
      {/* ON */}
      <div className="wrapper-content wrapper-content--rg-12">
        <span className="title-danger">{translatedData.on}</span>
        <ul className="wrapper-content wrapper-content--rg-12 wrapper-content--list">
          <li className="text-default">
            Multiple promotions <span className="title-default"> can </span> combie together in 1 order
          </li>
        </ul>
      </div>
      {/* Off */}
      <div className="wrapper-content wrapper-content--rg-12">
        <span className="title-danger">{translatedData.off}</span>
        <ul className="wrapper-content wrapper-content--rg-12 wrapper-content--list">
          <li className="text-default">
            Only <span className="title-default"> 1 promotion </span> can be applied to the entire order, the promotion
            that has the highest discount value will be applied.
          </li>
        </ul>
      </div>

      {/* Example: */}
      <ExampleInstruction type={TYPE_EXAMPLE.ORDER} language={languageCode.en} />

      <div className="wrapper-content wrapper-content--rg-12">
        <ul className="wrapper-content wrapper-content--list">
          <li className="text-default">
            If we configured <span className="title-success"> ON </span> (mean ALLOW to combine promotions together)
            {" -> "} The Buyer will get all discounts on the Total bill:
          </li>
        </ul>
        <div className="wrapper-content wrapper-content--rg-12" style={{ paddingLeft: "50px" }}>
          <span className="title-success">
            Discount on the Total bill ={" "}
            <span className="text-success">
              {" "}
              20.000đ + (
              <TooltipPromotionConfig
                text="280.000đ "
                textTooltip={
                  <>
                    300.000đ- 20.000đ = 280.000đ <br />
                    {translatedData.discountAmountThenPercent}
                  </>
                }
                className="text-success"
              />
              x 20%)
            </span>{" "}
            = 76.000đ
          </span>
          <span className="title-danger">
            <span className="text-default"> {"=> "}</span> Total discount amount for the ORDER = 76.000
          </span>
        </div>
      </div>
      <div className="wrapper-content wrapper-content--rg-12">
        <ul className="wrapper-content wrapper-content--list">
          <li className="text-default">
            If we configured <span className="title-danger">OFF</span> (mean DO NOT ALLOW to combine promotions
            together) {"->"} The Buyer will get only 1 promotion for Total bill, the highest discount value will be
            apply (in above sample: the promotion 20% will be applied)
          </li>
        </ul>
        <div className="wrapper-content wrapper-content--rg-12" style={{ paddingLeft: "50px" }}>
          <span className="title-danger">
            <span className="text-default"> {"=> "}</span> Total discount amount for the ORDER ={" "}
            <span className="text-danger"> 300.000 x 20% </span>= 60.000đ
          </span>
        </div>
      </div>
    </>
  );
}

export default ApplyOrderEN;
