'use client'
import OrderService from '@/services/order.service'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import ErrorForm from '@/shared/Controller/ErrorForm'

interface IProps {
  register: UseFormRegister<FieldValues>
  errors: FieldErrors<FieldValues>
}

export default function PaymentMethod(props: IProps) {
  const { register, errors } = props
  const [paymentOptions, setPaymentOptions] = useState<IPaymentMethod[]>()
  const { t } = useTranslation()
  useEffect(() => {
    const fetchPaymentOptions = async () => {
      const res = await OrderService.getPaymentMethods()
      if (res) {
        setPaymentOptions([...res])
      }
    }
    void fetchPaymentOptions()
  }, [])

  useEffect(() => {
    console.log(paymentOptions)
  }, [paymentOptions])

  return (
    <>
      <div className="border border-slate-200 dark:border-slate-700 rounded-xl ">
        <div className="p-6 flex flex-col sm:flex-row items-start">
          <span className="hidden sm:block">
            <svg className="w-6 h-6 text-slate-700 dark:text-slate-400 mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3.92969 15.8792L15.8797 3.9292"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.1013 18.2791L12.3013 17.0791"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.793 15.5887L16.183 13.1987"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3.60127 10.239L10.2413 3.599C12.3613 1.479 13.4213 1.469 15.5213 3.569L20.4313 8.479C22.5313 10.579 22.5213 11.639 20.4013 13.759L13.7613 20.399C11.6413 22.519 10.5813 22.529 8.48127 20.429L3.57127 15.519C1.47127 13.419 1.47127 12.369 3.60127 10.239Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M2 21.9985H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div className="sm:ml-8">
            <h3 className=" text-slate-700 dark:text-slate-400 flex ">
              <span className="uppercase tracking-tight">PHƯƠNG THỨC THANH TOÁN</span>
            </h3>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700 px-6 py-7 space-y-6 block">
          {paymentOptions &&
            paymentOptions.map((option) => (
              <div key={option.id} className="mb-2">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    className="form-radio h-5 w-5 text-indigo-600 cursor-pointer"
                    {...register('PaymentMethodId', { required: true })}
                    value={option.id}
                  />
                  <Image width={24} height={24} src={option.icon} className="ml-3" alt={t(option.name)} />
                  <span className="ml-2 inline flex items-center">{t(option.name)}</span>
                </label>
              </div>
            ))}
          {errors && <ErrorForm name="paymentMethodId" label="Phương thức thanh toán" errors={errors} />}
        </div>
      </div>
    </>
  )
}
