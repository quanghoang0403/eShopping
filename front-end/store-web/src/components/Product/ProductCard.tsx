'use client'
import React, { FC, useEffect, useState } from 'react'
import LikeButton from './LikeButton'
import Price from '@/shared/Price'
import { ArrowsPointingOutIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/24/solid'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import ButtonSecondary from '@/shared/Button/ButtonSecondary'
import BagIcon from '@/shared/Icon/BagIcon'
import toast from 'react-hot-toast'
import ProductStatus from './ProductStatus'
import Link from 'next/link'
import NcImage from '@/shared/NcImage'
import ModalQuickView from './ModalQuickView'
import NotifyAddToCart from './NotifyAddToCart'
import { useAppSelector } from '@/hooks/useRedux'
import { getRandomReviews, getRandomStarRating } from '@/utils/string.helper'

export interface ProductCardProps {
  className?: string
  product: IProduct
}

const ProductCard: FC<ProductCardProps> = ({ className = '', product }) => {
  const { name, description, priceValue, priceDiscount, urlSEO, productSizes, productVariants, productStocks } = product
  const [productVariantActive, setProductVariantActive] = useState<IProductVariant | null>(null)
  const [productSizeActive, setProductSizeActive] = useState<IProductSize | null>(null)
  const [productStockActive, setProductStockActive] = useState<IProductStock | null>(null)
  const [showModalQuickView, setShowModalQuickView] = useState(false)
  const cartItems = useAppSelector((state) => state.session.cartItems) as ICartItem[]

  useEffect(() => {
    if (productSizes?.length == 1) setProductSizeActive(productSizes[0])
  }, [productSizes])

  useEffect(() => {
    if (productVariants?.length == 1) setProductVariantActive(productVariants[0])
  }, [productVariants])

  const onChangeActiveProductVariant = (variant: IProductVariant) => {
    setProductVariantActive(variant)
    const productStock = productStocks?.find((x) => x.productVariantId === variant.id && x.productSizeId)
    if (!productStock || productStock.quantityLeft <= 0) setProductSizeActive(null)
    else setProductStockActive(productStock)
  }

  const onChangeActiveProductSize = (size: IProductSize) => {
    setProductSizeActive(size)
    const productStock = productStocks?.find((x) => x.productSizeId === size.id && x.productVariantId === productVariantActive?.id)
    if (!productStock || productStock.quantityLeft <= 0) setProductVariantActive(null)
    else setProductStockActive(productStock)
  }

  const isOutOfStock = (productVariant: IProductVariant | null, productSize: IProductSize | null): boolean => {
    if (!productSize || !productVariant) return false
    const productStock = productStocks?.find((x) => x.productSizeId === productSize.id && x.productVariantId === productVariant?.id)
    return !productStock || productStock.quantityLeft == 0
  }

  const handleAddToCart = () => {
    if (productVariantActive && productSizeActive && productStockActive) {
      // const cartItemExisted = cartItems.find(
      //   (x) => x.productVariantId === productStockActive.productVariantId && x.productSizeId === productStockActive.productSizeId
      // )
      // if (cartItemExisted && cartItemExisted.quantity == productStockActive.quantityLeft) {
      //   toast.error(`Xin lỗi bạn, sản phẩm ${product.name} - Màu ${productVariantActive.name} - Size ${productSizeActive.name} không còn hàng tồn`)
      // } else {
      //   toast.custom(
      //     (t) => (
      //       <NotifyAddToCart
      //         product={product}
      //         productVariantActive={productVariantActive}
      //         productSizeActive={productSizeActive}
      //         productStockActive={productStockActive}
      //         quantity={1}
      //         show={t.visible}
      //       />
      //     ),
      //     { position: 'top-right', id: 'nc-product-notify', duration: 3000 }
      //   )
      // }
    } else {
      toast.error('Vui lòng chọn size và màu sắc')
    }
  }

  const renderProductVariants = () => {
    if (!productVariants || !productVariants.length) {
      return null
    }
    return (
      <div className="flex ">
        {productVariants.map((productVariant, index) => {
          const outOfStock = isOutOfStock(productVariant, productSizeActive)
          return (
            <div
              key={index}
              onClick={() => !outOfStock && onChangeActiveProductVariant(productVariant)}
              className={`relative w-11 h-6 rounded-full overflow-hidden z-10 border
              ${productVariant.id === productVariantActive?.id ? ' border-black dark:border-slate-300' : ' border-transparent'} 
              ${outOfStock ? ' text-opacity-20 dark:text-opacity-20 cursor-not-allowed' : ' cursor-pointer'}`}
              title={productVariant.name}
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
    )
  }

  const renderProductSizes = () => {
    if (!productSizes || !productSizes.length) {
      return null
    }
    return (
      <div className="absolute bottom-0 inset-x-1 space-x-1.5 rtl:space-x-reverse flex justify-center invisible group-hover:bottom-2 group-hover:opacity-100 group-hover:visible transition-all">
        {productSizes.map((productSize, index) => {
          const outOfStock = isOutOfStock(productVariantActive, productSize)
          return (
            <div
              key={index}
              onClick={() => !outOfStock && onChangeActiveProductSize(productSize)}
              className={`nc-shadow-lg w-8 h-6 rounded-lg transition-colors flex items-center justify-center uppercase tracking-tight text-sm
              ${
                productSize.id === productSizeActive?.id
                  ? ' bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : ' bg-white border-slate-300 text-slate-900 dark:bg-slate-900 dark:text-white'
              }
              ${outOfStock ? ' text-opacity-20 dark:text-opacity-20 cursor-not-allowed' : ' cursor-pointer'}`}
            >
              {productSize.name}
            </div>
          )
        })}
      </div>
    )
  }

  const renderGroupButtons = () => {
    return (
      <div className="absolute bottom-10 group-hover:bottom-10 inset-x-1 flex justify-center opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
        {/* <ButtonPrimary className="shadow-lg" fontSize="text-xs" sizeClass="py-2 px-4" onClick={handleAddToCart}>
          <BagIcon className="w-3.5 h-3.5 mb-0.5" />
          <span className="ms-1">Thêm vào giỏ hàng</span>
        </ButtonPrimary> */}
        <ButtonSecondary
          className="ms-1.5 bg-white hover:!bg-gray-100 hover:text-slate-900 transition-colors shadow-lg"
          fontSize="text-xs"
          sizeClass="py-2 px-4"
          onClick={() => setShowModalQuickView(true)}
        >
          <ArrowsPointingOutIcon className="w-3.5 h-3.5" />
          <span className="ms-1">Xem nhanh</span>
        </ButtonSecondary>
      </div>
    )
  }

  return (
    <>
      <div className={`nc-ProductCard relative flex flex-col bg-transparent ${className}`}>
        <Link href={`/product-detail/${urlSEO}`} className="absolute inset-0"></Link>
        <div className="relative flex-shrink-0 bg-slate-50 dark:bg-slate-300 rounded-3xl overflow-hidden z-1 group">
          <Link href={`/product-detail/${urlSEO}`} className="block">
            <NcImage
              containerClassName="flex aspect-w-11 aspect-h-12 w-full h-0"
              src={product.thumbnail}
              className="object-cover w-full h-full drop-shadow-xl"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 40vw"
              alt="product"
            />
          </Link>
          <ProductStatus product={product} />
          <LikeButton productId={product.id} className="absolute top-3 end-3 z-10" />
          {/* {renderProductSizes()} */}
          {renderGroupButtons()}
        </div>

        <div className="space-y-2 px-2.5 pt-5 pb-2.5">
          {/* {renderProductVariants()} */}
          <div>
            <h2 className="nc-ProductCard__title text-base font-semibold transition-colors">{name}</h2>
            <p className={`text-sm text-slate-500 dark:text-slate-400 mt-1 `}>{description}</p>
          </div>

          {/* <div className="flex justify-between items-center ">
            <Price priceValue={priceValue} priceDiscount={priceDiscount} />
            <div className="flex items-center mb-0.5">
              <StarIcon className="w-5 h-5 pb-[1px] text-amber-400" />
              <span className="text-sm ms-1 text-slate-500 dark:text-slate-400">{getRandomStarRating()} ({getRandomReviews()} đánh giá)</span>
            </div>
          </div> */}
        </div>
      </div>
      <ModalQuickView product={product} show={showModalQuickView} onCloseModalQuickView={() => setShowModalQuickView(false)} />
    </>
  )
}

export default ProductCard
