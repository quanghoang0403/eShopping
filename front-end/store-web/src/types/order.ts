enum EnumOrderStatus {
  New = 0,
  Returned = 1,
  Canceled = 2,
  Confirmed = 3,
  Processing = 4,
  Delivering = 5,
  Completed = 6,
}

interface IPaymentMethod {
  id: number
  name: string
  icon: string
}

interface ICartItem {
  productId: string
  productName: string
  productUrl: string
  productPriceId: string
  priceName: string
  priceValue: number
  priceDiscount?: number
  percentNumber?: number
  quantity: number
  quantityLeft: number
  thumbnail: string
}

interface IOrder {
  id: string
  code: string
  status: EnumOrderStatus
  createdTime: string
  shipFullAddress: string
  statusName: string
  totalQuantity: number
  deliveryFee: number
  totalPrice: number
  totalAmount: number
  orderItems: IOrderItemDto[]
}

interface IOrderItemDto {
  thumbnail: string
  priceName: string
  quantity: number
}

interface IOrderItem {
  // id: string
  // orderId: string
  // productId: string
  productUrl: string
  // productName: string
  percentNumber?: number
  thumbnail: string
  quantity: number
  // priceName: string
  itemName: string
  priceValue: number
  priceDiscount?: number
  totalPriceValue: number
  totalPriceDiscount: number
  totalPrice: number
}
interface IOrderDetail {
  id: string
  createdTime: string
  code: string
  status: EnumOrderStatus
  statusName: string
  shipName: string
  shipAddress: string
  shipFullAddress: string
  shipEmail?: string
  shipPhoneNumber: string
  cityId?: number
  districtId?: number
  wardId?: number
  note?: string
  reason?: string
  deliveryFee: number
  totalQuantity: number
  totalPrice: number
  totalAmount: number
  orderItems: IOrderItem[]
}
interface IOrderHistory {
  id: string
  orderId: string
  actionName: string
  performedBy: string
  note: string
  createdTime: string
}

interface IGetOrdersRequest extends IBaseRequest {
  startDate: Date
  endDate: Date
}

interface IGetOrdersResponse extends IBaseResponse {
  orders: IOrder[]
}

interface IUpdateOrderRequest {
  orderId: string
  shipName: string
  shipAddress: string
  shipEmail?: string
  shipPhoneNumber: string
  note?: string
}

interface ICreateOrderRequest {
  cartItem: ICartItem[]
  shipName: string
  shipAddress: string
  shipEmail?: string
  shipPhoneNumber: string
  note?: string
  shipCityId?: number
  shipDistrictId?: number
  shipWardId?: number
}

interface ICreateOrderResponse {
  isSuccess: boolean
  orderId?: string
  orderItem?: IProductPrice[]
}
