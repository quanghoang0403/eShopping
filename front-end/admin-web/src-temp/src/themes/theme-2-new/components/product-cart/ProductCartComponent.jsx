import { Col, Row } from "antd";
import { AddToCartInStoreIcon } from "../../assets/icons.constants";
import productDefaultImage from "../../assets/images/product-default-img-none-radius.png";
import RatingIcon from "../../assets/images/product_star_rating.svg";
import UnRatingIcon from "../../assets/images/product_star_unrating.svg";
import DisplayImageComponent from "../display-image/DisplayImageComponent";
import "./ProductCartComponent.scss";

export default function ProductCartComponent(props) {
  const { data, onClick, onClickTitle } = props;
  const isShowSellingPrice = data?.originalPrice !== data.sellingPrice;

  function handleOnClick() {
    if (onClick) {
      onClick();
    }
  }

  const colorGroup = {
    id: "332c77be-1174-4859-8187-f01e0c40cb59",
    name: "Color Group Default",
    titleColor: "rgba(219,77,41,1)",
    textColor: "rgba(0, 0, 0, 1)",
    buttonBackgroundColor: "rgba(219,77,41,1)",
    buttonTextColor: "rgba(255,255,255,1)",
    buttonBorderColor: "transparent",
    isDefault: true,
  };

  if (!data) return <></>;

  const N_RATING = 5;

  const rateProduct = (rating) => {};

  function formatCurrency(amount) {
    const numericAmount = parseInt(amount);
    var formattedAmount = numericAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    formattedAmount += "đ";

    return formattedAmount;
  }

  function generateRatingImages(N_RATING, data, RatingIcon, UnRatingIcon, rateProduct) {
    const ratingImages = [];

    for (let i = 1; i <= 5; i++) {
      ratingImages.push(
        <img
          key={i}
          src={N_RATING >= i ? RatingIcon : UnRatingIcon}
          alt={data?.description}
          style={{ cursor: "pointer" }}
          className="customize-rating"
          onClick={() => rateProduct(i)}
        />,
      );
    }

    return ratingImages;
  }

  function handleOnClickTitle() {
    if (onClickTitle) {
      onClickTitle();
    }
  }

  return (
    <div className="product-cart">
      <DisplayImageComponent
        className="fnb-display-image"
        src={Boolean(data?.thumbnail) ? data?.thumbnail : productDefaultImage}
        isFlashSale={data?.isFlashSale}
        isPromotion={Boolean(data?.promotionTag)}
        promotionTitle={data?.promotionTag}
        onClick={handleOnClickTitle}
      />
      <Row className="content">
        <Col className="product-rating">
          {N_RATING >= 1 && generateRatingImages(N_RATING, data, RatingIcon, UnRatingIcon, rateProduct)}
        </Col>
        <Col className="title" onClick={handleOnClickTitle}>
          {data?.name}
        </Col>
        <Col className="product-description">{data?.description}</Col>
        <Col span={12} className="price">
          {isShowSellingPrice ? (
            <div className="price-container">
              <div className="original-price">{formatCurrency(data?.originalPrice)}</div>
              <div className="selling-price">{formatCurrency(data?.sellingPrice)}</div>
            </div>
          ) : (
            <div className="original-price"></div>
          )}
          {!isShowSellingPrice ? (
            <div className="price-container">
              <div className="selling-price center">{formatCurrency(data?.sellingPrice)}</div>
            </div>
          ) : (
            <div></div>
          )}
        </Col>
        <Col span={12} className="button">
          <div onClick={handleOnClick}>
            <AddToCartInStoreIcon
              style={{
                fill: colorGroup?.buttonTextColor,
                backgroundColor: colorGroup?.buttonBackgroundColor,
                borderColor: colorGroup?.buttonBorderColor ? colorGroup?.buttonBorderColor : undefined,
                borderWidth: colorGroup?.buttonBorderColor ? 1 : undefined,
              }}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}
