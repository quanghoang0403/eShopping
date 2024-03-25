import React, { useState } from 'react'
import Image from 'next/image'
import { cx } from '@/utils/common.helper'

interface IProps {
  images: string[]
}

export default function ProductGallery(props: IProps) {
  const { images } = props
  const [activeIndex, setActiveIndex] = useState(0)
  const [activeImage, setActiveImage] = useState(images[0])
  const handleActiveIndex = (index: number) => {
    if (index < 0) index = images.length - 1
    else if (index >= images.length) index = 0
    setActiveImage(images[index])
    setActiveIndex(index)
  }
  return (
    <>
      <div className="flex flex-col-reverse md:flex-row gap-2">
        <div className="flex-nowrap flex overflow-auto w-full md:w-1/4 md:grid md:grid-cols-2 md:grid-rows-8 gap-1">
          {images.map((image, index) => (
            <div key={index} className={cx('flex-none p-1 border', activeIndex == index ? 'border-gray-900' : 'border-gray-100')}>
              <Image
                width={100}
                height={100}
                onClick={() => {
                  setActiveIndex(index)
                  setActiveImage(image)
                }}
                className="aspect-square object-cover cursor-pointer"
                src={image}
                alt="gallery-image"
              />
            </div>
          ))}
        </div>
        <div className="w-3/4 carousel-inner relative overflow-hidden w-full">
          <Image width={900} height={900} className="aspect-square object-cover rounded border border-gray-200" src={activeImage} alt="" />
          <label
            onClick={() => {
              handleActiveIndex(activeIndex - 1)
            }}
            className="block w-10 h-10 ml-2 md:ml-10 absolute cursor-pointer text-3xl font-bold text-black hover:text-white rounded-full bg-gray-200 hover:bg-gray-900 text-center inset-y-0 left-0 my-auto"
          >
            ‹{/* Replaced ‹ with > */}
          </label>

          <label
            onClick={() => {
              handleActiveIndex(activeIndex + 1)
            }}
            className="block w-10 h-10 mr-2 md:mr-10 absolute cursor-pointer text-3xl font-bold text-black hover:text-white rounded-full bg-gray-200 hover:bg-gray-900 text-center inset-y-0 right-0 my-auto"
          >
            › {/* Replaced › with < */}
          </label>
        </div>
      </div>
    </>
  )
}
