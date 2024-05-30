import { Col, message, Row } from 'antd'
import { EditFillImage, EyeOpenImageIcon, TrashFillImage } from 'constants/icons.constants'
import fileDataService from 'data-services/file/file-data.service';
import moment from 'moment'
import React, { useState } from 'react'
import ImageUploading from 'react-images-uploading'
import Viewer from 'react-viewer'
import { fileNameNormalize, jsonToFormData } from 'utils/helpers'
import './shop-upload-image.component.scss'
import { useTranslation } from 'react-i18next'
const { forwardRef, useImperativeHandle } = React
export const FnbUploadImageComponent = forwardRef((props, ref) => {
  const { t } = useTranslation()
  const {
    onChange,
    maxNumber = 1,
    buttonText,
    className,
    maxFileSize = 5242880,
    onError,
    acceptType,
    imageSizeTooBig = t('file.imageSizeTooBig'),
    acceptFileImageTypes = t('file.acceptFileImageTypes'),
    isDisabled = false
  } = props
  const [images, setImages] = React.useState([])
  const [visibleViewer, setVisibleViewer] = useState(false)
  const [randomId, setRandomId] = useState(Math.random())

  useImperativeHandle(ref, () => ({
    setImage(url) {
      if (url) {
        const imageList = [
          {
            data_url: url
          }
        ]
        setImages(imageList)
      } else {
        setImages([])
      }
    }
  }))

  /**
   *
   * @param {Image of list upload} imageList
   * @param {*} addUpdateIndex
   * @param {Position of image item} index
   */
  const onUploadImage = (imageList) => {
    // data for submit
    const buildFileName = moment(new Date()).format('DDMMYYYYHHmmss')
    if (imageList.length > 0) {
      if (maxNumber == 1) {
        const requestData = {
          file: imageList[0].file,
          fileName: fileNameNormalize(buildFileName)
        }
        const requestFormData = jsonToFormData(requestData)
        fileDataService.uploadFileAsync(requestFormData).then((res) => {
          if (res !== '') {
            imageList[0].data_url = res;
            setImages(imageList);
            if (onChange) {
              onChange({
                fileName: buildFileName,
                url: res
              });
            }
          }
        });
      }
      else {
        let requestData = []
        imageList.forEach((element, index) => {
          requestData.push({file: element.file, fileName: index + fileNameNormalize(buildFileName)})
        });
        const requestFormData = jsonToFormData(requestData)
        fileDataService.uploadMultipleFileAsync(requestFormData).then((res) => {
          if (res !== '') {
            imageList[0].data_url = res;
            setImages(imageList);
            if (onChange) {
              onChange({
                fileName: buildFileName,
                url: res
              });
            }
          }
        });
      }
    } else {
      if (onChange) {
        setImages(imageList)
        onChange(null)
      }
    }
  }

  /**
   * When hover into image. It will show action include: edit, view and delete
   * @param {Position of image item} index
   */
  const hoverEnterImage = (className, index) => {
    const groupControlBtn = document.getElementById(`group-btn-upload-image-${className}-${index}-${randomId}`)
    if (groupControlBtn) {
      groupControlBtn.classList.add('group-btn-upload-image-display')
    }
  }

  /**
   *
   * @param {Position of image item} index
   */
  const hoverLeaveImage = (className, index) => {
    const groupControlBtn = document.getElementById(`group-btn-upload-image-${className}-${index}-${randomId}`)
    if (groupControlBtn) {
      groupControlBtn.classList.remove('group-btn-upload-image-display')
    }
  }

  /**
   *
   * @param {Position of image item} index
   */
  const onViewImage = () => {
    setVisibleViewer(true)
  }

  const uploadImageError = (errors, files) => {
    if (errors.maxFileSize === true) {
      message.error(imageSizeTooBig)
    } else if (errors.acceptType === true) {
      message.error(acceptFileImageTypes)
    }
  }

  return (
    <>
      <ImageUploading
        multiple={maxNumber > 1}
        value={images}
        onChange={onUploadImage}
        maxNumber={maxNumber}
        dataURLKey="data_url"
        maxFileSize={maxFileSize} // The unit is byte
        onError={onError || uploadImageError}
        acceptType={acceptType}
      >
        {({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps }) => {
          return (
            // write your building UI
            <div className="upload__image-wrapper">
              {
                <button
                  style={isDragging ? { color: 'red' } : null}
                  onClick={onImageUpload}
                  {...dragProps}
                  type="button"
                  className={`btn-upload-image ${className} ${imageList.length > 0 ? 'btn-hidden' : ''}`}
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
                      <img className={`image-updated ${className}`} src={image.data_url} alt="" />
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
                  <Viewer
                    visible={visibleViewer}
                    onClose={() => {
                      setVisibleViewer(false)
                    }}
                    images={[
                      {
                        src: image.data_url
                      }
                    ]}
                    noFooter={true}
                    defaultSize={{
                      width: 588,
                      height: 588
                    }}
                  />
                </>
              ))}
            </div>
          )
        }}
      </ImageUploading>
    </>
  )
})
