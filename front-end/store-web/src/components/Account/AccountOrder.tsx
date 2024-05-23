import Price from '@/shared/Price'
import ButtonSecondary from '@/shared/Button/ButtonSecondary'
import Image from 'next/image'
import { formatCurrency } from '@/utils/string.helper'
import OrderItemList from '../Common/Order/OrderItemList'

const orderList: IOrder[] = [
  {
    id: '1',
    code: '1',
    status: 6,
    shipFullAddress: '465 Nguyễn Văn Cừ',
    createdTime: 'Sep 12, 2023',
    statusName: 'Đã giao',
    totalQuantity: 3,
    totalPrice: 300000,
    totalAmount: 250000,
    deliveryFee: 20000,
    orderItems: [
      {
        quantity: 1,
        priceValue: 20000,
        priceDiscount: 15000,
        percentNumber: 10,
        totalPrice: 240000,
        productName: 'Áo kẻ sọc',
        priceName: 'Trắng',
        thumbnail: '/imgs/productHighlight/Classic Short Sleeves Shirt.jpg',
      },
      {
        quantity: 2,
        priceValue: 20000,
        priceDiscount: 15000,
        percentNumber: 10,
        totalPrice: 240000,
        productName: 'Áo kẻ sọc',
        priceName: 'Đen',
        thumbnail: '/imgs/productHighlight/Basic Tee With Long Sleeves Red.jpg',
      },
    ],
  },
  {
    id: '2',
    code: '3',
    status: 6,
    shipFullAddress: '465 Nguyễn Văn Cừ',
    createdTime: 'Aug 8, 2023',
    statusName: 'Đã giao',
    totalQuantity: 3,
    totalPrice: 300000,
    totalAmount: 250000,
    deliveryFee: 20000,
    orderItems: [
      {
        quantity: 2,
        priceValue: 20000,
        totalPrice: 240000,
        priceDiscount: 0,
        productName: 'Áo kẻ sọc',
        priceName: 'Trắng',
        thumbnail: '/imgs/productHighlight/Basic Tee With Long Sleeves Red.jpg',
      },
    ],
  },
]

const AccountOrder = () => {
  const renderOrder = (order: IOrder) => {
    return (
      <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden z-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 sm:p-8 bg-slate-50 dark:bg-slate-500/5">
          <div>
            <p className="text-lg font-semibold">{`Đơn hàng #${order.code}`}</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 sm:mt-2">
              <span className="text-base">{formatCurrency(order.totalAmount)}</span>
              <span className="mx-3">·</span>
              <span>{order.createdTime}</span>
              <span className="mx-3">·</span>
              <span className="text-primary-500">{order.statusName}</span>
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 sm:mt-2">
              <span>Địa chỉ giao hàng: {order.shipFullAddress}</span>
            </p>
          </div>
          <div className="mt-3 sm:mt-0">
            <ButtonSecondary targetBlank href={`/order/${order.id}`} sizeClass="py-2.5 px-4 sm:px-6" fontSize="text-sm font-medium">
              Xem đơn hàng
            </ButtonSecondary>
          </div>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-700 p-2 sm:p-8 divide-y divide-y-slate-200 dark:divide-slate-700">
          <OrderItemList orderItems={order.orderItems} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* HEADING */}
      <h2 className="text-2xl sm:text-3xl font-semibold">Lịch sử đơn hàng</h2>
      {orderList.map((order) => renderOrder(order))}
    </div>
  )
}

export default AccountOrder
