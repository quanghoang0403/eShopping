import { cx } from '@/utils/common.helper'
import { PropsWithChildren } from 'react'

interface IProps extends PropsWithChildren {
  className?: string
}
export default function WhiteCard(props: IProps) {
  const { className, children } = props
  return <div className={cx(className, 'rounded-lg border bg-white p-6 shadow-md')}>{children}</div>
}
