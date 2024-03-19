import { cx } from '@/utils/all'
import { PropsWithChildren } from 'react'

interface IProps extends PropsWithChildren {
  className?: string
}

export default function BlogContainer(props: IProps) {
  return <div className={cx('container px-8 mx-auto xl:px-5', props.className)}>{props.children}</div>
}
