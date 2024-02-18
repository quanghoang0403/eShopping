import { useTranslation } from "react-i18next";

function ExampleInstructionVI(props) {
  const { type, TYPE_EXAMPLE } = props;
  const [t] = useTranslation();
  const translatedData = {
    example: t("promotion.promotionSetting.example"),
  };
  return (
    <>
      <div className="wrapper-content wrapper-content--rg-12">
        <span className="title-default">{translatedData.example}:</span>
        <div className="wrapper-content wrapper-content--rg-10">
          <span className="title-warning">1. Món Cà phê có giá = 100.000đ</span>
          <ul className="wrapper-content wrapper-content--rg-10 wrapper-content--list">
            <li className="text-default">Có 2 mã khuyến mãi đang được áp dụng trên món Cà phê</li>
            <div className="wrapper-content wrapper-content--direction-row wrapper-content--cg-75">
              <div
                className="wrapper-content wrapper-content--rg-10"
                style={{ paddingLeft: "24px", minWidth: "320px" }}
              >
                <span className="text-default">
                  Mã<span className="title-primary"> FREESHIP</span>
                </span>
                <span className="text-default">
                  Mã<span className="title-primary"> MONMOI </span>
                </span>
              </div>
              <div className="wrapper-content wrapper-content--rg-10">
                <span className="title-primary discount-value">-20.000đ</span>
                <span className="title-primary discount-value">-20%</span>
              </div>
            </div>
            <li className="text-default">
              Có 1 chương trình khuyến mãi thông thường đang được áp dụng trên món Cà phê
            </li>
            <div className="wrapper-content wrapper-content--direction-row wrapper-content--cg-75">
              <div
                className="wrapper-content wrapper-content--rg-10"
                style={{ paddingLeft: "24px", minWidth: "320px" }}
              >
                <span className="text-default">
                  Chương trình <span className="title-primary"> Ngày mới năng lượng</span>
                </span>
              </div>
              <div className="wrapper-content wrapper-content--rg-10">
                <span className="title-primary discount-value">-50%</span>
              </div>
            </div>
          </ul>
        </div>
        <div className="wrapper-content wrapper-content--rg-10">
          <span className="title-warning">2. Món Trà sữa có giá = 100.000đ</span>
          <ul className="wrapper-content wrapper-content--rg-10 wrapper-content--list">
            <li className="text-default">Có 1 mã khuyến mãi đang được áp dụng trên món Trà sữa</li>
            <div className="wrapper-content wrapper-content--direction-row wrapper-content--cg-75">
              <div
                className="wrapper-content wrapper-content--rg-10"
                style={{ paddingLeft: "24px", minWidth: "320px" }}
              >
                <span className="text-default">
                  Mã<span className="title-primary"> FREESHIP</span>
                </span>
              </div>
              <div className="wrapper-content wrapper-content--rg-10">
                <span className="title-primary discount-value">-20.000đ</span>
              </div>
            </div>
            <li className="text-default">
              Có 1 chương trình khuyến mãi thông thường đang được áp dụng trên món Trà sữa
            </li>
            <div className="wrapper-content wrapper-content--direction-row wrapper-content--cg-75">
              <div
                className="wrapper-content wrapper-content--rg-10"
                style={{ paddingLeft: "24px", minWidth: "320px" }}
              >
                <span className="text-default">
                  Chương trình<span className="title-primary"> Ngày mới năng lượng</span>
                </span>
              </div>
              <div className="wrapper-content wrapper-content--rg-10">
                <span className="title-primary discount-value">-50%</span>
              </div>
            </div>
          </ul>
        </div>
        <span className="title-warning">
          3. Cửa hàng có khuyến mãi <span className="title-primary"> Tổng bill = 20%</span>
        </span>

        {type === TYPE_EXAMPLE.ORDER || type === TYPE_EXAMPLE.BOTH ? (
          <span className="title-warning">
            4. Cửa hàng có mã giảm giá trên Tổng bill
            <span className="title-primary"> GIAM20K = 20.000đ</span>
          </span>
        ) : (
          <></>
        )}
      </div>
      <div className="wrapper-content wrapper-content--rg-12">
        <span className="title-danger">Người mua thêm (1) phần Cà phê + (2) phần Trà sữa vào giỏ hàng: </span>
        <span className="text-default">
          {"=>"} <span className="title-default">TỔNG TẠM TÍNH </span> (trước giảm) = (100.000đ x 1 + 100.000đ x 2) ={" "}
          <span className="title-default">300.000đ</span>
        </span>
      </div>
    </>
  );
}

export default ExampleInstructionVI;
