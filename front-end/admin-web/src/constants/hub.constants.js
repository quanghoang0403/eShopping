import { env } from 'env'

export const HubConnectionConstants = {
  ORDER_HUB: `${env.REACT_APP_ROOT_DOMAIN}/orderHub`
}

export const OrderHubConstants = {
  CREATE_ORDER_BY_CUSTOMER: 'CreateOrderByCustomer',
  UPDATE_ORDER_BY_CUSTOMER: 'UpdateOrderByCustomer',
  UPDATE_STATUS_BY_CUSTOMER: 'UpdateStatusByCustomer'
}

