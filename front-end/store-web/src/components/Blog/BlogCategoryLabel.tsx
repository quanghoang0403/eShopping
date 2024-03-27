import { cx } from '@/utils/common.helper'
import Link from 'next/link'

interface IProps {
  categories: IBlogCategory[]
  className?: string
  showBg?: boolean
}

export default function BlogCategoryLabel(props: IProps) {
  const { categories, className, showBg } = props
  const color = {
    green: 'text-emerald-700',
    blue: 'text-blue-600',
    orange: 'text-orange-700',
    purple: 'text-purple-600',
    pink: 'text-pink-600',
  }
  const bgcolor = {
    green: 'bg-emerald-50',
    blue: 'bg-blue-50',
    orange: 'bg-orange-50',
    purple: 'bg-purple-50',
    pink: 'bg-pink-50',
  }
  return (
    <div className={cx('flex flex-wrap mb-1', showBg ? 'gap-3 justify-center' : '')}>
      {categories?.length &&
        categories.map((category, index) => (
          <Link className={showBg ? '' : 'h-5'} href={`/bai-viet/danh-muc/${category.urlSEO}`} key={index}>
            <p
              className={cx(
                'inline-block text-xs font-medium tracking-wider uppercase text-nowrap mr-3',
                className,
                color[category.color] || color.pink,
                showBg ? bgcolor[category.color] || bgcolor.pink : ''
              )}
            >
              {category.name}
            </p>
          </Link>
        ))}
    </div>
  )
}
