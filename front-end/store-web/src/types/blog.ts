interface IBlogCategory extends ISEO {
  id: string
  color: number
}

interface IBlog extends ISEO {
  id: string
  thumbnail: string
  viewCount: number
  categories: IBlogCategory[]
  publishedTime: string
}
