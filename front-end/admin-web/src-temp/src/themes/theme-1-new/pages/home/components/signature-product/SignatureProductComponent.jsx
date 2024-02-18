import React from "react";
import { handleHyperlinkValue } from "../../../../../utils/helpers";
import { Col, Row } from "antd";
import { SignatureProductIcon } from "../../../../assets/icons.constants";
import { useMediaQuery } from "react-responsive";

const SignatureProductComponent = (props) => {
  const { index, title, description, buttonText, imageUrl, hyperlinkValue, hyperlinkType } = props;
  
  const handleHyperlink = (hyperlinkType, hyperlinkValue) => {
    if (hyperlinkType) {
      window.location.href = handleHyperlinkValue(hyperlinkType, hyperlinkValue);
    }
  };
  const isMaxWidth575 = useMediaQuery({ maxWidth: 575 });

  return (
    <Row className="signature-product-container main-session">
      {isMaxWidth575 ? (
        <Row className="signature-product-mobile">
          <SignatureProductIcon />
        </Row>
      ) : (
        <Col className="signature-product-image">
          <img src={imageUrl} alt="Signature" />
        </Col>
      )}

      <Col className="signature-product-info">
        {isMaxWidth575 ? (
          <Col className="signature-product-image">
            <img src={imageUrl} alt="Signature" />
          </Col>
        ) : (
          <Row className="signature-product">
            <SignatureProductIcon />
          </Row>
        )}
        <Row className="signature-product-title">{title}</Row>
        <Row id={`signature-product-description-${index}`} className="signature-product-description">
          {description} 
        </Row>
        <Row className="try-now-btn">
          <button className="signature-product-btn" onClick={() => handleHyperlink(hyperlinkType, hyperlinkValue)}>
            <span className="text-line-clamp-1">{buttonText}</span>
          </button>
        </Row>
      </Col>
    </Row>
  );
};

export default SignatureProductComponent;
