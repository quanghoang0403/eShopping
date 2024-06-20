import React, { FC, useEffect, useState } from 'react'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import { StarIcon } from '@heroicons/react/24/solid'
import BagIcon from '@/shared/Icon/BagIcon'
import NcInputNumber from '@/shared/NcInputNumber'
import { NoSymbolIcon } from '@heroicons/react/24/outline'
import Price from '@/shared/Price'
import toast from 'react-hot-toast'
import NotifyAddToCart from '@/components/Product/NotifyAddToCart'
import AccordionInfo from '@/components/Product/AccordionInfo'
import Policy from './Policy'
import { useAppSelector } from '@/hooks/useRedux'

export interface ProductInfoProps {
  product: IProduct
  showPolicy?: boolean
}

const ProductInfo: FC<ProductInfoProps> = ({ product, showPolicy }) => {
  const { productVariants, productSizes, productStocks } = product
  const [productVariantActive, setProductVariantActive] = useState<IProductVariant | null>(null)
  const [productSizeActive, setProductSizeActive] = useState<IProductSize | null>(null)
  const [productStockActive, setProductStockActive] = useState<IProductStock | null | undefined>(null)
  const [quantitySelected, setQuantitySelected] = useState(1)
  const [cartItemActive, setCartItemActive] = useState<ICartItem | null>(null)
  const cartItems = useAppSelector((state) => state.session.cartItems) as ICartItem[]

  useEffect(() => {
    if (productSizes?.length == 1) setProductSizeActive(productSizes[0])
  }, [productSizes])

  useEffect(() => {
    if (productVariants?.length == 1) setProductVariantActive(productVariants[0])
  }, [productVariants])

  useEffect(() => {
    if (productVariantActive && productSizeActive && !isOutOfStock(productVariantActive, productSizeActive)) { 
      setQuantitySelected(1)
      setProductStockActive(productStocks.find((x) => x.productSizeId === productSizeActive.id && x.productVariantId === productVariantActive.id))
    }
  }, [productVariantActive, productSizeActive])

  useEffect(() => {
    if (productStockActive && cartItems) {
      const cartItem = cartItems.find((x) => x.productVariantId === productStockActive.productVariantId && x.productSizeId === productStockActive.productSizeId)
      if (cartItem) setCartItemActive(cartItem)
    }
  }, [productStockActive])

  const onChangeActiveProductVariant = (variant: IProductVariant) => {
    setProductVariantActive(variant)
    if (isOutOfStock(variant, productSizeActive)) setProductSizeActive(null)
  }

  const onChangeActiveProductSize = (size: IProductSize) => {
    setProductSizeActive(size)
    if (isOutOfStock(productVariantActive, size)) setProductVariantActive(null)
  }

  const isOutOfStock = (productVariant: IProductVariant | null, productSize: IProductSize | null): boolean => {
    if (!productSize || !productVariant) return false
    return !productStocks?.find((x) => x.productSizeId === productSize.id && x.productVariantId === productVariant?.id && x.quantityLeft > 0)
  }

  const handleAddToCart = () => {
    if (productVariantActive && productSizeActive && productStockActive) {
      toast.custom(
        (t) => (
          <NotifyAddToCart
            product={product}
            productVariantActive={productVariantActive}
            productSizeActive={productSizeActive}
            productStockActive={productStockActive}
            quantity={quantitySelected}
            show={t.visible}
          />
        ),
        { position: 'top-right', id: 'nc-product-notify', duration: 3000 }
      )
    } else {
      toast.error('Vui lòng chọn size và màu sắc')
    }
  }

  const renderProductVariants = () => {
    if (!productVariants || !productVariants.length) {
      return null
    }

    return (
      <div>
        <label htmlFor="">
          <span className="text-sm font-medium">
            Màu sắc:
            <span className="ml-1 font-semibold">{productVariantActive?.name ?? ''}</span>
          </span>
        </label>
        <div className="flex mt-3">
          {productVariants.length > 1 &&
            productVariants.map((productVariant, index) => {
              const outOfStock = isOutOfStock(productVariant, productSizeActive)
              return (
                <div
                  key={index}
                  onClick={() => !outOfStock && onChangeActiveProductVariant(productVariant)}
                  className={`relative flex-1 max-w-[75px] h-10 sm:h-11 rounded-full border-2
                ${productVariant.id === productVariantActive?.id ? ' border-primary-6000 dark:border-primary-500' : ' border-transparent'}
                ${outOfStock ? ' cursor-not-allowed' : ' cursor-pointer'}`}
                >
                  {outOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className="text-grey z-20 relative">X</div>
                    </div>
                  )}
                  <div
                    className={`absolute inset-0.5 rounded-full overflow-hidden z-0 object-cover bg-cover ${outOfStock ? ' opacity-50' : ''}`}
                    style={{ backgroundImage: `url(${productVariant.thumbnail ?? ''})` }}
                  ></div>
                </div>
              )
            })}
        </div>
      </div>
    )
  }

  const renderProductSizes = () => {
    if (!productSizes || !productSizes.length) {
      return null
    }
    return (
      <div>
        <div className="flex justify-between font-medium text-sm">
          <label htmlFor="">
            <span className="">
              Size:
              <span className="ml-1 font-semibold">{productSizeActive?.name ?? ''}</span>
            </span>
          </label>
          <a target="_blank" rel="noopener noreferrer" href="#" className="text-primary-6000 hover:text-primary-500">
            Xem bảng size
          </a>
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 mt-3">
          {productSizes.length > 1 &&
            productSizes.map((productSize, index) => {
              const outOfStock = isOutOfStock(productVariantActive, productSize)
              return (
                <div
                  key={index}
                  onClick={() => !outOfStock && onChangeActiveProductSize(productSize)}
                  className={`relative h-10 sm:h-11 rounded-2xl border flex items-center justify-center text-sm sm:text-base uppercase font-semibold select-none overflow-hidden z-0
                ${
                  productSize.id === productSizeActive?.id
                    ? ' bg-primary-6000 border-primary-6000 text-white hover:bg-primary-6000'
                    : ' border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                }
                ${outOfStock ? ' text-opacity-20 dark:text-opacity-20 cursor-not-allowed' : ' cursor-pointer'}`}
                >
                  {productSize.name}
                </div>
              )
            })}
        </div>
      </div>
    )
  }

  const renderButtonAddToCart = () => {
    {product.isSoldOut ? (
      <ButtonPrimary className="flex-1 flex-shrink-0">
        <NoSymbolIcon className="w-3.5 h-3.5" />
        <span className="ml-3">ĐÃ HẾT HÀNG</span>
      </ButtonPrimary>
    ) : (
      <div className="flex space-x-3.5">
        <div className="flex items-center justify-center bg-slate-100/70 dark:bg-slate-800/70 px-2 py-3 sm:p-3.5 rounded-full">
          <NcInputNumber
            defaultValue={quantitySelected}
            max={cartItemActive ? cartItemActive.quantityLeft - cartItemActive.quantity : productStockActive?.quantityLeft ?? 1}
            onChange={setQuantitySelected}
          />
        </div>
        <ButtonPrimary className="flex-1 flex-shrink-0" onClick={handleAddToCart}>
          <BagIcon className="hidden sm:inline-block w-5 h-5 mb-0.5" />
          <span className="ml-3">THÊM VÀO GIỎ HÀNG</span>
        </ButtonPrimary>
      </div>
    )}
    if (product.isSoldOut) {
      return (
        <ButtonPrimary className="flex-1 flex-shrink-0">
          <NoSymbolIcon className="w-3.5 h-3.5" />
          <span className="ml-3">ĐÃ HẾT HÀNG</span>
        </ButtonPrimary>
      )
    }
    const quantityLeft = cartItemActive ? cartItemActive.quantityLeft - cartItemActive.quantity : productStockActive?.quantityLeft ?? 1
    if (quantityLeft == 0) {
      return (
        <ButtonPrimary className="flex-1 flex-shrink-0">
          <NoSymbolIcon className="w-3.5 h-3.5" />
          <span className="ml-3">ĐÃ THÊM SỐ LƯỢNG TỐI ĐA VÀO GIỎ HÀNG</span>
        </ButtonPrimary>
      )
    }
    return (
      <div className="flex space-x-3.5">
        <div className="flex items-center justify-center bg-slate-100/70 dark:bg-slate-800/70 px-2 py-3 sm:p-3.5 rounded-full">
          <NcInputNumber
            defaultValue={quantitySelected}
            max={quantityLeft}
            onChange={setQuantitySelected}
          />
        </div>
        <ButtonPrimary className="flex-1 flex-shrink-0" onClick={handleAddToCart}>
          <BagIcon className="hidden sm:inline-block w-5 h-5 mb-0.5" />
          <span className="ml-3">THÊM VÀO GIỎ HÀNG</span>
        </ButtonPrimary>
      </div>
    )
  }

  return (
    <div className="space-y-7 2xl:space-y-8">
      {/* ---------- 1 HEADING ----------  */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-semibold">{product.name}</h2>

        <div className="flex items-center mt-5 space-x-4 sm:space-x-5">
          {/* <div className="flex text-xl font-semibold">$112.00</div> */}
          <Price
            contentClass="py-1 px-2 md:py-1.5 md:px-3 text-2xl font-semibold"
            priceValue={productVariantActive ? productVariantActive.priceValue : product.priceValue}
            priceDiscount={productVariantActive ? productVariantActive.priceDiscount : product.priceDiscount}
          />

          <div className="h-7 border-l border-slate-300 dark:border-slate-700"></div>

          <div className="flex items-center">
            <a href="#reviews" className="flex items-center text-sm font-medium">
              <StarIcon className="w-5 h-5 pb-[1px] text-yellow-400" />
              <div className="ml-1.5 flex">
                <span>4.9</span>
                <span className="block mx-2">·</span>
                <span className="text-slate-600 dark:text-slate-400 underline">142 reviews</span>
              </div>
            </a>
            <span className="hidden sm:block mx-2.5">·</span>
            {/* <div className="hidden sm:flex items-center text-sm">
              <SparklesIcon className="w-3.5 h-3.5" />
              <span className="ml-1 leading-none">Mới về</span>
            </div> */}
          </div>
        </div>
      </div>

      {/* ---------- 3 VARIANTS AND SIZE LIST ----------  */}
      {renderProductVariants()}
      {renderProductSizes()}

      {/*  ---------- 4  QTY AND ADD TO CART BUTTON */}
      {renderButtonAddToCart()}
      {/*  */}
      <hr className=" 2xl:!my-10 border-slate-200 dark:border-slate-700"></hr>
      {/*  */}

      {/* ---------- 5 ----------  */}
      <AccordionInfo />

      {/* ---------- 6 ----------  */}
      {showPolicy && (
        <div className="hidden xl:block">
          <Policy />
        </div>
      )}
    </div>
  )
}

export default ProductInfo
