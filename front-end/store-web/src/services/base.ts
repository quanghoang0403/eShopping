import axios from 'axios'
import cookie from 'js-cookie'
import qs from 'qs'

const APIService = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
})

APIService.interceptors.request.use(
  (request: any) => {
    if (!request.params) {
      request.params = {}
    }
    const token = cookie.get('token')
    if (token) {
      request.headers.Authorization = `Bearer ${token}`
    } else {
      delete request.headers.Authorization
    }
    request.baseURL = process.env.NEXT_PUBLIC_BACKEND
    request.paramsSerializer = (params: any) => qs.stringify(params)
    return request
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for API calls
APIService.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    // handle token expired ở đây, nhớ clear cookie
    return Promise.reject(error)
  }
)

const APIServiceUpload = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND,
})

APIServiceUpload.interceptors.request.use(
  (request: any) => {
    if (!request.params) {
      request.params = {}
    }
    const token = cookie.get('token')
    if (token) {
      request.headers.Authorization = `Bearer ${token}`
    } else {
      delete request.headers.Authorization
    }
    request.baseURL = process.env.NEXT_PUBLIC_BACKEND
    request.paramsSerializer = (params: any) => qs.stringify(params)
    return request
  },
  (error) => {
    return Promise.reject(error)
  }
)

export { APIServiceUpload }
export default APIService
