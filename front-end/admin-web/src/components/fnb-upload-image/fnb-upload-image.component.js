import { Col, message, Row } from "antd";
import { EditFillImage, EyeOpenImageIcon, TrashFillImage } from "constants/icons.constants";
// import fileDataService from "data-services/file/file-data.service";
import moment from "moment";
import React, { useState } from "react";
import ImageUploading from "react-images-uploading";
import Viewer from "react-viewer";
import { fileNameNormalize, jsonToFormData } from "utils/helpers";
import "./fnb-upload-image.component.scss";

const { forwardRef, useImperativeHandle } = React;
export const FnbUploadImageComponent = forwardRef((props, ref) => {
  const {
    onChange,
    maxNumber = 1,
    buttonText,
    className,
    maxFileSize = 5242880,
    onError,
    acceptType,
    messageTooBigSize = "Ảnh tải lên phải có dung lượng nhỏ hơn 1MB.",
    messageErrorFormat = "Chỉ chấp nhận loại tệp: JPG, PNG, JPG2000, GIF...",
    isDisabled = false
  } = props;
  const [images, setImages] = React.useState([]);
  const [visibleViewer, setVisibleViewer] = useState(false);
  const [randomId, setRandomId] = useState(Math.random());

  useImperativeHandle(ref, () => ({
    setImage(url) {
      if (url) {
        var imageList = [
          {
            data_url: url,
          },
        ];
        setImages(imageList);
      } else {
        setImages([]);
      }
    },
  }));

  /**
   *
   * @param {Image of list upload} imageList
   * @param {*} addUpdateIndex
   * @param {Position of image item} index
   */
  const onUploadImage = (imageList) => {
    // data for submit
    let buildFileName = moment(new Date()).format("DDMMYYYYHHmmss");
    if (imageList[0]) {
      const requestData = {
        file: imageList[0].file,
        fileName: fileNameNormalize(buildFileName),
      };
      const requestFormData = jsonToFormData(requestData);
      // fileDataService.uploadFileAsync(requestFormData).then((res) => {
      //   if (res.success === true) {
      //     imageList[0].data_url = res.data;
      //     setImages(imageList);
      //     if (onChange) {
      //       onChange({
      //         fileName: buildFileName,
      //         url: res.data,
      //       });
      //     }
      //   }
      // });
    } else {
      if (onChange) {
        setImages(imageList);
        onChange(null);
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
      message.error(messageTooBigSize);
    }
    else if (errors.acceptType === true) {
      message.error(messageErrorFormat)
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
        acceptType={acceptType}
      >
        {({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps }) => {
          return (
            // write your building UI
            <div className="upload__image-wrapper">
              {
                <button
                  style={isDragging ? { color: "red" } : null}
                  onClick={onImageUpload}
                  {...dragProps}
                  type="button"
                  className={`btn-upload-image ${className} ${imageList.length > 0 ? "btn-hidden" : ""}`}
                >
                  {buttonText}
                </button>
              }
              {imageList?.map((image, index) => (
                <>
                  <div
                    onMouseEnter={() => hoverEnterImage(className, index)}
                    onMouseLeave={() => hoverLeaveImage(className, index)}
                  >
                    <div key={index} className="image-item">
                      <img className={`image-updated ${className}`} src={image["data_url"]} alt="" />
                    </div>
                    <div
                      key={`group-btn-${index}`}
                      className={`group-btn-upload-image ${className}`}
                      id={`group-btn-upload-image-${className}-${index}-${randomId}`}
                    >
                      <Row className="group-btn-upload-image-row">
                        {!isDisabled &&
                          <Col span={8} className="group-btn-upload-image-item" onClick={() => onImageUpdate(index)}>
                            <EditFillImage className="edit-fill-icon" />
                          </Col>
                        }
                        <Col span={isDisabled ? 24 : 8} className="group-btn-upload-image-item" onClick={() => onViewImage(index)}>
                          <EyeOpenImageIcon className="eye-open-icon" />
                        </Col>
                        {!isDisabled &&
                          <Col span={8} className="group-btn-upload-image-item" onClick={() => onImageRemove(index)}>
                            <TrashFillImage className="trash-fill-icon" />
                          </Col>
                        }
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
                        defaultSize={{
                          width: 588,
                          height: 588,
                        }}
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
