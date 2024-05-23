import Price from '@/shared/Price'
import ButtonSecondary from '@/shared/Button/ButtonSecondary'
import Image from 'next/image'
import { formatCurrency } from '@/utils/string.helper'

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
      { quantity: 1, productName: 'Áo kẻ sọc', priceName: 'Trắng', thumbnail: '/imgs/productHighlight/Classic Short Sleeves Shirt.jpg' },
      { quantity: 2, productName: 'Áo kẻ sọc', priceName: 'Đen', thumbnail: '/imgs/productHighlight/Basic Tee With Long Sleeves Red.jpg' },
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
    orderItems: [{ quantity: 2, productName: 'Áo kẻ sọc', priceName: 'Trắng', thumbnail: '/imgs/productHighlight/Basic Tee With Long Sleeves Red.jpg' }],
  },
]

const AccountOrder = () => {
  const renderOrderItem = (orderItem: IOrderItemDto, index: number) => {
    const { thumbnail, priceName, productName, quantity } = orderItem
    return (
      <div key={index} className="flex py-4 sm:py-7 last:pb-0 first:pt-0">
        <div className="relative h-24 w-16 sm:w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <Image fill sizes="100px" src={thumbnail} alt={productName} className="h-full w-full object-cover object-center" />
        </div>

        <div className="ml-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div>
                <h3 className="text-base font-medium line-clamp-1">{productName}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  <span>{priceName}</span>
                  <span className="mx-2 border-l border-slate-200 dark:border-slate-700 h-4"></span>
                  <span>XL</span>
                </p>
              </div>
              <Price className="mt-0.5 ml-2" />
            </div>
          </div>
          <div className="flex flex-1 items-end justify-between text-sm">
            <p className="text-gray-500 dark:text-slate-400 flex items-center">
              <span className="hidden sm:inline-block">Số lượng:</span>
              <span className="inline-block sm:hidden">x</span>
              <span className="ml-2">{quantity}</span>
            </p>

            <div className="flex">
              <button type="button" className="font-medium text-indigo-600 dark:text-primary-500 ">
                Đánh giá sản phẩm
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

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
          {order.orderItems.map((orderItem, index) => renderOrderItem(orderItem, index))}
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
