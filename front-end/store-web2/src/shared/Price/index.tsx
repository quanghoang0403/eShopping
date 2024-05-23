import { formatCurrency } from '@/utils/string.helper'
import React, { FC } from 'react'

export interface PriceProps {
  className?: string
  priceValue?: number
  priceDiscount?: number
  contentClass?: string
}

const Prices: FC<PriceProps> = ({ className = '', priceValue = 33, priceDiscount, contentClass = 'py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium' }) => {
  const hasDiscount = priceDiscount && priceDiscount > 0
  return (
    <div className={`${className}`}>
      <div className={`flex items-center rounded-lg ${contentClass}`}>
        <span className={hasDiscount ? 'line-through pr-3' : ''}>{formatCurrency(priceValue)}</span>
        {hasDiscount ? <span className="text-red-500">{formatCurrency(priceDiscount)}</span> : ''}
      </div>
    </div>
  )
}

export default Prices
