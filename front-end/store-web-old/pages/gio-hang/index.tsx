import React, { useState } from 'react'
import SEO from '@/components/Layout/SEO'
import Image from 'next/image'
import { formatCurrency } from '@/utils/string.helper'
import CartList from '@/components/Cart/CartList'
import Title from '@/components/Common/Title'
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook'
import { useAppMutation, useAppQuery } from '@/hooks/queryHook'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { sessionActions } from '@/redux/features/sessionSlice'
import CustomerInfo, { defaultCustomerInfo } from '@/components/Common/CustomerInfo'
import OrderService from '@/services/order.service'
import WhiteCard from '@/components/Common/WhiteCard'
import { trackPromise } from 'react-promise-tracker'
import PaymentMethod from '@/components/Cart/PaymentMethod'
import DialogPopup from '@/components/Common/DialogPopup'
import { notifyError } from '@/components/Common/Notification'
import { useRouter } from 'next/router'

export default function CartPage() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ mode: 'onBlur', criteriaMode: 'all' })
  const router = useRouter()
  const [isShowDialogPayment, setIsShowDialogPayment] = useState(false)
  const [orderResponse, setOrderResponse] = useState<ICreateOrderResponse>()
  const [contentDialog, setContentDialog] = useState(<></>)
  const dispatch = useAppDispatch()
  const cartItems = useAppSelector((state) => state.session.cartItems)
  const totalQuantity = useAppSelector((state) => state.session.totalQuantity)
  const totalPrice = useAppSelector((state) => state.session.totalPrice)

  const mutation = useAppMutation(
    async (data: ICreateOrderRequest) => trackPromise(OrderService.checkout(data)),
    async (res: ICreateOrderResponse) => {
      if (res.isSuccess) {
        setOrderResponse(res)
        switch (res.paymentMethodId) {
          case 0: {
            // COD
            break
          }
          case 4: {
            // QR Code
            setContentDialog(<Image className="mx-auto" alt="" src={res.paymentInfo.paymentUrl} width={450} height={582} />)
            setIsShowDialogPayment(true)
            break
          }
          case 5: // VnPay
          case 6: // PayOS
          case 7: // ATM
          case 8: {
            // Card
            router.push(res.paymentInfo.paymentUrl)
            break
          }
          default: {
            break
          }
        }
        dispatch(sessionActions.resetCart())
      } else {
        notifyError('Tạo đơn hàng thất bại, vui lòng thử lại hoặc liên hệ tổng đài để hỗ trợ')
      }
    }
  )

  const redirectToOrderDetail = () => {
    router.push(`/don-hang/${orderResponse?.orderId}`)
  }

  const confirmTransfer = () => {
    const transferConfirm = async () => {
      if (orderResponse?.orderCode) {
        const res = await OrderService.transferConfirm({ orderCode: orderResponse?.orderCode })
        if (res.data) {
          redirectToOrderDetail()
        }
      } else {
        notifyError('Không tìm thấy đơn hàng, vui lòng thanh toán lại hoặc liên hệ tổng đài')
      }
    }
    void transferConfirm()
  }

  const onSubmit: SubmitHandler<FieldValues> = (data: any) => {
    const payload = { ...data, CartItems: cartItems }
    mutation.mutate(payload)
  }
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
              <PaymentMethod register={register} errors={errors} />
              <button className="text-lg mt-4 w-full rounded-md bg-blue-500 py-2 font-medium text-white hover:bg-blue-600">Thanh toán</button>
            </form>
          </WhiteCard>
        </section>
        <DialogPopup
          open={isShowDialogPayment}
          title="Thanh toán qua QR"
          content={contentDialog}
          msgCancel="Hủy"
          msgConfirm="Đã Chuyển khoản"
          onCancel={() => redirectToOrderDetail()}
          onConfirm={() => confirmTransfer()}
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