'use client'
import NcInputNumber from '@/shared/NcInputNumber'
import Price from '@/shared/Price'
import { Product, PRODUCTS } from '@/data/data'
import { useState } from 'react'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import PaymentMethod from '@/components/Checkout/PaymentMethod'
import Image from 'next/image'
import Link from 'next/link'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { useAppMutation } from '@/hooks/useQuery'
import { trackPromise } from 'react-promise-tracker'
import OrderService from '@/services/order.service'
import toast from 'react-hot-toast'
import { sessionActions } from '@/redux/features/sessionSlice'
import SEO from '@/components/Layout/SEO'
import { formatCurrency } from '@/utils/string.helper'
import CustomerInfo, { defaultCustomerInfo } from '@/components/Common/Customer/CustomerInfo'
import SummaryPrice from '@/components/Checkout/SummaryPrice'

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

  const renderProduct = (item: Product, index: number) => {
    const { image, price, name } = item

    return (
      <div key={index} className="relative flex py-7 first:pt-0 last:pb-0">
        <div className="relative h-36 w-24 sm:w-28 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <Image src={image} fill alt={name} className="h-full w-full object-contain object-center" sizes="150px" />
          <Link href="/product-detail" className="absolute inset-0"></Link>
        </div>

        <div className="ml-3 sm:ml-6 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div className="flex-[1.5] ">
                <h3 className="text-base font-semibold">
                  <Link href="/product-detail">{name}</Link>
                </h3>
                <div className="mt-1.5 sm:mt-2.5 flex text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-center space-x-1.5">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M7.01 18.0001L3 13.9901C1.66 12.6501 1.66 11.32 3 9.98004L9.68 3.30005L17.03 10.6501C17.4 11.0201 17.4 11.6201 17.03 11.9901L11.01 18.0101C9.69 19.3301 8.35 19.3301 7.01 18.0001Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.35 1.94995L9.69 3.28992"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2.07 11.92L17.19 11.26"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path d="M3 22H16" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                      <path
                        d="M18.85 15C18.85 15 17 17.01 17 18.24C17 19.26 17.83 20.09 18.85 20.09C19.87 20.09 20.7 19.26 20.7 18.24C20.7 17.01 18.85 15 18.85 15Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <span>{`Black`}</span>
                  </div>
                  <span className="mx-4 border-l border-slate-200 dark:border-slate-700 "></span>
                  <div className="flex items-center space-x-1.5">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path d="M21 9V3H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M3 15V21H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M21 3L13.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M10.5 13.5L3 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                    <span>{`2XL`}</span>
                  </div>
                </div>

                <div className="mt-3 flex justify-between w-full sm:hidden relative">
                  <select
                    name="qty"
                    id="qty"
                    className="form-select text-sm rounded-md py-1 border-slate-200 dark:border-slate-700 relative z-10 dark:bg-slate-800 "
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                  </select>
                  <Price contentClass="py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium h-full" price={price} />
                </div>
              </div>

              <div className="hidden flex-1 sm:flex justify-end">
                <Price price={price} className="mt-0.5" />
              </div>
            </div>
          </div>

          <div className="flex mt-auto pt-4 items-end justify-between text-sm">
            <div className="hidden sm:block text-center relative">
              <NcInputNumber className="relative z-10" />
            </div>

            <a href="##" className="relative z-10 flex items-center mt-3 font-medium text-primary-6000 hover:text-primary-500 text-sm ">
              <span>Remove</span>
            </a>
          </div>
        </div>
      </div>
    )
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
            <div className="mt-8 divide-y divide-slate-200/70 dark:divide-slate-700 ">{[PRODUCTS[0], PRODUCTS[2], PRODUCTS[3]].map(renderProduct)}</div>
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
      <SEO title="Giỏ hàng" />
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
