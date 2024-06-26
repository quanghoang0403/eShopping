export const EnumOrderStatus = {
    New: 0,
    Returned: 1,
    Canceled: 2,
    Confirmed: 3,
    Processing: 4,
    Delivering: 5,
    Completed: 6,
}

const orderStatusTranslations: Record<number, string> = {
  [EnumOrderStatus.New]: 'Mới',
  [EnumOrderStatus.Returned]: 'Đã trả lại',
  [EnumOrderStatus.Canceled]: 'Đã hủy',
  [EnumOrderStatus.Confirmed]: 'Đã xác nhận',
  [EnumOrderStatus.Processing]: 'Đang xử lý',
  [EnumOrderStatus.Delivering]: 'Đang giao hàng',
  [EnumOrderStatus.Completed]: 'Hoàn thành',
}

export const getOrderStatusText = (status: number): string => {
  return orderStatusTranslations[status] || 'Trạng thái không xác định';
}