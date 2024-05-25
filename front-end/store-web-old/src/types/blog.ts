enum EnumColorCategory {
  Green = 0,
  Blue = 1,
  Orange = 2,
  Purple = 3,
  Pink = 4,
}

interface IBlogCategory extends ISEO {
  id: string
  color: EnumColorCategory
}

interface IBlog extends ISEO {
  id: string
  thumbnail: string
  viewCount: number
  categories: IBlogCategory[]
  publishedTime: string
}
