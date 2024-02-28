import { Col, Row } from 'antd'
import { FnbUploadImageComponent } from 'components/fnb-upload-image/fnb-upload-image.component'
import React, { useEffect, useState } from 'react'
import './fnb-image-select.component.scss'

const { forwardRef, useImperativeHandle } = React
export const FnbImageSelectComponent = forwardRef((props, ref) => {
  const {
    className,
    onChange,
    value,
    maxFileSize = 5242880,
    isShowBestDisplay = true,
    messageTooBigSize = 'Ảnh tải lên phải có dung lượng nhỏ hơn 1MB.',
    messageErrorFormat = 'Chỉ chấp nhận loại tệp: JPG, PNG, JPG2000, GIF...',
    acceptType,
    bestDisplayImage,
    customTextNonImageClass,
    customNonImageClass,
    isDisabled,
    isShowMessageError = false
  } = props
  const fnbUploadRef = React.useRef()
  const [selectedImage, setSelectedImage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useImperativeHandle(ref, () => ({
    setImageUrl (url) {
      setImageUrl(url)
    },
    getImageUrl () {
      return selectedImage ?? ''
    }
  }))

  const pageData = {
    addFromUrl: 'Thêm từ URL',
    uploadImage: 'Thêm tập tin',
    textNonImage: 'Chấp nhận: .JPG, .PNG, .JPG2000, .GIF...',
    bestDisplayImage: 'Hiển thị tốt nhất: 176px X 176px'
  }

  useEffect(() => {
    setImageUrl(value)
  }, [])

  const setImageUrl = (url) => {
    if (fnbUploadRef && fnbUploadRef.current && url) {
      fnbUploadRef.current.setImage(url)
      setSelectedImage(url)
    }
  }

  const onClickUploadImage = (file) => {
    if (onChange) {
      onChange(file?.url)
    }
    setSelectedImage(file != null ? file?.url : null)
    setErrorMessage(null)
  }

  const onShowErrorMessage = (errors, files) => {
    if (errors.maxFileSize === true) {
      setErrorMessage(messageTooBigSize)
    } else if (errors.acceptType === true) {
      setErrorMessage(messageErrorFormat)
    }
  }

  return (
    <div className="fnb-image-select ">
      <Row className={`non-image ${(isShowMessageError && errorMessage) && 'border-error'} ${selectedImage !== null ? 'have-image' : ''}`}>
        <Col
          span={24}
          className={`${customNonImageClass} image-product ${selectedImage !== null ? 'justify-left' : ''}`}
        >
          <div style={{ display: 'flex' }}>
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
            <a className="upload-image-url" hidden={selectedImage !== null}>
              {pageData.addFromUrl}
            </a>
          </div>
        </Col>
        <Col
          span={24}
          className={`${customTextNonImageClass} text-non-image ${isShowMessageError ? 'border-error' : ''}`}
          hidden={selectedImage !== null}
        >
          <div>{pageData.textNonImage}</div>
          <div> {isShowBestDisplay && (bestDisplayImage ?? pageData.bestDisplayImage)}</div>
        </Col>
      </Row>
      {
        (isShowMessageError && errorMessage) &&
        <div className="ant-form-item-explain-error">{errorMessage}</div>
      }
    </div>
  )
})
