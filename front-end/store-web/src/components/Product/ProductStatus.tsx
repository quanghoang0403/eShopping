import { NoSymbolIcon, SparklesIcon, StarIcon } from '@heroicons/react/24/outline'
import React, { FC } from 'react'
import DiscountIcon from '@/shared/Icon/DiscountIcon'

interface Props {
  product: IProduct
  className?: string
}

const ProductStatus: FC<Props> = ({
  product,
  className = 'nc-shadow-lg rounded-full flex items-center justify-center absolute top-3 start-3 px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300',
}) => {
  const renderStatus = () => {
    if (!product) {
      return null
    }
    if (product.IsNewIn) {
      return (
        <div className={className}>
          <SparklesIcon className="w-3.5 h-3.5" />
          <span className="ms-1 leading-none">Mới về</span>
        </div>
      )
    }
    if (product.isDiscounted) {
      return (
        <div className={className}>
          <DiscountIcon className="w-3.5 h-3.5" />
          <span className="ms-1 leading-none">Khuyến mãi</span>
        </div>
      )
    }
    if (product.IsSoldOut) {
      return (
        <div className={className}>
          <NoSymbolIcon className="w-3.5 h-3.5" />
          <span className="ms-1 leading-none">Hết hàng</span>
        </div>
      )
    }
    if (product.isFeatured) {
      return (
        <div className={className}>
          <StarIcon className="w-3.5 h-3.5" />
          <span className="ms-1 leading-none">Nổi bật</span>
        </div>
      )
    }
    return null
  }

  return renderStatus()
}

export default ProductStatus
