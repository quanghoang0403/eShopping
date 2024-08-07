import { cx } from '@/utils/string.helper'
import Link from 'next/link'

interface IProps {
  categories: IBlogCategory[]
  className?: string
  showBg?: boolean
}

export default function BlogCategoryLabel(props: IProps) {
  const { categories, className, showBg } = props
  const color = ['text-emerald-700', 'text-blue-600', 'text-orange-700', 'text-purple-600', 'text-pink-600']
  const bgcolor = ['bg-emerald-50', 'bg-blue-50', 'bg-orange-50', 'bg-purple-50', 'bg-pink-50']
  return (
    <div className={cx('flex flex-wrap mb-1', showBg ? 'gap-3 justify-center' : '')}>
      {categories?.length &&
        categories.map((category, index) => (
          <Link className={showBg ? '' : 'h-5'} href={`/bai-viet/danh-muc/${category.urlSEO}`} key={index}>
            <p
              className={cx(
                'inline-block text-xs font-medium tracking-wider uppercase text-nowrap mr-3',
                className,
                color[category.color] || color[EnumColorCategory.Pink],
                showBg ? bgcolor[category.color] || bgcolor[EnumColorCategory.Pink] : ''
              )}
            >
              {category.name}
            </p>
          </Link>
        ))}
    </div>
  )
}
