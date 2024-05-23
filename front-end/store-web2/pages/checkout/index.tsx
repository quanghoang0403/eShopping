'use client'
import { useState } from 'react'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import PaymentMethod from '@/components/Checkout/PaymentMethod'
import Image from 'next/image'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { useAppMutation } from '@/hooks/useQuery'
import { trackPromise } from 'react-promise-tracker'
import OrderService from '@/services/order.service'
import toast from 'react-hot-toast'
import { sessionActions } from '@/redux/features/sessionSlice'
import SEO from '@/components/Layout/SEO'
import CustomerInfo, { defaultCustomerInfo } from '@/components/Common/Customer/CustomerInfo'
import SummaryPrice from '@/components/Checkout/SummaryPrice'
import CartList from '@/components/Checkout/CartList'

const CheckoutPage = () => {
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
        toast.error('Tạo đơn hàng thất bại, vui lòng thử lại hoặc liên hệ tổng đài để hỗ trợ')
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
        if (res) {
          redirectToOrderDetail()
        }
      } else {
        toast.error('Không tìm thấy đơn hàng, vui lòng thanh toán lại hoặc liên hệ tổng đài')
      }
    }
    void transferConfirm()
  }

  const onSubmit: SubmitHandler<FieldValues> = (data: any) => {
    const payload = { ...data, CartItems: cartItems }
    mutation.mutate(payload)
  }

  const renderLeft = () => {
    return (
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <CustomerInfo register={register} errors={errors} isShipping customer={defaultCustomerInfo} />
          <PaymentMethod register={register} errors={errors} />
          <ButtonPrimary className="mt-8 w-full">Thanh toán</ButtonPrimary>
        </form>
        {/* <DialogPopup
          open={isShowDialogPayment}
          title="Thanh toán qua QR"
          content={contentDialog}
          msgCancel="Hủy"
          msgConfirm="Đã Chuyển khoản"
          onCancel={() => redirectToOrderDetail()}
          onConfirm={() => confirmTransfer()}
          onHandle={() => setIsShowDialogPayment(false)}
        /> */}
      </div>
    )
  }

  const renderPage = () => {
    return (
      <>
        <div className="mb-16">
          <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold ">Thanh toán đơn hàng</h2>
        </div>

        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-[36%] ">
            <h3 className="text-lg font-semibold">Danh sách sản phẩm</h3>
            <CartList />
            <SummaryPrice />
          </div>
          <div className="flex-shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700 my-10 lg:my-0 lg:mx-10 xl:lg:mx-14 2xl:mx-16 "></div>
          <div className="flex-1">{renderLeft()}</div>
        </div>
      </>
    )
  }

  return (
    <>
      <SEO title="Thanh toán" />
      {/* <div className="nc-CheckoutPage">
        <div className="container py-16 lg:pb-28 lg:pt-20 ">{totalQuantity > 0 ? renderPage() : <div>Không có sản phẩm nào trong giỏ hàng</div>}</div>
      </div> */}
      <div className="nc-CheckoutPage">
        <div className="container py-16 lg:pb-28 lg:pt-20 ">{renderPage()}</div>
      </div>
    </>
  )
}

export default CheckoutPage
