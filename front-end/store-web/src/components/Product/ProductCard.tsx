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
import { Transition } from '@headlessui/react'
// import ModalQuickView from './QuickView/ModalQuickView'
import ProductStatus from './ProductStatus'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import NcImage from '@/shared/NcImage'
import ModalQuickView from './QuickView/ModalQuickView'

export interface ProductCardProps {
  className?: string
  data: IProduct
  isLiked?: boolean
}

const ProductCard: FC<ProductCardProps> = ({ className = '', data, isLiked }) => {
  const { name, description, priceValue, priceDiscount, urlSEO, productSizes, productVariants, productStocks } = data
  const [productVariantActive, setProductVariantActive] = useState<IProductVariant | null>(null)
  const [productSizeActive, setProductSizeActive] = useState<IProductSize | null>(null)
  const [showModalQuickView, setShowModalQuickView] = useState(false)
  const router = useRouter()

  const onChangeActiveProductVariant = (variant : IProductVariant) => {
    setProductVariantActive(variant)
    if (!productStocks?.find(x => x.productVariantId === variant.id && x.productSizeId === productSizeActive?.id && x.quantityLeft > 0))
      setProductSizeActive(null)
  }

  const onChangeActiveProductSize = (size : IProductSize) => {
    setProductSizeActive(size)
    if (!productStocks?.find(x => x.productSizeId === size.id && x.productVariantId === productVariantActive?.id && x.quantityLeft > 0))
      setProductVariantActive(null)
  }

  const isOutOfStock = (productVariant: IProductVariant | null, productSize: IProductSize | null): boolean => {
    if (!productSize || !productVariant) return false
    return !productStocks?.find(x => x.productSizeId === productSize.id && x.productVariantId === productVariant?.id && x.quantityLeft > 0)
  }

  const notifyAddToCart = () => {
    toast.custom(
      (t) => (
        <Transition
          appear
          show={t.visible}
          className="p-4 max-w-md w-full bg-white dark:bg-slate-800 shadow-lg rounded-2xl pointer-events-auto ring-1 ring-black/5 dark:ring-white/10 text-slate-900 dark:text-slate-200"
          enter="transition-all duration-150"
          enterFrom="opacity-0 translate-x-20"
          enterTo="opacity-100 translate-x-0"
          leave="transition-all duration-150"
          leaveFrom="opacity-100 translate-x-0"
          leaveTo="opacity-0 translate-x-20"
        >
          <p className="block text-base font-semibold leading-none">Đã thêm vào giỏ!</p>
          <div className="border-t border-slate-200 dark:border-slate-700 my-4" />
          {renderProductCartOnNotify()}
        </Transition>
      ),
      {
        position: 'top-right',
        id: String(data.id) || 'product-detail',
        duration: 3000,
      }
    )
  }

  const renderProductCartOnNotify = () => {
    return (
      <div className="flex ">
        <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <Image width={80} height={96} src={data.thumbnail} alt={name} className="absolute object-cover object-center" />
        </div>

        <div className="ms-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div>
                <h3 className="text-base font-medium ">{name}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  <span>{productVariantActive?.name}</span>
                  <span className="mx-2 border-s border-slate-200 dark:border-slate-700 h-4"></span>
                  <span>{productSizeActive?.name}</span>
                </p>
              </div>
              <Price priceValue={priceValue} className="mt-0.5" />
            </div>
          </div>
          <div className="flex flex-1 items-end justify-between text-sm">
            <p className="text-gray-500 dark:text-slate-400">Số lượng: 1</p>

            <div className="flex">
              <button
                type="button"
                className="font-medium text-primary-6000 dark:text-primary-500 "
                onClick={(e) => {
                  e.preventDefault()
                  router.push('/cart')
                }}
              >
                Xem giỏ hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    )
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
              className={`relative w-11 h-6 rounded-full overflow-hidden z-10 border cursor-pointer
              ${productVariant.id === productVariantActive?.id ? ' border-black dark:border-slate-300' : ' border-transparent'} 
              ${outOfStock ? ' text-opacity-20 dark:text-opacity-20 cursor-not-allowed' : ' cursor-pointer'}}`}
              title={productVariant.name}
            >
              <div
                className="absolute inset-0.5 rounded-full overflow-hidden z-0 bg-cover"
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
      <div className="absolute bottom-0 inset-x-1 space-x-1.5 rtl:space-x-reverse flex justify-center opacity-0 invisible group-hover:bottom-4 group-hover:opacity-100 group-hover:visible transition-all">
        {productSizes.map((productSize, index) => {
          const outOfStock = isOutOfStock(productVariantActive, productSize)
          return (
            <div
              key={index}
              onClick={() => !outOfStock && onChangeActiveProductSize(productSize)}
              className={`nc-shadow-lg w-10 h-10 rounded-xl bg-white hover:bg-slate-900 hover:text-white transition-colors cursor-pointer flex items-center justify-center uppercase font-semibold tracking-tight text-sm text-slate-900
              ${productSize.id === productSizeActive?.id  ? ' bg-primary-6000 border-primary-6000 text-white hover:bg-primary-6000' : ' border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200 hover:bg-neutral-50 dark:hover:bg-neutral-700'}
              ${outOfStock ? ' text-opacity-20 dark:text-opacity-20 cursor-not-allowed' : ' cursor-pointer'}}`}
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
      <div className="absolute bottom-0 group-hover:bottom-4 inset-x-1 flex justify-center opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
        <ButtonPrimary className="shadow-lg" fontSize="text-xs" sizeClass="py-2 px-4" onClick={() => notifyAddToCart()}>
          <BagIcon className="w-3.5 h-3.5 mb-0.5" />
          <span className="ms-1">Thêm vào giỏ hàng</span>
        </ButtonPrimary>
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
              src={data.thumbnail}
              className="object-cover w-full h-full drop-shadow-xl"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 40vw"
              alt="product"
            />
          </Link>
          <ProductStatus product={data} />
          <LikeButton liked={isLiked} className="absolute top-3 end-3 z-10" />
          {/* {productSizes.length > 1 ? renderProductSizes() : renderGroupButtons()} */}
          {renderProductSizes()}
          {renderGroupButtons()}
        </div>

        <div className="space-y-2 px-2.5 pt-5 pb-2.5">
          {renderProductVariants()}
          <div>
            <h2 className="nc-ProductCard__title text-base font-semibold transition-colors">{name}</h2>
            <p className={`text-sm text-slate-500 dark:text-slate-400 mt-1 `}>{description}</p>
          </div>

          <div className="flex justify-between items-center ">
            <Price priceValue={priceValue} />
            <div className="flex items-center mb-0.5">
              <StarIcon className="w-5 h-5 pb-[1px] text-amber-400" />
              <span className="text-sm ms-1 text-slate-500 dark:text-slate-400">4 (5 reviews)</span>
            </div>
          </div>
        </div>
      </div>
      <ModalQuickView show={showModalQuickView} onCloseModalQuickView={() => setShowModalQuickView(false)} />
    </>
  )
}

export default ProductCard
