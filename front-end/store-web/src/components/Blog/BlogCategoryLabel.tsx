import { cx } from '@/utils/all'
import Link from 'next/link'

interface IProps {
  categories: IBlogCategory[]
}

export default function BlogCategoryLabel(props: IProps) {
  const { categories } = props
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
  const isMargin = categories?.length > 1
  return (
    <div className="flex gap-3">
      {categories?.length &&
        categories.map((category, index) => (
          <Link href={`/category/${category.url}`} key={index}>
            <div className={cx('inline-block text-xs font-medium tracking-wider uppercase ', isMargin && ' mt-5', color[category.color] || color.pink)}>
              {category.name}
            </div>
          </Link>
        ))}
    </div>
  )
}
