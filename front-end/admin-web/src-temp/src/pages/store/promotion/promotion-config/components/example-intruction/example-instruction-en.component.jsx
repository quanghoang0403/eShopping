import { useTranslation } from "react-i18next";

function ExampleInstructionEN(props) {
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
          <span className="title-warning">1. Product Coffee has price = 100.000đ</span>
          <ul className="wrapper-content wrapper-content--rg-10 wrapper-content--list">
            <li className="text-default">There are 2 discount Codes applying to the product Coffee</li>
            <div className="wrapper-content wrapper-content--direction-row wrapper-content--cg-75">
              <div
                className="wrapper-content wrapper-content--rg-10"
                style={{ paddingLeft: "24px", minWidth: "250px" }}
              >
                <span className="text-default">
                  Code<span className="title-primary"> FREESHIP</span>
                </span>
                <span className="text-default">
                  Code<span className="title-primary"> NEW</span>
                </span>
              </div>
              <div className="wrapper-content wrapper-content--rg-10">
                <span className="title-primary discount-value">-20.000đ</span>
                <span className="title-primary discount-value">-20%</span>
              </div>
            </div>
            <li className="text-default">There is 1 normal discount campaign applying to the product Coffee</li>
            <div className="wrapper-content wrapper-content--direction-row wrapper-content--cg-75">
              <div
                className="wrapper-content wrapper-content--rg-10"
                style={{ paddingLeft: "24px", minWidth: "250px" }}
              >
                <span className="text-default">
                  Campaign <span className="title-primary"> Energy day</span>
                </span>
              </div>
              <div className="wrapper-content wrapper-content--rg-10">
                <span className="title-primary discount-value">-50%</span>
              </div>
            </div>
          </ul>
        </div>
        <div className="wrapper-content wrapper-content--rg-10">
          <span className="title-warning">2. Product Milk tea has price = 100.000đ</span>
          <ul className="wrapper-content wrapper-content--rg-10 wrapper-content--list">
            <li className="text-default">There is 1 discount Code applying to the product Milk tea</li>
            <div className="wrapper-content wrapper-content--direction-row wrapper-content--cg-75">
              <div
                className="wrapper-content wrapper-content--rg-10"
                style={{ paddingLeft: "24px", minWidth: "250px" }}
              >
                <span className="text-default">
                  Code<span className="title-primary"> FREESHIP</span>
                </span>
              </div>
              <div className="wrapper-content wrapper-content--rg-10">
                <span className="title-primary discount-value">-20.000đ</span>
              </div>
            </div>
            <li className="text-default">There is 1 normal discount campaign applying to the product Milk tea</li>
            <div className="wrapper-content wrapper-content--direction-row wrapper-content--cg-75">
              <div
                className="wrapper-content wrapper-content--rg-10"
                style={{ paddingLeft: "24px", minWidth: "250px" }}
              >
                <span className="text-default">
                  Campaign<span className="title-primary"> Energy day</span>
                </span>
              </div>
              <div className="wrapper-content wrapper-content--rg-10">
                <span className="title-primary discount-value">-50%</span>
              </div>
            </div>
          </ul>
        </div>
        {type === TYPE_EXAMPLE.PRODUCT || type === TYPE_EXAMPLE.BOTH ? (
          <span className="title-warning">
            3. Shop has another discount campaign <span className="title-primary"> Total bill = 20%</span>
          </span>
        ) : (
          <></>
        )}
        {type === TYPE_EXAMPLE.ORDER ? (
          <span className="title-warning">
            3. Shop has a discount campaign on Total bill <span className="title-primary"> Total bill = 20%</span>
          </span>
        ) : (
          <></>
        )}

        {type === TYPE_EXAMPLE.ORDER || type === TYPE_EXAMPLE.BOTH ? (
          <span className="title-warning">
            4. Shop has a discount campaign on Total bill
            <span className="title-primary"> DISCOUNT20K = 20.000đ</span>
          </span>
        ) : (
          <></>
        )}
      </div>
      <div className="wrapper-content wrapper-content--rg-12">
        <span className="title-danger">Buyer add (1) item Coffee + (2) items Milk tea to Cart:</span>
        <span className="text-default">
          {"=>"} <span className="title-default">SUBTOTAL </span>(before discounted) = (100.000đ x 1 + 100.000đ x 2) ={" "}
          <span className="title-default">300.000đ</span>
        </span>
      </div>
    </>
  );
}

export default ExampleInstructionEN;
