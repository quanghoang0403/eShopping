import { formatCurrency } from '@/utils/string.helper'
import React, { FC } from 'react'

export interface PriceProps {
  className?: string
  priceValue?: number
  priceDiscount?: number
  contentClass?: string
}

const Prices: FC<PriceProps> = ({ className = '', priceValue = 33, contentClass = 'py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium' }) => {
  return (
    <div className={`${className}`}>
      <div className={`flex items-center border-2 border-green-500 rounded-lg ${contentClass}`}>
        <span className="text-green-500 !leading-none">{formatCurrency(priceValue)}</span>
      </div>
    </div>
  )
}

export default Prices
