import { env } from 'env'

export const HubConnectionConstants = {
  ORDER_HUB: `${env.REACT_APP_ROOT_DOMAIN}/orderHub`
}

export const OrderHubConstants = {
  RECEIVE_ORDER: 'ReceiveOrder',
  UPDATE_STATUS_BY_CUSTOMER: 'UpdateStatusByCustomer',
  UPDATE_ORDER_BY_CUSTOMER: 'UpdateOrderByCustomer'
}

