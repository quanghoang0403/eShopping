import { Button, Col, message, Row } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ImageUploading from "react-images-uploading";
import Viewer from "react-viewer";
import fileDataService from "../../../data-services/file-data.service";
import { fileNameNormalize, jsonToFormData } from "../../../utils/helpers";
import { EditFillImage, EyeOpenImageIcon, TrashFillImage } from "../../assets/icons.constants";
import ImageWithFallback from "../fnb-image-with-fallback/fnb-image-with-fallback.component";
import "./fnb-upload-image.component.scss";

const { forwardRef, useImperativeHandle } = React;
export const FnbUploadImageComponent = forwardRef((props, ref) => {
  const [t] = useTranslation();
  const {
    onChange,
    maxNumber = 1,
    buttonText,
    className,
    maxFileSize = 5242880,
    onError,
    defaultImage,
    imgFallbackDefault,
    acceptType,
  } = props;
  const [images, setImages] = React.useState([]);
  const [visibleViewer, setVisibleViewer] = useState(false);
  const [randomId, setRandomId] = useState(Math.random());

  useImperativeHandle(ref, () => ({
    setImage(url) {
      var imageList = [
        {
          data_url: url,
        },
      ];
      setImages(imageList);
    },
  }));

  /**
   *
   * @param {Image of list upload} imageList
   * @param {*} addUpdateIndex
   * @param {Position of image item} index
   */
  const onUploadImage = async (imageList) => {
    // data for submit
    let buildFileName = moment(new Date()).format("DDMMYYYYHHmmss");
    if (imageList[0]) {
      const requestData = {
        file: imageList[0].file,
        fileName: fileNameNormalize(buildFileName),
        fileSizeLimit: maxFileSize,
      };
      const requestFormData = jsonToFormData(requestData);
      const uploadImageResult = await fileDataService.uploadFileAsync(requestFormData);
      if (uploadImageResult?.data?.success === true) {
        imageList[0].data_url = uploadImageResult?.data?.data;
        setImages(imageList);
        if (onChange) {
          onChange({
            fileName: buildFileName,
            url: uploadImageResult?.data?.data,
          });
        }
      }
    } else {
      let imageChange = null;
      if (defaultImage) {
        imageList = [
          {
            data_url: defaultImage,
          },
        ];
        imageChange = {
          fileName: buildFileName,
          url: defaultImage,
        };
      }

      if (onChange) {
        setImages(imageList);
        onChange(imageChange);
      }
    }
  };

  /**
   * When hover into image. It will show action include: edit, view and delete
   * @param {Position of image item} index
   */
  const hoverEnterImage = (className, index) => {
    let groupControlBtn = document.getElementById(`group-btn-upload-image-${className}-${index}-${randomId}`);
    if (groupControlBtn) {
      groupControlBtn.classList.add("group-btn-upload-image-display");
    }
  };

  /**
   *
   * @param {Position of image item} index
   */
  const hoverLeaveImage = (className, index) => {
    let groupControlBtn = document.getElementById(`group-btn-upload-image-${className}-${index}-${randomId}`);
    if (groupControlBtn) {
      groupControlBtn.classList.remove("group-btn-upload-image-display");
    }
  };

  /**
   *
   * @param {Position of image item} index
   */
  const onViewImage = () => {
    setVisibleViewer(true);
  };

  const uploadImageError = (errors, files) => {
    if (errors.maxFileSize === true) {
      message.error(t("messages.imageSizeTooBig"));
    }
  };

  return (
    <>
      <ImageUploading
        multiple={false}
        value={images}
        onChange={onUploadImage}
        maxNumber={maxNumber}
        dataURLKey="data_url"
        maxFileSize={maxFileSize} // The unit is byte
        onError={onError ? onError : uploadImageError}
        acceptType={acceptType ? acceptType : undefined}
      >
        {({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps }) => {
          return (
            // write your building UI
            <div className="upload__image-wrapper">
              {
                <Button
                  style={isDragging ? { color: "red" } : null}
                  onClick={onImageUpload}
                  {...dragProps}
                  type="button"
                  className={`btn-upload-image ${className} ${imageList.length > 0 ? "btn-hidden" : ""}`}
                >
                  {buttonText}
                </Button>
              }
              {imageList?.map((image, index) => (
                <>
                  <div
                    onMouseEnter={() => hoverEnterImage(className, index)}
                    onMouseLeave={() => hoverLeaveImage(className, index)}
                  >
                    <div key={index} className="image-item">
                      <ImageWithFallback
                        className={`image-updated ${className}`}
                        src={image["data_url"]}
                        fallbackSrc={imgFallbackDefault}
                        alt=""
                      />
                    </div>
                    <div
                      key={`group-btn-${index}`}
                      className={`group-btn-upload-image ${className}`}
                      id={`group-btn-upload-image-${className}-${index}-${randomId}`}
                    >
                      <Row className="group-btn-upload-image-row">
                        <Col span={8} className="group-btn-upload-image-item" onClick={() => onImageUpdate(index)}>
                          <EditFillImage className="edit-fill-icon" />
                        </Col>
                        <Col span={8} className="group-btn-upload-image-item" onClick={() => onViewImage(index)}>
                          <EyeOpenImageIcon className="eye-open-icon" />
                        </Col>
                        <Col span={8} className="group-btn-upload-image-item" onClick={() => onImageRemove(index)}>
                          <TrashFillImage className="trash-fill-icon" />
                        </Col>
                      </Row>
                    </div>
                  </div>
                  {
                    <>
                      <Viewer
                        visible={visibleViewer}
                        onClose={() => {
                          setVisibleViewer(false);
                        }}
                        images={[
                          {
                            src: image["data_url"],
                          },
                        ]}
                        noFooter={true}
                      />
                    </>
                  }
                </>
              ))}
            </div>
          );
        }}
      </ImageUploading>
    </>
  );
});
