import { Col, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FnbUploadImageComponent } from "../fnb-upload-image/fnb-upload-image.component";
import "./fnb-upload-background-image-customize.scss";

export default function FnbUploadBackgroundImageCustomizeComponent(props) {
  const {
    bestDisplay,
    maxSizeUploadMb = 20,
    acceptType,
    value,
    onChange,
    defaultImage,
    updateErrorMessage = null,
    isRequired = false,
    isErrorShowed = false,
    setIsErrorShowed = null,
    imgFallbackDefault,
  } = props;
  const [t] = useTranslation();
  const { Text } = Typography;
  const [image, setImage] = useState(null);
  const [imageUploadError, setImageUploadError] = useState();
  const ref = React.useRef();
  const pageData = {
    upload: {
      addFromUrl: t("upload.addFromUrl"),
      textNonImage: t("media.textNonImage"),
      icoImage: t("media.icoImage", "Accepts images: ICO"),
    },
    uploadImage: t("productManagement.generalInformation.addFile"),
    pleaseUploadBackgroundImage: t("storeWebPage.header.pleaseUploadBackgroundImage"),
    fileSizeLimit: t("storeWebPage.header.fileSizeLimit"),
    bestDisplayMessage: `${t("storeWebPage.header.bestDisplay")} ${bestDisplay}`,
  };
  useEffect(() => {
    if (ref && ref.current && value) {
      ref.current.setImage(value);
      setImage(value);
    } else {
      if (value == null && defaultImage) {
        ref.current.setImage(defaultImage);
        setImage(defaultImage);
        onChange(defaultImage);
      }
    }
    if (window.isNotSelectAdvertisementBackground && isRequired == true) {
      setImageUploadError(pageData.pleaseUploadBackgroundImage);
    }
  }, [value]);

  const onChangeImage = (file) => {
    setImage(file);
    setImageUploadError();
    onChange(file?.url);
  };

  const uploadImageError = (errors) => {
    if (errors.maxFileSize === true) {
      if (setIsErrorShowed !== null) {
        setIsErrorShowed(false);
      }
      if (updateErrorMessage !== null) {
        updateErrorMessage(`${pageData.fileSizeLimit} ${maxSizeUploadMb}MB`);
      }
      setImageUploadError(`${pageData.fileSizeLimit} ${maxSizeUploadMb}MB`);
    }
  };

  return (
    <div>
      <Row className={`non-image ${image !== null ? "have-image" : ""}`}>
        <div className="uploadImageContent">
          <Col span={24} className={`image-product ${image !== null ? "justify-left" : ""}`}>
            <div style={{ display: "flex", marginTop: 0 }}>
              <FnbUploadImageComponent
                maxFileSize={maxSizeUploadMb * 1024 * 1024}
                buttonText={pageData.uploadImage}
                onChange={onChangeImage}
                onError={(errors) => uploadImageError(errors)}
                ref={ref}
                acceptType={acceptType}
                defaultImage={defaultImage}
                imgFallbackDefault={imgFallbackDefault}
              />
              <a className="upload-image-url" hidden={image !== null}>
                {pageData.upload.addFromUrl}
              </a>
            </div>
          </Col>
          <Col span={24} className="text-non-image" hidden={image !== null}>
            <Row className="text-non-image">
              <Col span={24}>
                <Text disabled>{acceptType ? pageData.upload.icoImage : pageData.upload.textNonImage}</Text>
              </Col>
              <Col span={24}>
                <Text>{pageData.bestDisplayMessage}</Text>
              </Col>
            </Row>
          </Col>
        </div>
      </Row>

      {imageUploadError && isErrorShowed === false && <Text className="errorMessage">{imageUploadError}</Text>}
    </div>
  );
}
