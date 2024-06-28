export const EnumOrderStatus = {
  New: 0,
  Confirmed: 1,
  Delivering: 2,
  Completed: 3,
  Returned: 4,
  Canceled: 5,
}

const orderStatusTranslations: Record<number, string> = {
  [EnumOrderStatus.New]: 'Mới',
  [EnumOrderStatus.Confirmed]: 'Đã được xác nhận',
  [EnumOrderStatus.Delivering]: 'Đang giao hàng',
  [EnumOrderStatus.Completed]: 'Đã hoàn thành',
  [EnumOrderStatus.Returned]: 'Đã được trả lại',
  [EnumOrderStatus.Canceled]: 'Đã hủy',
}

export const getOrderStatusText = (status: number): string => {
  return orderStatusTranslations[status] || 'Trạng thái không xác định'
}
