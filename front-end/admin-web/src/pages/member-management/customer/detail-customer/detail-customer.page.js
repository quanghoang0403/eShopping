import { Button, Col, Image, Row, message } from 'antd'
import ActionButtonGroup from 'components/action-button-group/action-button-group.component'
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component'
import PageTitle from 'components/page-title'
import { CustomerGenderConstant } from 'constants/customer.constant'
import { images } from 'constants/images.constants'
import { PermissionKeys } from 'constants/permission-key.constants'
import { DateFormat } from 'constants/string.constants'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { formatCurrency, formatNumber } from 'utils/helpers'
import './detail-customer.scss'
import { useTranslation } from 'react-i18next'
import customerDataService from 'data-services/customer/customer-data.service'
import { useHistory, useRouteMatch } from 'react-router-dom'
import AddressDataService from 'data-services/address/address-data.service'

export default function DetailCustomerPage (props) {
  // const { t, customerDataService, match, history } = props
  const [t] = useTranslation()
  const match = useRouteMatch()
  const history = useHistory()
  const pageData = {
    btnEdit: t('button.edit'),
    btnDelete: t('button.delete'),
    btnIgnore: t('button.ignore'),
    btnLeave: t('button.leave'),
    name: t('customer.name'),
    phone: t('customer.phone'),
    address: t('customer.address'),
    email: t('customer.email'),
    birthday: t('customer.birthday'),
    gender: t('customer.gender'),
    female: t('customer.female'),
    male: t('customer.male'),
    other: t('customer.other'),
    city: t('form.city'),
    district: t('form.district'),
    ward: t('form.ward'),
    customerManagement: t('customer.title'),
    totalOrder: t('dashboard.totalOrder'),
    totalMoney: t('dashboard.totalMoney'),
    generalInformation: t('customer.titleInfo'),
    confirmDelete: t('dialog.confirmDelete'),
    confirmDeleteMessage: t('dialog.confirmDeleteMessage'),
    customerDeleteSuccess: t('customer.customerDeleteSuccess'),
    customerDeleteFail: t('customer.customerDeleteFail')
  }

  const [gender, setGender] = useState(CustomerGenderConstant.Female)
  const [cityName, setCityName] = useState(null)
  const [wardName, setWardName] = useState(null)
  const [districtName, setDistrictName] = useState(null)
  const [customer, setCustomer] = useState({})
  const [showConfirm, setShowConfirm] = useState(false)
  const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 })

  const getInitData = ()=>{
    let promises = []
    let tempCustomer;
    promises.push(customerDataService.getCustomerByIdAsync(match?.params?.customerId))
    promises.push(AddressDataService.getAllCitiesAsync())
    Promise.all(promises).then(values=>{
      const [customer,cities] = values
      setCustomer(customer)
      tempCustomer = customer
      setGender(tempCustomer.gender)
      const city = cities?.find(c=>c.id === tempCustomer.cityId)
      setCityName(city?.name)
      let wardAndDistrictPromises = []
      wardAndDistrictPromises.push(AddressDataService.getDistrictsByCityId(tempCustomer.cityId))
      wardAndDistrictPromises.push(AddressDataService.getWardsByDistrictId(tempCustomer.districtId))
      return Promise.all(wardAndDistrictPromises)
    }).then(values=>{
      const [districts,wards] = values
      const ward = wards?.find(w=>w.id === tempCustomer.wardId)
      const district = districts?.find(d=>d.id === tempCustomer.districtId)
      setWardName(ward?.name)
      setDistrictName(district?.name)
    })
  }

  useEffect(async () => {
    getInitData()
  }, [])

  const gotoEditCustomerPage = () => {
    history.push(`/customer/edit/${match?.params?.customerId}`)
  }

  const onDeleteCustomer = () => {
    setShowConfirm(true)
  }

  const handleDeleteItem = async (id) => {
    await customerDataService.deleteCustomerByIdAsync(id).then((res) => {
      if (res) {
        message.success(pageData.customerDeleteSuccess)
        goBack()
      } else {
        message.error(pageData.customerDeleteFail)
      }
    })
  }

  // Insert the name into the message
  const formatDeleteMessage = (name) => {
    const mess = t(pageData.confirmDeleteMessage, { name })
    return mess
  }

  const onDiscard = () => {
    setShowConfirm(false)
  }

  const goBack = () => {
    history.push('/customer')
  }

  const getNameGender = (valueGender) => {
    let nameGender = ''
    if (valueGender === parseInt(CustomerGenderConstant.Male)) {
      nameGender = pageData.male
    } else if (valueGender === parseInt(CustomerGenderConstant.Female)) {
      nameGender = pageData.female
    } else {
      nameGender = pageData.other
    }
    return nameGender
  }

  return (
    <div className={isTabletOrMobile ? 'responsive' : ''}>
      <Row className="shop-row-page-header">
        <Col xs={24} sm={24} lg={12}>
          <PageTitle content={customer?.fullName} />
        </Col>
        <Col xs={24} sm={24} lg={12}>
          <ActionButtonGroup
            arrayButton={[
              {
                action: (
                  <Button type="primary" className="btn-edit" onClick={() => gotoEditCustomerPage()}>
                    {pageData.btnEdit}
                  </Button>
                ),
                permission: PermissionKeys.EDIT_CUSTOMER
              },
              {
                action: (
                  <a onClick={goBack} className="action-cancel">
                    {pageData.btnLeave}
                  </a>
                ),
                permission: null
              },
              {
                action: (
                  <a className="action-delete" onClick={() => onDeleteCustomer()}>
                    {pageData.btnDelete}
                  </a>
                ),
                permission: PermissionKeys.EDIT_CUSTOMER
              }
            ]}
          />
        </Col>
      </Row>
      <div className="clearfix"></div>

      {isTabletOrMobile
        ? (
          <>
            <div className="customer-detail-card-responsive">
              <div className="customer-detail-box">
                <div className="card-image">
                  <Image
                    className="thumbnail"
                    width={176}
                    src={customer?.thumbnail ?? 'error'}
                    fallback={images.imgDefault}
                  />
                </div>
                <div className="info-container">
                  <div className="other-info-box">
                    <div className="total">
                      <span className="text-left">{pageData.totalOrder}</span>
                      <span className="total-amount">
                        <b>{formatNumber(customer?.totalOrder)}</b>
                      </span>
                    </div>
                    <div className="total">
                      <span className="text-left">{pageData.totalMoney}</span>
                      <span className="total-amount">
                        <b>{formatCurrency(customer?.totalMoney)}</b>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="general-info-card-responsive">
              <div className="title-session">
                <span>{pageData.generalInformation}</span>
              </div>
              <div className="detail-container">
                <div>
                  <p className="text-label">{pageData.name}</p>
                  <p className="text-detail">{customer?.fullName ?? '-'}</p>
                </div>
                <div>
                  <p className="text-label">{pageData.phone}</p>
                  <p className="text-detail">
                    {customer?.phoneNumber}
                  </p>
                </div>
                <div>
                  <p className="text-label">{pageData.email}</p>
                  <p className="text-detail">{customer?.email ?? '-'}</p>
                </div>
                <div>
                  <p className="text-label">{pageData.birthday}</p>
                  <p className="text-detail">
                    {customer?.birthday ? moment.utc(customer?.birthday).local().format(DateFormat.DD_MM_YYYY) : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-label">{pageData.gender}</p>
                  <p className="text-detail">{getNameGender(gender)}</p>
                </div>
                <div>
                  <p className="text-label">{pageData.address}</p>
                  <p className="text-detail">{customer?.address}</p>
                </div>
                <div>
                  <p className="text-label">{pageData.city}</p>
                  <p className="text-detail">{cityName ?? '-'}</p>
                </div>
                <div>
                  <p className="text-label">{pageData.district}</p>
                  <p className="text-detail">{districtName ?? '-'}</p>
                </div>
                <div>
                  <p className="text-label">{pageData.ward}</p>
                  <p className="text-detail">{wardName ?? '-'}</p>
                </div>
              </div>
            </div>
          </>
        )
        : (
          <>
            <div className="customer-detail-card">
              <div className="title-session">
                <span>{pageData.generalInformation}</span>
              </div>
              <Row className="pb-4">
                <Col span={8}>
                  <div className="left-card">
                    <div className="left-card-image">
                      <Image
                        className="thumbnail"
                        width={176}
                        src={customer?.thumbnail ?? 'error'}
                        fallback={images.imgDefault}
                      />
                    </div>
                    <div className="info-container">
                      <div className="other-info-box">
                        <div className="total">
                          <span className="text-left">{pageData.totalOrder}</span>
                          <span className="total-amount">
                            <b>{formatNumber(customer?.totalOrder)}</b>
                          </span>
                        </div>
                        <div className="total">
                          <span className="text-left">{pageData.totalMoney}</span>
                          <span className="total-amount">
                            <b>{formatCurrency(customer?.totalMoney)}</b>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col span={16}>
                  <Row>
                    <Col span={12}>
                      <div className="detail-container-left">
                        <div>
                          <p className="text-label">{pageData.name}</p>
                          <p className="text-detail">{customer?.fullName}</p>
                        </div>
                        <div>
                          <p className="text-label">{pageData.phone}</p>
                          <p className="text-detail">
                            {customer?.phoneNumber}
                          </p>
                        </div>
                        <div>
                          <p className="text-label">{pageData.email}</p>
                          <p className="text-detail">{customer?.email ?? '-'}</p>
                        </div>
                        <div>
                          <p className="text-label">{pageData.birthday}</p>
                          <p className="text-detail">
                            {customer?.birthday
                              ? moment.utc(customer?.birthday).local().format(DateFormat.DD_MM_YYYY)
                              : '-'}
                          </p>
                        </div>
                        <div>
                          <p className="text-label">{pageData.gender}</p>
                          <p className="text-detail">{getNameGender(gender)}</p>
                        </div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="detail-container-right">
                        <div>
                          <p className="text-label">{pageData.address}</p>
                          <p className="text-detail">{customer?.address}</p>
                        </div>
                        <div>
                          <p className="text-label">{pageData.city}</p>
                          <p className="text-detail">{cityName ?? '-'}</p>
                        </div>
                        <div>
                          <p className="text-label">{pageData.district}</p>
                          <p className="text-detail">{districtName ?? '-'}</p>
                        </div>
                        <div>
                          <p className="text-label">{pageData.ward}</p>
                          <p className="text-detail">{wardName ?? '-'}</p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </>
        )}
      <DeleteConfirmComponent
        title={pageData.confirmDelete}
        content={formatDeleteMessage(customer?.fullName)}
        okText={pageData.btnDelete}
        skipPermission={true}
        cancelText={pageData.btnIgnore}
        permission={PermissionKeys.EDIT_CUSTOMER}
        onOk={() => handleDeleteItem(match?.params?.customerId)}
        onCancel={onDiscard}
        visible={showConfirm}
      />
    </div>
  )
}
