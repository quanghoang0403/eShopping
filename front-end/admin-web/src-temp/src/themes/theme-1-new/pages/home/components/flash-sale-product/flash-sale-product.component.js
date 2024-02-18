import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { calculatePercentage, calculatePercentageFlashSale, formatTextNumber } from "../../../../../utils/helpers";
import { EnumFlashSaleStatus } from "../../../../constants/enums";
import fireImage from "../../../../assets/images/fire.png";
import productDefaultImage from "../../../../assets/images/product-default.png";
import "./flash-sale-product.component.scss";
export default function FlashSaleProductComponent(props) {
  const { product, index, flashSaleStatus } = props;
  const [t] = useTranslation();
  const translatedData = {
    ended: t("storeWebPage.flashSale.ended", "Ended"),
    endAfter: t("storeWebPage.flashSale.endAfter", "End after"),
    coming: t("storeWebPage.flashSale.coming", "Coming"),
    notOpenYet: t("storeWebPage.flashSale.notOpenYet", "Not open yet"),
    soldOut: t("storeWebPage.flashSale.soldOut", "Sold out"),
    remaining: t("storeWebPage.flashSale.remaining", "Remaining"),
  };
  useEffect(() => {
    if (flashSaleStatus === EnumFlashSaleStatus.FlashSaleIsHappening && product?.remainingQuantity > 0) {
      const progressBar = document.getElementById("quantity-bar-progress-" + index);
      const percentSold = (product?.remainingQuantity / product?.flashSaleQuantity) * 100;
      if (progressBar) {
        progressBar.style.background =
          "linear-gradient(90deg, #ffb909, #ff3a05 " + percentSold + "%, #ffd39f " + percentSold + "%, #ffd39f)";
      }
    }
  }, []);
  return (
    <>
      {product && (
        <a href={`./product-detail/${product?.id}`}>
          <div className="flash-sale-product">
            <div className="image">
              <div className="percent-label">-{calculatePercentageFlashSale(product?.sellingPrice, product?.originalPrice)}</div>
              <img src={Boolean(product?.thumbnail) ? product?.thumbnail : productDefaultImage} />
            </div>
            <div className="name">{product?.name}</div>
            <div className="content-bottom">
              <div className="price">
                <div className="selling-price">{formatTextNumber(product?.sellingPrice)}</div>
                <div className="original-price">{formatTextNumber(product?.originalPrice)}</div>
              </div>
              <div className="quantity-bar">
                {flashSaleStatus === EnumFlashSaleStatus.FlashSaleHasEnded ? (
                  <div className="ended">
                    <div className="quantity-bar-text">{translatedData.ended} </div>
                  </div>
                ) : flashSaleStatus === EnumFlashSaleStatus.FlashSaleIsHappening ? (
                  <>
                    {product?.remainingQuantity > 0 ? (
                      <>
                        <div className="fire">
                          <img src={fireImage}></img>
                        </div>
                        <div className="quantity-bar-progress" id={`quantity-bar-progress-${index}`}></div>
                        <div className="quantity-bar-text">{translatedData.remaining}</div>
                        <div className="quantity-bar-number">{formatTextNumber(product?.remainingQuantity)}</div>
                      </>
                    ) : (
                      <div className="sold-out">
                        <div className="quantity-bar-text">{translatedData.soldOut}</div>
                      </div>
                    )}
                  </>
                ) : flashSaleStatus === EnumFlashSaleStatus.FlashSaleIsComing ? (
                  <div className="quantity-bar-text">{translatedData.coming}</div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </a>
      )}
    </>
  );
}
