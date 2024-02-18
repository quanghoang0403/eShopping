import { Col, Row } from "antd";
import Text from "antd/lib/typography/Text";
import { FnbUploadImageComponent } from "components/fnb-upload-image/fnb-upload-image.component";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./fnb-image-select.component.scss";

const { forwardRef, useImperativeHandle } = React;
export const FnbImageSelectComponent = forwardRef((props, ref) => {
  const {
    className,
    onChange,
    value,
    maxFileSize = 5242880,
    isShowBestDisplay = true,
    messageTooBigSize = "messages.imageSizeTooBig",
    messageErrorFormat = "messages.acceptFileImageTypes",
    acceptType,
    bestDisplayImage,
    customTextNonImageClass,
    customNonImageClass,
    isDisabled,
    isShowMessageError = false
  } = props;
  const [t] = useTranslation();
  const fnbUploadRef = React.useRef();
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useImperativeHandle(ref, () => ({
    setImageUrl(url) {
      setImageUrl(url);
    },
    getImageUrl() {
      return selectedImage ?? "";
    },
  }));

  const pageData = {
    addFromUrl: t("material.addFromUrl"),
    uploadImage: t("material.addFile"),
    textNonImage: t("media.textNonImageExtension"),
    bestDisplayImage: t("messages.imageBestDisplay"),
  };

  useEffect(() => {
    setImageUrl(value);
  }, []);

  const setImageUrl = (url) => {
    if (fnbUploadRef && fnbUploadRef.current && url) {
      fnbUploadRef.current.setImage(url);
      setSelectedImage(url);
    }
  };

  const onClickUploadImage = (file) => {
    if (onChange) {
      onChange(file?.url);
    }
    setSelectedImage(file != null ? file?.url : null);
    setErrorMessage(null);
  };

  const onShowErrorMessage = (errors, files) => {
    if (errors.maxFileSize === true) {
      setErrorMessage(t(messageTooBigSize));
    }
    else if (errors.acceptType === true) {
      setErrorMessage(t(messageErrorFormat));
    }
  };

  return (
    <div className="fnb-image-select ">
      <Row className={`non-image ${(isShowMessageError && errorMessage) && "border-error"} ${selectedImage !== null ? "have-image" : ""}`}>
        <Col
          span={24}
          className={`${customNonImageClass} image-product ${selectedImage !== null ? "justify-left" : ""}`}
        >
          <div style={{ display: "flex" }}>
            <FnbUploadImageComponent
              className={className}
              ref={fnbUploadRef}
              buttonText={pageData.uploadImage}
              onChange={onClickUploadImage}
              maxFileSize={maxFileSize}
              messageTooBigSize={messageTooBigSize}
              messageErrorFormat={messageErrorFormat}
              acceptType={acceptType}
              isDisabled={isDisabled}
              onError={isShowMessageError ? onShowErrorMessage : undefined}
            />
            <a className="upload-image-url" hidden={selectedImage !== null ? true : false}>
              {pageData.addFromUrl}
            </a>
          </div>
        </Col>
        <Col
          span={24}
          className={`${customTextNonImageClass} text-non-image ${isShowMessageError ? "border-error" : ""}`}
          hidden={selectedImage !== null ? true : false}
        >
          <div>{pageData.textNonImage}</div>
          <div> {isShowBestDisplay && (bestDisplayImage ?? pageData.bestDisplayImage)}</div>
        </Col>
      </Row>
      {
        (isShowMessageError && errorMessage) && 
        <div class="ant-form-item-explain-error">{errorMessage}</div>
      }
    </div>
  );
});
