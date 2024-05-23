import Price from '@/shared/Price'
import ButtonSecondary from '@/shared/Button/ButtonSecondary'
import Image from 'next/image'

const orderList: IOrder[] = [
  {
    id: '1',
    code: '1',
    status: 6,
    shipFullAddress: '465 Nguyễn Văn Cừ',
    createdTime: 'Now',
    statusName: 'Completed',
    totalQuantity: 3,
    totalPrice: 300000,
    totalAmount: 250000,
    deliveryFee: 20000,
    orderItems: [
      { quantity: 1, priceName: 'Áo kẻ sọc trắng', thumbnail: '/imgs/productHighlight/Classic Short Sleeves Shirt.jpg' },
      { quantity: 2, priceName: 'Áo kẻ sọc đen', thumbnail: '/imgs/productHighlight/Basic Tee With Long Sleeves Red.jpg' },
    ],
  },
  {
    id: '2',
    code: '3',
    status: 6,
    shipFullAddress: '465 Nguyễn Văn Cừ',
    createdTime: 'Now',
    statusName: 'Completed',
    totalQuantity: 3,
    totalPrice: 300000,
    totalAmount: 250000,
    deliveryFee: 20000,
    orderItems: [{ quantity: 2, priceName: 'Áo kẻ sọc đen', thumbnail: '/imgs/productHighlight/Basic Tee With Long Sleeves Red.jpg' }],
  },
]

const AccountOrder = () => {
  const renderOrderItem = (orderItem: any, index: number) => {
    const { image, name } = orderItem
    return (
      <div key={index} className="flex py-4 sm:py-7 last:pb-0 first:pt-0">
        <div className="relative h-24 w-16 sm:w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <Image fill sizes="100px" src={image} alt={name} className="h-full w-full object-cover object-center" />
        </div>

        <div className="ml-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div>
                <h3 className="text-base font-medium line-clamp-1">{name}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  <span>{'Natural'}</span>
                  <span className="mx-2 border-l border-slate-200 dark:border-slate-700 h-4"></span>
                  <span>{'XL'}</span>
                </p>
              </div>
              <Price className="mt-0.5 ml-2" />
            </div>
          </div>
          <div className="flex flex-1 items-end justify-between text-sm">
            <p className="text-gray-500 dark:text-slate-400 flex items-center">
              <span className="hidden sm:inline-block">Qty</span>
              <span className="inline-block sm:hidden">x</span>
              <span className="ml-2">1</span>
            </p>

            <div className="flex">
              <button type="button" className="font-medium text-indigo-600 dark:text-primary-500 ">
                Leave review
              </button>
            </div>
          </div>
        </div>

        <div className="relative mr-4">
          <Image width={150} height={150} src={order.orderItems[0].thumbnail} alt="" className="rounded-lg h-fit w-full w-32" />
          <span className="shadow absolute top-3 right-2 px-1 py-0.5 text-xs rounded-lg text-gray-900 bg-white font-semibold">#{order.code}</span>
        </div>
        <div className="flex flex-col justify-between w-full">
          <div className="flex flex-col">
            <div>
              <p className="text-sm text-gray-900 line-clamp-2">Đ/c giao hàng: {order.shipFullAddress}</p>
            </div>
            {order.orderItems.length > 0 &&
              order.orderItems.slice(0, 3).map((item, index) => {
                return (
                  <div key={index} className="flex items-center mt-1">
                    <p className="text-sm mr-2">{`${item.quantity} x ${item.priceName}`}</p>
                  </div>
                )
              })}
            {order.orderItems.length > 3 && (
              <div key={index} className="flex items-center mt-1">
                <p className="text-sm mr-2">...</p>
              </div>
            )}
          </div>
          <div className="flex flex-row justify-between mt-4 text-sm zmd:text-base text-gray-900 font-semibold">
            <div>
              <p>{order.statusName}</p>
            </div>
            <div>
              <p>{formatCurrency(order.totalAmount)}</p>
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
            <p className="text-lg font-semibold">#WU3746HGG12</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 sm:mt-2">
              <span>Aug 8, 2023</span>
              <span className="mx-2">·</span>
              <span className="text-primary-500">Delivered</span>
            </p>
          </div>
          <div className="mt-3 sm:mt-0">
            <ButtonSecondary sizeClass="py-2.5 px-4 sm:px-6" fontSize="text-sm font-medium">
              View Order
            </ButtonSecondary>
          </div>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-700 p-2 sm:p-8 divide-y divide-y-slate-200 dark:divide-slate-700">
          {renderOrderItem(order.orderItems)}
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
