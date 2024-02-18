import { languageCode } from "../../../../../../constants/language.constants";
import TooltipPromotionConfig from "../tooltipPromotionConfig.component";
import { useTranslation } from "react-i18next";
import ExampleInstruction, { TYPE_EXAMPLE } from "../example-intruction/index.component";

function ApplyProductVI() {
  const [t] = useTranslation();
  const translatedData = {
    on: t("promotion.promotionSetting.on"),
    off: t("promotion.promotionSetting.off"),
    and: t("promotion.promotionSetting.and"),
    discountAmountThenPercent: t("promotion.promotionSetting.discountAmountThenPercent"),
    flashSaleTooltip: t("promotion.promotionSetting.flashSaleTooltip"),
  };
  return (
    <>
      {/* ON */}
      <div className="wrapper-content wrapper-content--rg-12">
        <span className="title-danger">{translatedData.on}</span>
        <ul className="wrapper-content wrapper-content--rg-12 wrapper-content--list">
          <li className="text-default">
            Các chương trình khuyến mãi <span className="title-default"> có thể </span> kết hợp với nhau trên cùng 1 sản
            phẩm (không bao gồm
            <TooltipPromotionConfig
              text=" sản phẩm Flash sale"
              textTooltip={translatedData.flashSaleTooltip}
              className="title-primary"
            />
            )
          </li>
        </ul>
      </div>
      {/* Off */}
      <div className="wrapper-content wrapper-content--rg-12">
        <span className="title-danger">{translatedData.off}</span>
        <ul className="wrapper-content wrapper-content--rg-12 wrapper-content--list">
          <li className="text-default">
            Các chương trình khuyến mãi <span className="title-default"> không thể </span> kết hợp với nhau trên cùng
            một sản phẩm. Chúng sẽ chỉ được chọn 1, tùy theo chiết khấu có giá trị nhất
          </li>
        </ul>
      </div>

      {/* Example: */}
      <ExampleInstruction type={TYPE_EXAMPLE.PRODUCT} language={languageCode.vi} />

      <div className="wrapper-content wrapper-content--rg-12">
        <ul className="wrapper-content wrapper-content--list">
          <li className="text-default">
            Nếu cấu hình
            <span className="title-success"> {translatedData.on} </span> (nghĩa là cho phép kết hợp khuyến mãi)
            {" -> "} Người mua hàng sẽ nhận được toàn bộ khuyến mãi trên món Cà phê
            <span className="title-default"> {translatedData.and} </span> toàn bộ khuyến mãi trên món Trà sữa này:
          </li>
        </ul>
        <div className="wrapper-content wrapper-content--rg-12" style={{ paddingLeft: "50px" }}>
          <span className="title-primary">
            Tổng giảm giá cho món Cà phê =
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
            Tổng giảm giá cho món Trà sữa =
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
            {"=>"} Tổng giảm giá cho ĐƠN HÀNG =<span className="text-danger"> 76.000đ + 120.000đ </span>= 196.000đ
          </span>
        </div>
      </div>
      <div className="wrapper-content wrapper-content--rg-12">
        <ul className="wrapper-content wrapper-content--list">
          <li className="text-default">
            Nếu cấu hình <span className="title-danger"> {translatedData.off} </span> (nghĩa là KHÔNG cho phép kết hợp
            khuyến mãi) {"->"} Người mua hàng sẽ chỉ nhận được 1 khuyến mãi cao nhất cho món Cà phê
            <span className="title-default"> {translatedData.and} </span> 1 khuyến mãi cao nhất cho món Trà Sữa thôi:
          </li>
        </ul>
        <div className="wrapper-content wrapper-content--rg-12" style={{ paddingLeft: "50px" }}>
          <span className="title-primary">
            Tổng giảm giá cho món Cà phê =<span className="text-primary"> (50% x 100.000đ) </span> = 50.000đ
          </span>
          <span className="title-primary">
            Tổng giảm giá cho món Trà sữa =<span className="text-primary"> (50% x 100.000đ) x 2 </span> = 100.000đ
          </span>
          <span className="title-danger">
            {"=>"} Tổng giảm giá cho ĐƠN HÀNG =<span className="text-danger"> 50.000đ + 100.000đ </span>= 150.000đ
          </span>
        </div>
      </div>
    </>
  );
}

export default ApplyProductVI;
