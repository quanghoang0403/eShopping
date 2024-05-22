import { useAppSelector } from '@/hooks/useRedux'
import { formatCurrency } from '@/utils/string.helper'
import { FC } from 'react'

export interface SummaryPriceProps {
  shipping?: number
}

const SummaryPrice: FC<SummaryPriceProps> = ({ shipping = 20000 }) => {
  const totalPrice = useAppSelector((state) => state.session.totalPrice)
  return (
    <div className="mt-10 pt-6 text-base text-slate-500 dark:text-slate-400 border-t border-slate-200/70 dark:border-slate-700 divide-y divide-slate-200/70 dark:divide-slate-700/80">
      <div className="mt-4 flex justify-between py-2.5">
        <span>Tổng tiền</span>
        <span className="font-semibold text-slate-900 dark:text-slate-200">{formatCurrency(totalPrice)}</span>
      </div>
      <div className="flex justify-between py-2.5">
        <span>Phí giao hàng</span>
        <span className="font-semibold text-slate-900 dark:text-slate-200">{formatCurrency(shipping)}</span>
      </div>
      <div className="flex justify-between font-semibold text-slate-900 dark:text-slate-200 text-medium pt-4">
        <span>THANH TOÁN</span>
        <span>{formatCurrency(totalPrice + shipping)}</span>
      </div>
    </div>
  )
}

export default SummaryPrice
