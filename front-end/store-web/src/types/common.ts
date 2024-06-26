interface ISEO {
  id: string
  name: string
  titleSEO?: string
  content?: string
  keywordSEO?: string
  urlSEO: string
  descriptionSEO?: string
  description?: string
}

interface IArea {
  id: number
  name: string
}

interface IOption {
  id: number
  name?: string
}

interface IPermission {
  id: string
  name: string
  description: string
}

interface IBaseResponse<T> {
  code: number
  data: T
  message: string
  errorMessage: string
}

interface IPagingResponse<T> {
  result: T[]
  paging: IPaging
}

interface IPagingRequest {
  pageNumber: number
  pageSize: number
  keySearch: string
}

interface IPaging {
  pageIndex: number
  pageSize: number
  pageCount: number
  total: number
}

interface INavItemType {
  id: string | number
  name: string
  urlSEO?: string
  targetBlank?: boolean
  children?: INavItemType[]
  type?: 'dropdown' | 'megaMenu' | 'none'
  isNew?: boolean
}
