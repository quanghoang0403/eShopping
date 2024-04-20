import React, { useCallback, useState } from 'react'
import SEO from '@/components/Layout/SEO'
import Image from 'next/image'
import { formatCurrency } from '@/utils/string.helper'
import { IconButton } from '@material-tailwind/react'
import CartList from '@/components/Cart/CartList'
import Title from '@/components/Common/Title'
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook'
import Input from '@/components/Controller/Input'
import { useAppMutation, useAppQuery } from '@/hooks/queryHook'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import AuthService from '@/services/auth.service'
import { sessionActions } from '@/redux/features/sessionSlice'
import CustomerInfo, { defaultCustomerInfo } from '@/components/Common/CustomerInfo'
import OrderService from '@/services/order.service'
import WhiteCard from '@/components/Common/WhiteCard'
import { trackPromise } from 'react-promise-tracker'
import PaymentMethod from '@/components/Cart/PaymentMethod'
import DialogPopup from '@/components/Common/DialogPopup'

export default function CartPage() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ mode: 'onBlur', criteriaMode: 'all' })
  const [isShowDialogPayment, setIsShowDialogPayment] = useState(false)
  const dispatch = useAppDispatch()
  //const totalQuantity = useAppSelector((state) => state.session.totalQuantity)
  const totalQuantity = 3
  const totalPrice = useAppSelector((state) => state.session.totalPrice)

  const mutation = useAppMutation(
    async (data: ICreateOrderRequest) => trackPromise(OrderService.checkout(data)),
    // async (data: ICreateOrderRequest) => OrderService.checkout(data),
    async (res: ICreateOrderResponse) => {
      // Handle after create
    }
  )

  const onSubmit: SubmitHandler<FieldValues> = (data: any) => mutation.mutate(data)
  const renderCart = () => {
    return (
      <>
        <section className="md:w-1/2">
          <CartList />
          <WhiteCard className="mt-6">
            <div className="mb-2 flex justify-between">
              <p className="text-gray-700">Tổng tiền</p>
              <p className="text-gray-700">{formatCurrency(totalPrice)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-700">Shipping</p>
              <p className="text-gray-700">{formatCurrency(20000)}</p>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between">
              <p className="text-lg font-bold text-gray-900">
                THANH TOÁN <span className="text-sm text-gray-700 font-normal">{'(Đã bao gồm thuế VAT)'}</span>
              </p>
              <p className="mb-1 text-lg font-bold text-gray-900">{formatCurrency(totalPrice + 20000)}</p>
            </div>
          </WhiteCard>
        </section>
        <section className="mt-6 md:mt-0 md:w-1/2 h-full">
          <WhiteCard>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CustomerInfo register={register} errors={errors} isShipping customer={defaultCustomerInfo} />
              <PaymentMethod />
              <button
                onClick={() => setIsShowDialogPayment(true)}
                className="text-lg mt-4 w-full rounded-md bg-blue-500 py-2 font-medium text-white hover:bg-blue-600"
              >
                Thanh toán
              </button>
            </form>
          </WhiteCard>
        </section>
        <DialogPopup
          open={isShowDialogPayment}
          title="Thanh toán qua QR"
          content="da"
          msgCancel="Huỷ"
          msgConfirm="Xác nhận"
          onHandle={() => setIsShowDialogPayment(false)}
        />
      </>
    )
  }
  return (
    <>
      <SEO title="Giỏ hàng" />
      <div className="bg-gray-100">
        <Title title="Giỏ hàng" />
        <div className="container mx-auto pb-6 sm:pb-16 justify-center px-6 md:flex md:space-x-6 xl:px-0">
          {totalQuantity > 0 ? renderCart() : <div>Không có sản phẩm nào trong giỏ hàng</div>}
        </div>
      </div>
    </>
  )
}
