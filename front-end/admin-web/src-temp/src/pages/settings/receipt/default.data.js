// Bill configs
export const defaultBillConfigData = {
  // Settings
  fontFamily: "Arial",
  fontSize: "12px",

  //Visible
  logoVisible: "inline-flex",
  addressVisible: "inline-flex",
  branchHotlineVisible: "block",
  timeVisible: "inline-flex",
  cashierNameVisible: "inline-flex",
  customerNameVisible: "inline-flex",
  customerPhoneVisible: "inline-flex",
  customerAddressVisible: "inline-flex",
  situationVisible: "inline-flex",
  subtotalVisible: "inline-flex",
  toppingVisible: "block",
  optionVisible: "block",
  discountVisible: "inline-flex",
  feeVisible: "inline-flex",
  taxVisible: "inline-flex",
  shippingVisible: "inline-flex",
  thanksMessageVisible: "block",
  wifiPasswordVisible: "inline-flex",
  barcodeVisible: "inline-flex",
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
  orderCodeValue: "#0000001",
  situationValue: "Bàn 1 > Lầu 1",
  timeValue: "12/01/2023 12:00:00",
  cashierName: "Nguyễn Thị Thu Ngân",
  customerName: "Nguyễn Trần Văn Thị Cẩm Uyên Ương",
  customerPhoneValue: "0918273940",
  customerAddressValue: "123 Cộng Hoà, Phường 3, Quận Tân Bình, Hồ Chí Minh",
  subTotalAmountValue: "250,000",
  discountAmountValue: "20,000",
  feeAmountValue: "5,000",
  taxAmountValue: "5,000",
  shippingFeeValue: "5,000",
  totalAmountValue: "245,000",
  cashValue: "250,000",
  refundsValue: "5,000",
  hotline: "0989387495",
  passwordWifiValue: "1234567890",
  wifi: "panda",
  thanksMessage: "Thank you and Have a nice day!",
  storeLogo: "",
  storeName: "SON COFFEE NÈ",
  qrCode: "",
  messageQRCode:
    "Lorem ipsum dolor sit amet consectetur. Malesuada dignissim duis in in sagittis commodo risus. Magna vel platea enim faucibus.",
};

// Sample real data
export const sampleItemList = [
  {
    itemName: "Trà sữa (M)",
    quantity: "1",
    unitPrice: "20,000",
    totalPrice: "20,000",
    toppings: [
      {
        itemName: "Trân châu đen",
        quantity: "1",
        unitPrice: "10,000",
        totalPrice: "10,000",
      },
      {
        itemName: "Trân châu trắng",
        quantity: "1",
        unitPrice: "10,000",
        totalPrice: "10,000",
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
    notes:
      "Lorem ipsum dolor sit amet consectetur. Malesuada dignissim duis in in sagittis commodo risus. Magna vel platea enim faucibus.",
  },
  {
    itemName: "Trà sữa (L)",
    quantity: "1",
    unitPrice: "20,000",
    totalPrice: "20,000",
    toppings: [
      {
        itemName: "Trân châu đen",
        quantity: "1",
        unitPrice: "10,000",
        totalPrice: "10,000",
      },
      {
        itemName: "Trân châu trắng",
        quantity: "1",
        unitPrice: "10,000",
        totalPrice: "10,000",
      },
    ],
    notes:
      "Lorem ipsum dolor sit amet consectetur. Malesuada dignissim duis in in sagittis commodo risus. Magna vel platea enim faucibus.",
  },
];
