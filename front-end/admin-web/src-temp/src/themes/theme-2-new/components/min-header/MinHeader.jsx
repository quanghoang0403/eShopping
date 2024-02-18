import { Badge, Col, Row } from "antd";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import posCartService from "../../../services/pos/pos-cart.services";
import { ArrowBackIcon, CartStoreIcon, CloseHeaderIcon, DefaultStoreIcon } from "../../assets/icons.constants";
import defaultConfig from "../../default-store.config";
import ImageWithFallback from "../fnb-image-with-fallback/fnb-image-with-fallback.component";
import "./MinHeader.scss";

export default function MinHeader(props) {
  const themeConfig = useSelector((state) => state.session?.themeConfig);
  const groupColorConfig = themeConfig.general?.color?.colorGroups;
  const posCartItems = useSelector((state) => state.session?.posCartItems);
  const history = useHistory();

  const countCartItems = () => {
    let countItem = 0;
    Array.isArray(posCartItems) &&
      posCartItems?.forEach((e) => {
        countItem = countItem + e.quantity;
      });

    return countItem;
  };

  const StyledIconFill = styled.div`
    .icon-fill-color {
      path {
        fill: ${groupColorConfig?.titleColor};
      }
    }
  `;

  const {
    className = "",
    addonBefore = (
      <ArrowBackIcon
        className="arrow-left-icon cursor-pointer"
        onClick={() => {
          history.goBack();
        }}
      />
    ),
    addonBetween = (
      <ImageWithFallback
        src={themeConfig?.general?.header?.logoUrl ?? defaultConfig?.general?.header?.logoUrl}
        alt="icon"
        fallbackSrc={DefaultStoreIcon}
        className="logo-original-theme"
        style={{ width: "auto", height: "100%", maxWidth: "100%" }}
      />
    ),
    addonAfter = (
      <>
        <a className="pointer" role="button" style={{ marginRight: 20 }} href={"/pos-cart"}>
          <Badge count={countCartItems()} color="#ffffff" style={{ color: "#000000" }}>
            <StyledIconFill>
              <span className="icon-fill-color">
                <CartStoreIcon alt="cart-icon"></CartStoreIcon>
              </span>
            </StyledIconFill>
          </Badge>
        </a>
        <CloseHeaderIcon className="close-icon" onClick={closePage} />
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
