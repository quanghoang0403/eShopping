import { formatCurrency } from '@/utils/string.helper'
import React, { FC } from 'react'

export interface PriceProps {
  className?: string
  priceValue: number
  priceDiscount?: number
  contentClass?: string
}

const Price: FC<PriceProps> = ({ className = '', priceValue, priceDiscount, contentClass = 'text-base font-medium' }) => {
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

export default Price
