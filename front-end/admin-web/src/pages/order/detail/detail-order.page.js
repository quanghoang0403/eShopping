import { Button, Card, Col, Input, Row, message } from 'antd';
import PageTitle from 'components/page-title';
import { useTranslation } from 'react-i18next';
import OrderDataService from 'data-services/order/order-data.service';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { StaffUserFill, WalletIcon, DeliveryGuy, Order, ExclamationIcon } from 'constants/icons.constants';
import './detail-order.component.scss'
import moment from 'moment';
import TableOrderedProducts from './table-ordered-products.component';
import { formatTextNumber, hasPermission } from 'utils/helpers';
import ActionButtonGroup from 'components/action-button-group/action-button-group.component';
import { PermissionKeys } from 'constants/permission-key.constants';
import { OrderStatus } from 'constants/order-status.constants';
import { FnbModal } from 'components/shop-modal/shop-modal-component';
export default function OrderDetail (props) {
  const {t} = useTranslation()
  const match = useRouteMatch()
  const [order,setOrder] = useState()
  const history = useHistory()
  const [note, setNote] = useState('')
  const [canceling, isCanceling] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const pageData={
    leave: t('button.leave'),
    cancel: t('button.cancel'),
    save: t('button.save'),
    titleDetail:t('order.titleDetail'),
    note:t('order.note'),
    btnDiscard: t('button.leave'),
    paymentInfoTitle:t('order.paymentInfoTitle'),
    messageCustomerFetchFail:t('order.messageCustomerFetchFail'),
    shippingDetailTitle:t('order.shippingDetailTitle'),
    updateSuccess: t('order.updateSuccess'),
    noNote:t('order.noNote'),
    customer:{
      fullName:t('customer.name'),
      phoneNumber:t('customer.phone'),
      address:t('customer.address')
    },
    order:{
      orderId:t('order.orderId'),
      receiver:t('order.receiver'),
      address:t('customer.address'),
      receiverEmail:t('order.receiverEmail'),
      receiverPhone:t('order.receiverPhone'),
      status:t('order.status'),
      orderCreateDate:t('order.orderCreateDate'),
      orderCustomerInfoTitle:t('order.orderCustomerInfoTitle'),
      detail:t('order.titleDetail')
    },
    payment:{
      paymentMethod:t('order.payment'),
      status:t('order.paymentStatus'),
      totalDiscount:t('order.totalDiscount'),
      shippingFee:t('order.shippingFee'),
      totalFinalBill:t('order.totalFinalBill'),
      totalBill:t('order.totalBill')
    },
    product:t('order.product'),
    status: [
      t('order.statusNew'),
      t('order.statusConfirm'),
      t('order.statusDelivering'),
      t('order.statusComplete'),
      t('order.statusReturn'),
      t('order.statusCancel')
    ],
    cancelationPlaceholder: t('order.orderCancelationPlaceholder'),
    orderCancelationRequire: t('order.orderCancelationRequire')
  }
  const mappingCustomerInfo = data =>{
    return{
      fullName:data?.fullName,
      phoneNumber:data?.phoneNumber,
      address:data?.address
    }
  }
  const mappingOrderInfo = data =>{
    return{
      receiver:data?.shipName,
      receiverEmail:data?.shipEmail,
      receiverPhone:data?.shipPhoneNumber,
      address:data?.shipFullAddress
    }
  }
  const onConfirm = async (orderId, status) => {
    const data = {
      orderId: orderId,
      status: status,
      note: note
    }
    try {
      const res = await OrderDataService.ChangeOrderStatusAsync(data)
      if (res) {
        message.success(pageData.updateSuccess)
        history.push('/order')
      }
    } catch (err) {
      console.error(err)
    }

  }
  const renderStatusButton = () => {
    return (
      order?.status != 4 &&
        <Button type="primary" onClick={() => onConfirm(match?.params?.orderId, order?.status === OrderStatus.Canceled ? OrderStatus.ToConfirm : order?.status + 1, '')} >
          {order?.status === pageData.status.length - 1 ? pageData.status[1] : pageData.status[order?.status + 1]}
        </Button>
    );
  }
  const renderCancelButton = () => {
    return order?.status !== 4 && order?.status !== OrderStatus.Canceled && <Button type="primary" onClick={() => setOpenModal(true)} danger>{pageData.cancel}</Button>
  }
  const confirmationInput = () => {
    return (
      <div>
        <h3>{pageData.cancelationPlaceholder}</h3>
        <Input value={note} placeholder={pageData.cancelationPlaceholder} onChange={e => setNote(e.target.value)} />
        <div className={`d-flex mt-2 ${note === '' && canceling ? '' : 'd-none'}`}>
          <ExclamationIcon />
          <b className="ml-3">{pageData.orderCancelationRequire}</b>
        </div>

      </div>

    );
  }
  const onCloseModal = () => {
    setOpenModal(false)
    isCanceling(false)
  }
  const onConfirmCancel = () => {
    isCanceling(true)
    if (note === '') return;
    let newStatus;
    // if order status is not new
    if (order?.status !== OrderStatus.New && order?.status !== OrderStatus.ToConfirm) {
      // if order status is not canceled
      if (order?.status !== OrderStatus.Canceled) {
        newStatus = order?.status - 1;
      }
    }
    // if new change to cancel
    else {
      newStatus = OrderStatus.Canceled

    }
    onCloseModal()
    onConfirm(match?.params?.orderId, newStatus)
  }
  const mappingPaymentInfo = data =>{
    return{
      paymentMethod:data?.paymentMethodName,
      status:data?.orderPaymentStatusName,
      totalBill:formatTextNumber(data?.orderItems?.reduce((acc,val)=>acc+val.priceValue*val.quantity,0)),
      totalDiscount:formatTextNumber(data?.orderItems?.reduce((acc,val)=>acc+(val.priceValue-(val.priceDiscount || val.priceValue))*val.quantity,0)),
      shippingFee:formatTextNumber(data?.deliveryFee),
      totalFinalBill:formatTextNumber(data?.orderItems?.reduce((acc,val)=>acc+(val.priceDiscount || val.priceValue)*val.quantity,0)+data?.deliveryFee)
    }
  }
  const getOrderDetail = async()=>{
    const order = await OrderDataService.GetOrderDetailAsync(match?.params?.orderId)
    if(order){
      setOrder(order)
    }
    else{
      message.error(pageData.messageCustomerFetchFail)
    }
  }
  useEffect(()=>{
    getOrderDetail()
  },[])
  const renderInfo = (title,attributes,t)=>{
    return(
      <Col span={20}>
        <b className='order-info-title'>{title}</b>
        <div className='mt-2'>
          {
            Object.keys(attributes).map(key=>{
              return(
                <div key={key} className='general-info'>
                  <p className='attribute'>{t[key]}:</p>
                  <b>{attributes[key]}</b>
                </div>
              )
            })
          }
        </div>
      </Col>
    );
  };
  return (
    <>
      <Row>
        <Col sm={24} md={24} lg={12}>
          <PageTitle content={pageData.titleDetail} />
        </Col>
        <Col sm={24} md={24} lg={12}>
          <ActionButtonGroup
            arrayButton={[
              {
                action:renderStatusButton(),
                permission: PermissionKeys.EDIT_ORDER
              },
              {
                action:renderCancelButton(),
                permission: PermissionKeys.EDIT_ORDER
              },
              {
                action: (
                  <button className="action-cancel" onClick={() => history.push('/order')}>
                    {pageData.btnDiscard}
                  </button>
                ),
                permission: 'public'
              }
            ]}
          />
        </Col>
      </Row>
      <Card className='shop-card mt-4'>
        <Row gutter={[24,8]}>
          <Col span={8} className='order-header'>
            <div>
              {pageData.order.orderId}
            </div>
            <div className='order-code'>
              #{order?.code}
            </div>
          </Col>
          <Col span={8} className='order-header'>
            <div>
              {pageData.order.orderCreateDate}
            </div>
            <div className='order-time'>
              {moment(order?.createdTime).format('DD/MM/YYYY, h:mm a')}
            </div>
          </Col>
          <Col span={8}>
            <div>{pageData.order.status}:</div>
            <div className='order-status'>{pageData.status[order?.status]}</div>
          </Col>
        </Row>
        <Row gutter={[32,24]} className='mt-4 order-info'>
          <Col sm={24} md={24} lg={12}>
            <Row gutter={[24,8]}>
              <Col span={4}>
                <div className='order-icon'>
                  <StaffUserFill/>
                </div>
              </Col>
              {renderInfo(pageData.order.orderCustomerInfoTitle,mappingCustomerInfo(order?.customer),pageData.customer)}
            </Row>
          </Col>
          <Col sm={24} md={24} lg={12}>
            <Row gutter={[24,8]}>
              <Col span={4}>
                <div className='order-icon'>
                  <Order/>
                </div>
              </Col>
              <Col span={20}>
                <b className='order-info-title'>{pageData.note}</b>
                <div className='mt-2'>{order?.note || pageData.noNote}</div>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={[32,24]} className='mt-4 order-info'>
          <Col sm={24} md={24} lg={12}>
            <Row gutter={[24,8]}>
              <Col span={4}>
                <div className='order-icon'>
                  <DeliveryGuy/>
                </div>
              </Col>
              {renderInfo(pageData.shippingDetailTitle,mappingOrderInfo(order),pageData.order)}
            </Row>
          </Col>
          <Col sm={24} md={24} lg={12}>
            <Row gutter={[24,8]}>
              <Col span={4}>
                <div className='order-icon'>
                  <WalletIcon/>
                </div>
              </Col>
              {renderInfo(pageData.paymentInfoTitle,mappingPaymentInfo(order),pageData.payment)}
            </Row>
          </Col>
        </Row>
        <Row className='mt-5'>
          <Col span={24}><h2>{pageData.product}</h2></Col>
          <Col span={24}>
            <TableOrderedProducts orderItems={order?.orderItems}/>
          </Col>
        </Row>
      </Card>
      <FnbModal
        cancelText={pageData.leave}
        handleCancel={onCloseModal}
        okText={pageData.save}
        content={confirmationInput()}
        visible={openModal}
        onOk={onConfirmCancel}
      />
    </>
  );
}
