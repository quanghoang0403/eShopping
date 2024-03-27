interface IBlogCategory extends ISEO {
  id: string
  color: 'green' | 'blue' | 'orange' | 'purple' | 'pink'
}

interface IBlog extends ISEO {
  id: string
  thumbnail: string
  categories: IBlogCategory[]
  publishedTime: string
}
