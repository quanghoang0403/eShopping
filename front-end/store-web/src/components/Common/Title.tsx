import { cx } from '@/utils/string.helper'

interface IProps {
  title: string
  className?: string
}

export default function Title(props: IProps) {
  const { title, className } = props
  return <h1 className={cx('md:pt-10 md:pb-6 pt-6 pb-4 text-center text-2xl text-gray-900 uppercase', className)}>{title}</h1>
}
