import Image from 'next/image'

export default function PaymentMethod() {
  const paymentOptions = [
    { id: 0, label: 'Thanh toán tiền mặt khi nhận hàng', img: '/svgs/payment/cash.svg' },
    { id: 1, label: 'Ví Momo', img: '/svgs/payment/momo.svg' },
    { id: 2, label: 'Ví Zalopay', img: '/svgs/payment/zalo_pay.svg' },
    { id: 3, label: 'Ví ShopeePay', img: '/svgs/payment/airpay.svg' },
    { id: 4, label: 'QR Chuyển khoản', img: '/svgs/payment/transfer_va.svg' },
    { id: 5, label: 'Thanh toán VNPay - QR', img: '/svgs/payment/vn_pay.svg' },
    { id: 6, label: 'Thẻ ATM nội địa/ Internet Banking', img: '/svgs/payment/atm.svg' },
    { id: 7, label: 'Thẻ tín dụng/ Thẻ quốc tế', img: '/svgs/payment/credit_card.svg' },
  ]

  return (
    <>
      <div>
        <label htmlFor="" className="my-4 block">
          Phương thức thanh toán
        </label>
        {paymentOptions.map((option) => (
          <div key={option.id} className="mb-2">
            <label className="inline-flex items-center cursor-pointer">
              <input type="radio" className="form-radio h-5 w-5 text-indigo-600 cursor-pointer" name="paymentMethodId" value={option.id} />
              <Image width={24} height={24} src={option.img} className="ml-3" alt="TRANSFER_VA" />
              <span className="ml-2 inline flex items-center">{option.label}</span>
            </label>
          </div>
        ))}
      </div>
    </>
  )
}
