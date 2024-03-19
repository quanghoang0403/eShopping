interface IBlogCategory {
  id: string
  name: string
  url: string
  color: 'green' | 'blue' | 'orange' | 'purple' | 'pink'
}

interface IBlog {
  id: string
  name: string
  content: string
  url: string
  thumbnail: string
  categories: IBlogCategory[]
  publishedTime: string
  description: string
}
