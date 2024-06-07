import { Col, message, Row } from 'antd'
import { EditFillImage, EyeOpenImageIcon, TrashFillImage } from 'constants/icons.constants'
import fileDataService from 'data-services/file/file-data.service';
import moment from 'moment'
import React, { useEffect, useState } from 'react'
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
  const isMultiple = maxNumber > 1
  useImperativeHandle(ref, () => ({
    setImage(url) {
      if (url == null) {
        setImages([])
      }
      else if (Array.isArray(url)) {
        setImages(url.map(item => ({
          data_url: item
        })));
      } else {
        setImages([{ data_url: url }]);
      }
    }
  }))

  /**
   *
   * @param {Image of list upload} imageList
   * @param {*} addUpdateIndex
   * @param {Position of image item} index
   */
  const onUploadImage = (imageList, updateIndex) => {
    if (updateIndex?.length > 0) {
      // Thêm ảnh
      const updateImage = imageList.filter((item, index) => updateIndex.includes(index))
      const requestFormData = jsonToFormData({ files: updateImage })
      fileDataService.uploadMultipleFileAsync(requestFormData).then((res) => {
        if (res) {
          if (isMultiple) {
            const newImageList = [...images, ...res.map((url) => ({ data_url: url }))]
            setImages(newImageList);
            onChange && onChange(newImageList.map(x => x.data_url));
          }
          else {
            setImages([{ data_url: res[0] }]);
            onChange && onChange(res[0]);
          }
        }
      });
    } else if (imageList.length > 0) {
      // Xoá ảnh
      if (onChange) {
        setImages(imageList)
        onChange(imageList.map(x => x.data_url))
      }
    } else {
      // Xoá hết ảnh => update giao diện có viền
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
            <div className={`upload__image-wrapper ${isMultiple && imageList.length > 0 ? 'multiple' : ''}`}>
              {
                <button
                  style={isDragging ? { color: 'red' } : null}
                  onClick={onImageUpload}
                  {...dragProps}
                  type="button"
                  className={`btn-upload-image ${className} ${imageList.length > 0 && !isMultiple ? 'btn-hidden' : ''}`}
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
                        <Col span={isDisabled ? 24 : 12} className="group-btn-upload-image-item" onClick={() => onViewImage(index)}>
                          <EyeOpenImageIcon className="eye-open-icon" />
                        </Col>
                        {!isDisabled &&
                          <Col span={12} className="group-btn-upload-image-item" onClick={() => onImageRemove(index)}>
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
