import { Row, message, Col, Button, Input } from 'antd';
import ActionButtonGroup from 'components/action-button-group/action-button-group.component';
import HorizontalButtonGroup from 'components/button-group-with-badges/button-group-with-badges.component';
import PageTitle from 'components/page-title';
import { ShopTable } from 'components/shop-table/shop-table';
import { OrderOptionDate, OrderStatus } from 'constants/order-status.constants';
import { PermissionKeys } from 'constants/permission-key.constants';
import OrderDataService from 'data-services/order/order-data.service';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import OrderList from './components/OrderList.component';
import { executeAfter } from 'utils/helpers';
import { FnbModal } from 'components/shop-modal/shop-modal-component';
import { ExclamationIcon } from 'constants/icons.constants';

export default function OrderPage(props) {
  const [currentPageNumber, setCurrentPageNumber] = useState(1)
  const [t] = useTranslation()
  const [dataSource, setDataSource] = useState([])
  const [keySearch, setKeySearch] = useState('')
  const [statusOrder, setStatus] = useState(0)
  const [filteredData, setFilterData] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [note, setNote] = useState('')
  const [orderId, setOrderId] = useState('')
  const [canceling, isCanceling] = useState(false)
  const getOrderDataAsync = async () => {
    const data = {
      pageNumber: currentPageNumber,
      pageSize: tableSettings.pageSize,
      keySearch: keySearch,
      endDate: moment().toISOString(),
      startDate: moment().subtract(30, 'days').toISOString(),
      optionDate: OrderOptionDate.ThisMonth
    }
    try {
      const res = await OrderDataService.GetOrdersAsync(data)
      const orders = res?.result
      if (orders) {
        setDataSource(orders)
        setFilterData(orders)
      }
    } catch (err) {
      message.error(err)
    }


  }
  useEffect(() => {
    getOrderDataAsync()
  }, [])
  const onOrderStatusChange = (status) => {
    executeAfter(300, () => {
      setFilterData(dataSource.filter(data => data.status === status))
      setStatus(status)
    })

  }
  const pageData = {
    title: t('order.title'),
    table: {
      searchPlaceholder: t('table.searchPlaceholder'),
      no: t('table.no'),
      name: t('table.name'),
      price: t('table.price'),
      status: t('table.status'),
      action: t('table.action'),
      feature: t('table.feature')
    },
    updateSuccess: t('order.updateSuccess'),
    cancel: t('button.cancel'),
    leave: t('button.leave'),
    save: t('button.save'),
    cancelationPlaceholder: t('order.orderCancelationPlaceholder'),
    orderCancelationRequire: t('order.orderCancelationRequire')
  }
  const tableSettings = {
    pageSize: 20
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
        getOrderDataAsync();
        setNote('')
        setOrderId('')
      }
    } catch (err) {
      console.error(err)
    }

  }
  const onOpenModal = (orderId) => {
    setOpenModal(true)
    setOrderId(orderId)
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
    if (statusOrder !== OrderStatus.New && statusOrder !== OrderStatus.ToConfirm) {
      // if order status is not canceled
      if (statusOrder !== OrderStatus.Canceled) {
        newStatus = statusOrder - 1;
      }
    }
    // if new change to cancel
    else {
      newStatus = OrderStatus.Canceled

    }
    onConfirm(orderId, newStatus)
    onCloseModal()
  }
  return (
    <>
      <Row>
        <Col xs={24} sm={12} lg={24}>
          <PageTitle content={pageData.title} />
        </Col>
        <Col xs={24} sm={24} xl={24} lg={24}>
          <HorizontalButtonGroup
            options={Object.keys(OrderStatus)}
            defaultValue={OrderStatus.New}
            dataSource={dataSource}
            className="my-4"
            onChange={onOrderStatusChange}
          />
        </Col>
        <Col span={24}>
          <OrderList
            dataSource={filteredData}
            status={statusOrder}
            permission={PermissionKeys.VIEW_ORDER}
            onConfirm={onConfirm}
            onConfirmCancel={onOpenModal}
          />

        </Col>
        <FnbModal
          cancelText={pageData.leave}
          handleCancel={onCloseModal}
          okText={pageData.save}
          content={confirmationInput()}
          visible={openModal}
          onOk={onConfirmCancel}
        />
      </Row>
    </>
  )
}
