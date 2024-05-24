import React, { useState } from 'react'
import Image from 'next/image'
import { formatCurrency } from '@/utils/string.helper'
import Link from 'next/link'
interface IProps {
  title: string
  products: IProduct[]
  showFilter?: boolean
  onSortChange?: any
}

export default function ProductList(props: IProps) {
  const { title, products, showFilter, onSortChange } = props
  const [selectedSort, setSelectedSort] = useState('1')
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.value
    setSelectedSort(selectedOption)
    onSortChange && onSortChange(selectedOption)
  }
  return (
    <section className="px-2 lg:py-4">
      <div className="container mx-auto flex flex-wrap py-4 md:pb-12">
        <nav id="store" className="w-full z-30 top-0 p-1 md:px-6">
          <div className="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 md:px-2 pt-3">
            <div className="uppercase tracking-wide no-underline hover:no-underline font-bold text-gray-800 text-xl">{title}</div>
            {showFilter && (
              <div className="flex items-center space-x-2">
                <span>Sắp xếp:</span>
                <select
                  value={selectedSort}
                  onChange={handleSortChange}
                  className="px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                >
                  <option value="0" selected hidden>
                    Sắp xếp
                  </option>
                  <option value="1">Giá tăng dần</option>
                  <option value="2">Giá giảm dần</option>
                </select>
              </div>
            )}
          </div>
        </nav>
        {products?.length > 0 &&
          products.map((product, index) => {
            return (
              <div key={index} className="w-1/2 p-1 md:w-1/3 xl:w-1/4 md:p-6 flex flex-col relative">
                <Link href={`/san-pham/${product.urlSEO}`}>
                  <Image
                    className="hover:grow hover:shadow-lg aspect-square object-cover"
                    src={product.thumbnail}
                    alt={product.name}
                    width={300}
                    height={300}
                  />
                  <p className="pt-3 line-clamp-3">{product.name}</p>
                  <p className="pt-1 text-gray-900">
                    <span className={product.priceDiscount ? 'line-through pr-2' : ''}>{formatCurrency(product.priceValue)}</span>
                    {product.priceDiscount && <span className="text-red-500">{formatCurrency(product.priceDiscount)}</span>}
                  </p>
                </Link>
                {product.percentNumber && (
                  <span className="shadow absolute top-8 right-8 px-1.5 py-0.5 text-xs md:text-sm rounded-lg text-gray-900 bg-white font-semibold">
                    {product.percentNumber}%
                  </span>
                )}
              </div>
            )
          })}
      </div>
    </section>
  )
}
