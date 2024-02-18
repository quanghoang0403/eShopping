import { Col, Row, Typography } from "antd";
import { FnbUploadImageComponent } from "components/fnb-upload-image/fnb-upload-image.component";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./fnb-upload-image-customize.scss";

export function FnbUploadImageCustomizeComponent(props) {
  const { bestDisplay, maxSizeUploadMb, onChangeImageFinish, defaultImage, acceptType } = props;
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
    fileSizeLimit: t("storeWebPage.header.fileSizeLimit"),
    bestDisplayMessage: `${t("storeWebPage.header.bestDisplay")} ${bestDisplay}`,
  };

  useEffect(() => {
    if (ref && ref.current && defaultImage) {
      ref.current.setImage(defaultImage);
      setImage(defaultImage);
    }
  }, [defaultImage]);

  const onChangeImage = (file) => {
    setImage(file);
    setImageUploadError();
    onChangeImageFinish(file);
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

      {imageUploadError && <Text className="errorMessage">{imageUploadError}</Text>}
    </div>
  );
}
