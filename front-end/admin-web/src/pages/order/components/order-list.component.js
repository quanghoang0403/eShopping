import { Col, Image, Row, Card, Button, message } from 'antd';
import Meta from 'antd/lib/card/Meta';
import { DeliveryGuy } from 'constants/icons.constants';
import './order-list.component.scss'
import { formatTextNumber, getCurrency, hasPermission } from 'utils/helpers';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { OrderStatus, OrderStatusColor } from 'constants/order-status.constants';
import { useHistory } from 'react-router-dom';
export default function OrderList(props) {
  const { dataSource, permission, status, onConfirm, onConfirmCancel } = props
  const history = useHistory()
  const [t] = useTranslation();
  const pageData = {
    titleDetail:t('order.titleDetail'),
    title: t('order.orderName'),
    location: t('order.location'),
    createTime: t('order.orderCreateDate'),
    totalBill: t('order.totalBill'),
    payment: t('order.payment'),
    paymentStatus: t('order.paymentStatus'),
    cancel: t('button.cancel'),
    status: [
      t('order.statusNew'),
      t('order.statusConfirm'),
      t('order.statusDeliveringButton'),
      t('order.statusCompleteButton'),
      t('order.statusReturn'),
      t('order.statusCancel')
    ]

  }
  const renderButton = (id) => {
    return (
      hasPermission(permission) && status != 4 &&
      <div className='btn-container'>
        <Button type="primary" onClick={(event) => {onConfirm(id, status === OrderStatus.Canceled ? OrderStatus.ToConfirm : status + 1, '');event.stopPropagation()}} >
          {status === pageData.status.length - 1 ? pageData.status[1] : pageData.status[status + 1]}
        </Button>
        {status !== OrderStatus.Canceled && <Button type="primary" onClick={(event) => {onConfirmCancel(id);event.stopPropagation()}} danger>{pageData.cancel}</Button>}
      </div>

    );
  }
  return (
    <Row gutter={[8, 8]}>

      {dataSource?.filter(data => data?.status == status)?.map(data => {
        return (
          <Col xs={24} sm={24} md={8} lg={8}>
            <Card className="order-card" onClick={()=> history?.push(`order/detail/${data?.id}`)}>
              <Meta avatar={<DeliveryGuy />} title={pageData.title} description={'#' + data?.code} className="mb-4" />
              <hr />
              <div className={`${OrderStatusColor[status]} mt-3 order-card-content`}>
                <div className="w-100 order-content">
                  <b>{pageData.totalBill}:</b>
                  <p className="">{formatTextNumber(data?.totalPrice) + getCurrency()}</p>
                </div>
                <div className="w-100 order-content">
                  <b>{pageData.createTime}:</b>
                  <p> {moment(data?.createdTime).format('DD/MM/YYYY, hh:mm a')}</p>
                </div>
                <div className="w-100 order-content">
                  <b>{pageData.location}:</b>
                  <div>{data?.shipAddress.length > 15 ? data?.shipAddress.slice(0, 15).concat('...') : data?.shipAddress}</div>
                </div>
                <div className="w-100 order-content">
                  <b>{pageData.payment}:</b>
                  <p> {data?.paymentMethodName}</p>
                </div>
                <div className="w-100 order-content">
                  <b>{pageData.paymentStatus}:</b>
                  <div className="scheduled-time"> {data?.orderPaymentStatusName}</div>
                </div>
                {renderButton(data?.id)}
              </div>
            </Card>
          </Col>
        );
      })}


    </Row>
  );
}
