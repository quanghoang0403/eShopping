import { languageCode } from "../../../../../../constants/language.constants";
import ExampleInstruction, { TYPE_EXAMPLE } from "../example-intruction/index.component";
import TooltipPromotionConfig from "../tooltipPromotionConfig.component";
import { useTranslation } from "react-i18next";

function ApplyOrderVI() {
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
            Nhiều chương trình khuyến mãi
            <span className="title-default"> có thể </span> kết hợp với nhau trên 1 đơn hàng
          </li>
        </ul>
      </div>
      {/* Off */}
      <div className="wrapper-content wrapper-content--rg-12">
        <span className="title-danger">{translatedData.off}</span>
        <ul className="wrapper-content wrapper-content--rg-12 wrapper-content--list">
          <li className="text-default">
            Toàn bộ đơn hàng sẽ chỉ được áp dụng<span className="title-default"> 1 khuyến mãi </span> duy nhất, tùy theo
            mức giảm giá có giá trị nhất.
          </li>
        </ul>
      </div>

      {/* Example: */}
      <ExampleInstruction type={TYPE_EXAMPLE.ORDER} language={languageCode.vi} />

      <div className="wrapper-content wrapper-content--rg-12">
        <ul className="wrapper-content wrapper-content--list">
          <li className="text-default">
            Nếu cấu hình <span className="title-success"> {translatedData.on} </span> (nghĩa là cho phép kết hợp khuyến
            mãi)
            {" -> "} Người mua hàng sẽ nhận được toàn bộ khuyến mãi trên Tổng bill (được áp dụng khuyến mãi 3 và 4):
          </li>
        </ul>
        <div className="wrapper-content wrapper-content--rg-12" style={{ paddingLeft: "50px" }}>
          <span className="title-success">
            Giảm giá cho Tổng đơn =
            <span className="text-success">
              {" "}
              20.000đ + (
              <TooltipPromotionConfig
                text="280.000đ "
                textTooltip={
                  <>
                    300.000đ - 20.000đ = 280.000đ <br />
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
            <span className="text-default"> {"=> "}</span> Tổng giảm giá cho ĐƠN HÀNG = 76.000đ
          </span>
        </div>
      </div>
      <div className="wrapper-content wrapper-content--rg-12">
        <ul className="wrapper-content wrapper-content--list">
          <li className="text-default">
            Nếu cấu hình <span className="title-danger">{translatedData.off}</span> (nghĩa là KHÔNG cho phép kết hợp
            khuyến mãi) {"->"} Người mua hàng sẽ chỉ nhận được 1 khuyến mãi cao nhất cho tổng bill là 20% thôi:
          </li>
        </ul>
        <div className="wrapper-content wrapper-content--rg-12" style={{ paddingLeft: "50px" }}>
          <span className="title-danger">
            <span className="text-default"> {"=> "}</span> Tổng giảm giá cho ĐƠN HÀNG ={" "}
            <span className="text-danger"> 300.000 x 20% </span>= 60.000đ
          </span>
        </div>
      </div>
    </>
  );
}

export default ApplyOrderVI;
