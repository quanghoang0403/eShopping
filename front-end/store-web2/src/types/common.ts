interface ISEO {
  id: string;
  name: string;
  titleSEO?: string;
  content?: string;
  keywordSEO?: string;
  urlSEO: string;
  descriptionSEO?: string;
  description: string;
}

interface IArea {
  id: number;
  name: string;
}

interface IOption {
  id: number;
  name?: string;
}

interface T> {
  code: number;
  data: T;
  message: string;
  errorMessage: string;
}

interface IPagingResponse {
  pageNumber: number;
  total: number;
}

interface IPagingRequest {
  pageNumber: number;
  pageSize: number;
  keySearch: string;
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
