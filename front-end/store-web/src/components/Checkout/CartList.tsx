import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { sessionActions } from '@/redux/features/sessionSlice'
import NcInputNumber from '@/shared/NcInputNumber'
import Price from '@/shared/Price'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import Selection from '@/shared/Controller/Selection'
import { TrashIcon } from '@heroicons/react/24/outline'

export interface CartListProps {}

const CartList: FC<CartListProps> = () => {
  const cartItems = useAppSelector((state) => state.session.cartItems) as ICartItem[]
  const dispatch = useAppDispatch()

  const removeCartItem = (productId: string, productVariantId: string) => {
    dispatch(sessionActions.removeProductFromCart({ productId, productVariantId }))
  }

  const updateCartItem = (productId: string, productVariantId: string, quantity: number) => {
    dispatch(sessionActions.updateProductInCart({ productId, productVariantId, quantity }))
  }
  return (
    <>
      <h3 className="text-lg font-semibold">Danh sách sản phẩm</h3>
      <div className="mt-8 divide-y divide-slate-200/70 dark:divide-slate-700 ">
        {cartItems.map((item, index) => {
          const options: IOption[] = [...Array(item.quantityLeft)].map((_, index) => {
            return { id: index + 1 }
          })
          return (
            <div key={index} className="relative flex py-7 first:pt-0 last:pb-0">
              <div className="relative h-36 w-24 sm:w-28 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
                <Image src={item.thumbnail} fill alt={item.productName} className="h-full w-full object-contain object-center" sizes="150px" />
                <Link href={`/product-detail/${item.productUrl}`} className="absolute inset-0"></Link>
              </div>

              <div className="ml-3 sm:ml-6 flex flex-1 flex-col">
                <div>
                  <div className="flex justify-between ">
                    <div className="flex-[1.5] ">
                      <h3 className="text-base font-semibold">
                        <Link href="/product-detail">{item.productName}</Link>
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

                          <span>{item.productVariantName}</span>
                        </div>
                        <span className="mx-4 border-l border-slate-200 dark:border-slate-700 "></span>
                        <div className="flex items-center space-x-1.5">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <path d="M21 9V3H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M3 15V21H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M21 3L13.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M10.5 13.5L3 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>

                          <span>{item.productSizeName}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex justify-between w-full sm:hidden relative">
                        <Selection
                          name="quantity"
                          defaultValue={item.quantity}
                          options={options}
                          onChange={(value: any) => updateCartItem(item.productId, item.productVariantId, parseInt(value))}
                        />
                        <Price contentClass="py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium h-full" priceValue={item.priceValue} />
                      </div>
                    </div>

                    <div className="hidden flex-1 sm:flex justify-end">
                      <Price priceValue={item.priceValue} priceDiscount={item.priceDiscount} className="mt-0.5" />
                    </div>
                  </div>
                </div>

                <div className="flex mt-auto pt-4 items-end justify-between text-sm">
                  <div className="hidden sm:block text-center relative">
                    <NcInputNumber
                      defaultValue={item.quantity}
                      className="relative z-10"
                      max={item.quantityLeft}
                      onChange={(value: any) => updateCartItem(item.productId, item.productVariantId, parseInt(value))}
                    />
                  </div>

                  <a
                    onClick={() => removeCartItem(item.productId, item.productVariantId)}
                    className="relative z-10 flex items-center mt-3 font-medium text-primary-6000 hover:text-primary-500 text-sm cursor-pointer"
                  >
                    {/* <span>Xoá</span> */}
                    <TrashIcon className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default CartList
