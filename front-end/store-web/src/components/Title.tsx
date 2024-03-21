import { cx } from '@/utils/common.helper'

interface IProps {
  title: string
  className?: string
}

export default function Title(props: IProps) {
  const { title, className } = props
  return <h1 className={cx('py-10 text-center text-2xl text-gray-900 uppercase', className)}>{title}</h1>
}
