import { Col, Row } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { themeConfigSelector } from "../../../modules/session/session.reducers";
import posCartService from "../../../services/pos/pos-cart.services";
import { ArrowLeftIcon, CartIcon, CloseIcon } from "../../assets/icons.constants";
import DefaultLogo from "../../assets/images/coffee-mug-logo.png";
import ImageWithFallback from "../fnb-image-with-fallback/fnb-image-with-fallback.component";
import "./MinHeader.scss";

function MinHeader(props) {
  const posCartItems = useSelector((state) => state?.session?.posCartItems);
  const themeConfig = useSelector(themeConfigSelector);
  const history = useHistory();

  const {
    className = "",
    addonBefore = (
      <ArrowLeftIcon
        className="arrow-left-icon cursor-pointer"
        onClick={() => {
          history.goBack();
        }}
      />
    ),
    addonBetween = (
      <ImageWithFallback
        src={themeConfig?.general?.header?.logoUrl ?? DefaultLogo}
        alt="icon"
        fallbackSrc={DefaultLogo}
        className="logo-original-theme"
      />
    ),
    addonAfter = (
      <>
        <div className="cart-in-header">
          <a href={"/pos-cart"}>
            {posCartItems && posCartItems?.length > 0 && (
              <div className="cart-quantity" id="cart-quantity">
                {posCartItems?.reduce((a, v) => (a = a + v?.quantity ?? 0), 0)}
              </div>
            )}
            <CartIcon className="cart-icon" />
          </a>
        </div>
        <CloseIcon className="close-icon cursor-pointer" onClick={closePage} />
      </>
    ),
  } = props;

  function closePage() {
    posCartService.cleanPOSCartAsync(history.push("./"));
  }

  return (
    <Row className={`min-header ${className}`}>
      <Col xs={8} className="addon-before">
        {addonBefore}
      </Col>
      <Col xs={8} className="addon-between">
        {addonBetween}
      </Col>
      <Col xs={8} className="addon-after">
        {addonAfter}
      </Col>
    </Row>
  );
}

export default React.memo(MinHeader, (prevProps, nextProps) => true);
