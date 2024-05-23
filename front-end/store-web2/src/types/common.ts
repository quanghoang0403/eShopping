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

enum HttpStatus {
  OK = 200,
  Created = 201,
  Accepted = 202,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  InternalServerError = 500,
}
