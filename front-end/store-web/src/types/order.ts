

interface IPaymentMethod {
  id: number
  name: string
  icon: string
}

interface ICartItem {
  productId: string
  productName: string
  productUrl: string
  productSizeId: string
  productSizeName: string
  productVariantId: string
  productVariantName: string
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
  status: number
  createdTime: string
  shipFullAddress: string
  statusName: string
  totalQuantity: number
  deliveryFee: number
  totalPrice: number
  totalAmount: number
  orderItems: IOrderItem[]
}

interface IOrderItem {
  // id: string
  // orderId: string
  // productId: string
  productUrl?: string
  productName: string
  percentNumber?: number
  thumbnail: string
  quantity: number
  productVariantName: string
  itemName?: string
  priceValue: number
  priceDiscount?: number
  totalPrice: number
}
interface IOrderDetail {
  id: string
  createdTime: string
  code: string
  status: number
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

interface IGetOrdersRequest extends IPagingRequest {
  startDate: Date
  endDate: Date
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
  paymentMethodId: number
  orderId?: string
  orderCode?: number
  cartItems?: ICartItem[]
  paymentInfo?: any
}
