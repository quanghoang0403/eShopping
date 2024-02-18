// Bill configs
export const defaultBillConfigData = {
  // Settings
  fontFamily: "Plus Jakarta Sans",
  fontSize: "12px",

  //Visible
  sessionOrderNoVisible: "inline-flex",
  locationVisible: "inline-flex",
  createdSessionTimeVisible: "inline-flex",
  completedSessionTimeVisible: "inline-flex",
  toppingVisible: "block",
  optionVisible: "block",
  itemPriceVisible: "inline-flex",
  itemPriceInVisible: "none",
};

// Static data for bill template
export const staticData = {
  title: "HOÁ ĐƠN BÁN HÀNG NÈ",
  orderCodeLabel: "Mã đơn",
  situationLabel: "Vị trí",
  timeLabel: "Thời gian",
  cashierLabel: "Thu ngân",
  customerLabel: "Khách hàng",
  customerPhoneLabel: "Đ.Thoại KH",
  customerAddressLabel: "Địa chỉ KH",
  itemNameColumnLabel: "TÊN MÓN",
  itemQuantityColumnLabel: "SL",
  itemPriceColumnLabel: "Đ.GIÁ",
  totalAmountColumnLabel: "T.TIỀN",
  subTotalAmountLabel: "Tổng tạm tính",
  discountAmountLabel: "Giảm giá",
  feeAmountLabel: "Phí",
  taxAmountLabel: "Thuế",
  shippingFeeLabel: "Phí giao hàng",
  totalAmountLabel: "TỔNG CỘNG",
  cashLabel: "Tiền mặt",
  refundsLabel: "Tiền trả lại",
  passwordWifiLabel: "password",
};

// Sample real data insert with new order info
export const dynamicData = {
  sessionOrderNoValue: "IS001/I0001",
  locationValue: "Bàn 1 - Lầu 1",
  createdSessionTimeValue: "12/01/2023 &nbsp; 12:20:28",
  completedSessionTimeValue: "12/01/2023 &nbsp; 12:40:56",
  totalQuantity: "3",
  totalAmountValue: "140,000",
};

// Sample real data
export const sampleItemList = [
  {
    isCombo: false,
    itemName: "Trà sữa (M)",
    quantity: "1",
    unitPrice: "20,000",
    totalPrice: "20,000",
    totalAmount: "20,000",
    toppings: [
      {
        itemName: "Trân châu",
        quantity: "1",
        unitPrice: "5,000",
        totalPrice: "5,000",
        totalAmount: " ",
      },
    ],
    options: [
      {
        itemName: "Đường (30%)",
      },
      {
        itemName: "Đá (50%)",
      },
    ],
  },
  {
    isCombo: true,
    itemName: "Combo sáng",
    quantity: "1",
    unitPrice: "95,000",
    totalPrice: "95,000",
    totalAmount: "95,000",
    toppings: [
      {
        itemName: "Phở (Vừa)",
        quantity: "1",
        unitPrice: " ",
        totalPrice: " ",
        totalAmount: " ",
        toppings: [
          {
            itemName: "Trứng trần",
            quantity: "1",
            unitPrice: " ",
            totalPrice: " ",
            totalAmount: " ",
          },
        ],
      },
      {
        itemName: "Cà phê sữa đá (S)",
        quantity: "1",
        unitPrice: " ",
        totalPrice: " ",
        totalAmount: " ",
        toppings: [],
      },
    ],
  },
  {
    isCombo: false,
    itemName: "Sữa chua phúc bồn tử hạt chia rang...(M)",
    quantity: "1",
    unitPrice: "20,000",
    totalPrice: "20,000",
    totalAmount: "20,000",
    toppings: [],
  },
];
