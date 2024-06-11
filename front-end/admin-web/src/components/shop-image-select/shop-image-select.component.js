import { Col, Row } from 'antd'
import { FnbUploadImageComponent } from 'components/shop-upload-image/shop-upload-image.component'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './shop-image-select.component.scss'

const { forwardRef, useImperativeHandle } = React
export const FnbImageSelectComponent = forwardRef((props, ref) => {
  const { t } = useTranslation()
  const {
    className,
    onChange,
    value,
    maxFileSize = 5242880,
    isShowBestDisplay = true,
    isShowTextNonImage = true,
    acceptType,
    bestDisplayImage,
    customTextNonImageClass,
    customNonImageClass,
    isDisabled,
    isShowMessageError = false,
    maxNumber = 1
  } = props
  //console.log(value);
  const shopUploadRef = React.useRef()
  const [selectedImage, setSelectedImage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useImperativeHandle(ref, () => ({
    setImageUrl(url) {
      setImageUrl(url)
    },
    getImageUrl() {
      return selectedImage ?? ''
    }
  }))

  const pageData = {
    uploadImage: t('file.uploadImage'),
    textNonImage: t('file.textNonImage'),
    bestDisplayImage: t('file.bestDisplayImage'),
    imageSizeTooBig: t('file.imageSizeTooBig'),
    acceptFileImageTypes: t('file.acceptFileImageTypes')
  }

  useEffect(() => {
    if(maxNumber === 1 )
      setImageUrl(value)
  }, [value])

  const setImageUrl = (url) => {
    if (shopUploadRef && shopUploadRef.current && url) {
      shopUploadRef.current.setImage(url)
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
      setErrorMessage(pageData.imageSizeTooBig)
    } else if (errors.acceptType === true) {
      setErrorMessage(pageData.acceptFileImageTypes)
    }
  }

  return (
    <div className="shop-image-select ">
      <Row className={`non-image ${(isShowMessageError && errorMessage) && 'border-error'} ${selectedImage !== null ? 'have-image' : ''}`}>
        <Col
          span={24}
          className={`${customNonImageClass} image-product ${selectedImage !== null ? 'justify-left' : ''}`}
        >
          <div>
            <FnbUploadImageComponent
              className={className}
              ref={shopUploadRef}
              buttonText={pageData.uploadImage}
              onChange={onClickUploadImage}
              maxFileSize={maxFileSize}
              messageTooBigSize={pageData.imageSizeTooBig}
              messageErrorFormat={errorMessage}
              acceptType={acceptType}
              isDisabled={isDisabled}
              onError={isShowMessageError ? onShowErrorMessage : undefined}
              maxNumber={maxNumber}
            />
          </div>
        </Col>
        <Col
          span={24}
          className={`${customTextNonImageClass} text-non-image ${isShowMessageError ? 'border-error' : ''}`}
          hidden={selectedImage !== null}
        >
          {isShowTextNonImage && <div> {pageData.textNonImage}</div>}
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
