'use client'

import { Dialog, Transition } from '@headlessui/react'
import React, { FC, Fragment } from 'react'
import ButtonClose from '@/shared/Button/ButtonClose'
import { usePathname } from 'next/navigation'
import ProductInfo from './ProductInfo'
import ProductStatus from './ProductStatus'
import LikeButton from './LikeButton'
import Image from 'next/image'

export interface ModalQuickViewProps {
  show: boolean
  product: IProduct
  onCloseModalQuickView: () => void
}

const ModalQuickView: FC<ModalQuickViewProps> = ({ show, product, onCloseModalQuickView }) => {
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50" onClose={onCloseModalQuickView}>
        <div className="flex items-stretch md:items-center justify-center h-full text-center md:px-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black/40 dark:bg-black/70" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="inline-block align-middle" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="relative inline-flex xl:py-8 w-full max-w-5xl max-h-full">
              <div
                className="flex-1 flex overflow-hidden max-h-full p-8 w-full text-left align-middle transition-all transform lg:rounded-2xl bg-white 
              dark:bg-neutral-900 dark:border dark:border-slate-700 dark:text-slate-100 shadow-xl"
              >
                <span className="absolute end-3 top-3 z-50">
                  <ButtonClose onClick={onCloseModalQuickView} />
                </span>

                <div className="flex-1 overflow-y-auto rounded-xl hiddenScrollbar">
                  <div className="nc-ProductQuickView">
                    <div className="lg:flex">
                      <div className="w-full lg:w-[50%] ">
                        <div className="relative">
                          <div className="aspect-w-16 aspect-h-16">
                            <Image
                              src={product.thumbnail}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="w-full rounded-xl object-cover"
                              alt="product detail 1"
                            />
                          </div>
                          <ProductStatus
                            product={product}
                            className="absolute top-3 start-3 px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 nc-shadow-lg rounded-full flex items-center justify-center text-slate-700 text-slate-900 dark:text-slate-300"
                          />
                          <LikeButton className="absolute end-3 top-3 " />
                        </div>
                      </div>
                      <div className="w-full lg:w-[50%] pt-6 lg:pt-0 lg:ps-7 xl:ps-8">
                        <ProductInfo product={product} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ModalQuickView
