import { Col, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FnbUploadImageComponent } from "../fnb-upload-image/fnb-upload-image.component";
import "./fnb-upload-background-image-customize.scss";

export default function FnbUploadBackgroundImageCustomizeComponent(props) {
  const defaultBestDisplay = "80 x 80px";
  const {
    bestDisplay,
    maxSizeUploadMb,
    acceptType,
    value,
    isRequired,
    nameComponents = null,
    onChange,
    defaultImage,
    imgFallbackDefault,
  } = props;
  const [t] = useTranslation();
  const { Text } = Typography;
  const [image, setImage] = useState(null);
  const [imageUploadError, setImageUploadError] = useState();
  const [isOnChange, setIsOnChange] = useState(false);
  const ref = React.useRef();
  const selectQRCodeImage = "SelectQRCodeImage";
  const blogListHeader = "BlogListHeader";
  const blogListBlog = "BlogListBlog";
  const pageData = {
    upload: {
      addFromUrl: t("upload.addFromUrl"),
      textNonImage: t("media.textNonImage"),
      icoImage: t("media.icoImage", "Accepts images: ICO"),
    },
    pleaseUploadBackgroundImage: t("storeWebPage.header.pleaseUploadBackgroundImage", "Please upload background image"),
    uploadImage: t("productManagement.generalInformation.addFile"),
    fileSizeLimit: t("storeWebPage.header.fileSizeLimit"),
    bestDisplayMessage: `${t("storeWebPage.header.bestDisplay")} ${bestDisplay ?? defaultBestDisplay}`,
    qrCodeToRequired: t("storeWebPage.footerThemeConfiguration.downloadApp.qrCodeToRequired"),
  };

  useEffect(() => {
    if (ref && ref.current && value) {
      ref.current.setImage(value);
      setImage(value);
    } else {
      if (value == null && defaultImage) {
        ref.current.setImage(defaultImage);
        setImage(defaultImage);
      }
    }
    if (nameComponents == selectQRCodeImage && window.isNotSelectQRCodeImage && isRequired == true) {
      setImageUploadError(pageData.qrCodeToRequired);
    }
    if (nameComponents == blogListHeader && window.isNotBackgroundImageBlogListHeader) {
      setImageUploadError(pageData.pleaseUploadBackgroundImage);
    }
    if (nameComponents == blogListBlog && window.isNotBackgroundImageBlogListBlog) {
      setImageUploadError(pageData.pleaseUploadBackgroundImage);
    }
  }, [value]);

  const onChangeImage = (file) => {
    setImage(file);
    setImageUploadError();
    setIsOnChange(true);
    onChange(file?.url);
    if (nameComponents == selectQRCodeImage) {
      if (file?.url) {
        window.isNotSelectQRCodeImage = false;
        setImageUploadError();
      } else {
        window.isNotSelectQRCodeImage = true;
      }
    }
    if (nameComponents == blogListHeader) {
      if (file?.url) {
        window.isNotBackgroundImageBlogListHeader = false;
        setImageUploadError();
      } else {
        window.isNotBackgroundImageBlogListHeader = true;
      }
    }
    if (nameComponents == blogListBlog) {
      if (file?.url) {
        window.isNotBackgroundImageBlogListBlog = false;
        setImageUploadError();
      } else {
        window.isNotBackgroundImageBlogListBlog = true;
      }
    }
  };

  const uploadImageError = (errors) => {
    if (errors.maxFileSize === true) {
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

      {(imageUploadError || image === null) && (
        <Text className="errorMessage">{image === null && !isOnChange ? pageData.pleaseUploadBackgroundImage : imageUploadError}</Text>
      )}
    </div>
  );
}
