import { CameraFilled } from '@ant-design/icons'
import { Button, Col, Form, Input, message, Row } from 'antd'
// import staffDataService from "data-services/staff/staff-data.service";
// import userDataService from "data-services/user/user-data.service";
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import ImageUploading from 'react-images-uploading'
import { useDispatch } from 'react-redux'
import { setFullNameUser, setThumbnailUser } from 'store/modules/session/session.actions'
import { fileNameNormalize, jsonToFormData } from 'utils/helpers'
import { UpdatePasswordComponent } from './update-password.component'
import { useTranslation } from 'react-i18next'

export default function UserInformationComponent (props) {
  const [form] = Form.useForm()
  const [images, setImages] = React.useState([])
  const dispatch = useDispatch()
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [isHiddenButtonUpdate, setIsHiddenButtonUpdate] = useState(true)
  const [fullNameCopy, setFullNameCopy] = useState(null)
  const [phoneNumberCopy, setPhoneNumberCopy] = useState(null)
  const { t } = useTranslation()
  const pageData = {
    btnUpdate: t('account.btnUpdate'),
    loginNameLabel: t('account.btnUpdate'),
    fullNameLabel: t('account.btnUpdate'),
    phoneNumberLabel: t('account.btnUpdate'),
    fullNamePlaceholder: t('account.btnUpdate'),
    phoneNumberPlaceholder: t('account.btnUpdate'),
    fullNameErrorText: t('account.btnUpdate'),
    phoneNumberErrorText: t('account.btnUpdate'),
    phoneNumberInvalidMessage: t('account.btnUpdate'),
    maxLengthPhoneNumber: 15,
    formatPhoneNumber: '^[0-9]*$',
    successMessage: t('account.btnUpdate'),
    unSuccessMessage: t('account.btnUpdate'),
    tabNameAccountTitle: t('account.btnUpdate'),
    imageSizeTooBig: t('file.imageSizeTooBig')
  }

  useEffect(() => {
    getUserInformation()
  }, [])

  const getUserInformation = () => {
    // staffDataService
    //   .getCurrentStaffAsync()
    //   .then((response) => {
    //     form.setFieldsValue({
    //       accountId: response?.accountId,
    //       userId: response?.staffId,
    //       emailAddress: response?.email,
    //       fullName: response?.fullName,
    //       phoneNumber: response?.phoneNumber,
    //       thumbnail: response?.thumbnail,
    //     });
    //     setFullNameCopy(response?.fullName);
    //     setPhoneNumberCopy(response?.phoneNumber);
    //     setAvatarUrl(response?.thumbnail ?? null);
    //   })
    //   .catch((errors) => {
    //     message.error(errors?.message);
    //   });
  }

  /**
   * Submit form value to server
   */
  const onFinish = () => {
    // form.validateFields().then((values) => {
    //   staffDataService
    //     .updateStaffProfile(values)
    //     .then((response) => {
    //       if (response.isSuccess === true) {
    //         dispatch(setFullNameUser(values?.fullName));
    //         setIsHiddenButtonUpdate(true);
    //         setFullNameCopy(values?.fullName);
    //         setPhoneNumberCopy(values?.phoneNumber);
    //         message.success(pageData.successMessage);
    //       } else {
    //         message.error(response.message);
    //       }
    //     })
    //     .catch((errors) => {
    //       console.log("Update current user errors >>", errors);
    //     });
    // });
  }

  /**
   *
   * @param {Image of list upload} imageList
   * @param {*} addUpdateIndex
   * @param {Position of image item} index
   */
  const onUploadImage = (imageList) => {
    // data for submit
    const buildFileName = moment(new Date()).format('DDMMYYYYHHmmss')
    if (imageList[0]) {
      const requestData = {
        file: imageList[0].file,
        fileName: fileNameNormalize(buildFileName)
      }
      const requestFormData = jsonToFormData(requestData)
      // userDataService.uploadAccountAvatarAsync(requestFormData).then((res) => {
      //   if (res) {
      //     imageList[0].data_url = res;
      //     setImages(imageList);
      //     form.setFieldsValue({
      //       ...form.getFieldsValue,
      //       thumbnail: imageList[0].data_url,
      //     });
      //     setAvatarUrl(res);
      //     dispatch(setThumbnailUser(res));
      //   }
      // });
    }
  }

  const onChangeFullName = (e) => {
    const fullName = e?.target?.value
    const phoneNumber = form.getFieldValue('phoneNumber')
    if (fullName !== fullNameCopy || phoneNumber !== phoneNumberCopy) {
      setIsHiddenButtonUpdate(false)
    }
    if (fullName === fullNameCopy && phoneNumber === phoneNumberCopy) {
      setIsHiddenButtonUpdate(true)
    }
  }

  const onChangePhoneNumber = (e) => {
    const fullName = form.getFieldValue('fullName')
    const phoneNumber = e?.target?.value
    if (fullName !== fullNameCopy || phoneNumber !== phoneNumberCopy) {
      setIsHiddenButtonUpdate(false)
    }
    if (fullName === fullNameCopy && phoneNumber === phoneNumberCopy) {
      setIsHiddenButtonUpdate(true)
    }
  }

  const uploadImageError = (errors, files) => {
    if (errors.maxFileSize === true) {
      message.error(pageData.imageSizeTooBig)
    }
  }

  return (
    <>
      <Row>
        <Col span={12} style={{ display: 'flex', alignItems: 'center' }}>
          <span className="title-account">{pageData.tabNameAccountTitle}</span>
        </Col>
        <Col span={12}>
          <Button
            className={'btn-update-account'}
            onClick={() => onFinish()}
            htmlType="button"
            hidden={isHiddenButtonUpdate}
          >
            {pageData.btnUpdate}
          </Button>
        </Col>
      </Row>
      <Form form={form} layout="vertical" autoComplete="off">
        <Row gutter={[16, 0]}>
          <Col span={12}>
            <div className="group-user-avatar">
              <div className="user-avatar" hidden={!!(images.length > 0 || avatarUrl !== null)}></div>
              <ImageUploading
                value={images}
                onChange={onUploadImage}
                multiple={false}
                dataURLKey="data_url"
                maxFileSize={5242880} // The unit is byte
                onError={uploadImageError}
              >
                {({ imageList, onImageUpload, dragProps }) => {
                  return (
                    // write your building UI
                    <div className="upload__image-wrapper">
                      {<CameraFilled onClick={onImageUpload} {...dragProps} type="button" className="icon-camera" />}
                      {imageList.length > 0 &&
                        imageList.map((image, index) => (
                          <div key={index} className="user-avatar user-avatar-no-border">
                            <img src={image.data_url ?? avatarUrl} alt="" className="image-uploaded" />
                          </div>
                        ))}
                      {avatarUrl !== null && imageList.length <= 0 && (
                        <>
                          <div className="user-avatar user-avatar-no-border">
                            <img src={avatarUrl} alt="" className="image-uploaded" />
                          </div>
                        </>
                      )}
                    </div>
                  )
                }}
              </ImageUploading>
            </div>
            <Form.Item name={'thumbnail'} hidden={true}></Form.Item>
            <Form.Item name={'accountId'} hidden={true}></Form.Item>
            <Form.Item name={'userId'} hidden={true}></Form.Item>
            <h4 className="shop-form-label">
              {pageData.fullNameLabel}
              <span className="text-danger">*</span>
            </h4>
            <Form.Item name={'fullName'} rules={[{ required: true, message: pageData.fullNameErrorText }]}>
              <Input
                className="shop-input"
                placeholder={pageData.fullNamePlaceholder}
                onChange={onChangeFullName}
                maxLength={100}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Row>
              {/* <Col span={24}>
                <h4 className="shop-form-label">{pageData.storeNameLabel}</h4>
                <Form.Item name={"storeName"}>
                  <Input className="shop-input" disabled={true} />
                </Form.Item>
              </Col> */}
              <Col span={24}>
                <h4 className="shop-form-label">{pageData.loginNameLabel}</h4>
                <Form.Item name={'emailAddress'}>
                  <Input className="shop-input" disabled={true} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <h4 className="shop-form-label">
                  {pageData.phoneNumberLabel}
                  <span className="text-danger">*</span>
                </h4>
                <Form.Item
                  name={'phoneNumber'}
                  rules={[
                    {
                      required: true,
                      message: pageData.phoneNumberErrorText
                    },
                    {
                      pattern: new RegExp(pageData.formatPhoneNumber),
                      message: pageData.phoneNumberInvalidMessage
                    },
                    {
                      type: 'string',
                      max: pageData.maxLengthPhoneNumber
                    }
                  ]}
                >
                  <Input
                    className="w-100 shop-input-number"
                    placeholder={pageData.phoneNumberPlaceholder}
                    maxLength={pageData.maxLengthPhoneNumber}
                    onChange={onChangePhoneNumber}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
      <UpdatePasswordComponent></UpdatePasswordComponent>
    </>
  )
}
