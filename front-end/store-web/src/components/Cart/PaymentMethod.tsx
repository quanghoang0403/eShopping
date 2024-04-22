'use client'
import OrderService from '@/services/order.service'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function PaymentMethod() {
  const [paymentOptions, setPaymentOptions] = useState<IPaymentMethod[]>()
  const { t } = useTranslation()
  useEffect(() => {
    const fetchPaymentOptions = async () => {
      const res = await OrderService.getPaymentMethods()
      if (res.data) {
        setPaymentOptions([...res.data])
      }
    }
    void fetchPaymentOptions()
  }, [])

  useEffect(() => {
    console.log(paymentOptions)
  }, [paymentOptions])

  return (
    <>
      <div>
        <label htmlFor="" className="my-4 block">
          Phương thức thanh toán
        </label>
        {paymentOptions &&
          paymentOptions.map((option) => (
            <div key={option.id} className="mb-2">
              <label className="inline-flex items-center cursor-pointer">
                <input type="radio" className="form-radio h-5 w-5 text-indigo-600 cursor-pointer" name="paymentMethodId" value={option.id} />
                <Image width={24} height={24} src={option.icon} className="ml-3" alt="TRANSFER_VA" />
                <span className="ml-2 inline flex items-center">{t(option.name)}</span>
              </label>
            </div>
          ))}
      </div>
    </>
  )
}
