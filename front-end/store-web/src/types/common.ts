interface ISEO {
  id: string
  name: string
  titleSEO?: string
  content?: string
  keywordSEO?: string
  urlSEO: string
  descriptionSEO?: string
  description: string
}

interface IArea {
  id: number
  name: string
}

interface IBaseResponse {
  pageNumber: number
  total: number
}

interface IBaseRequest {
  pageNumber: number
  pageSize: number
  keySearch: string
}
