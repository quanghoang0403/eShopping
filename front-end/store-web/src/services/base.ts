import axios from 'axios'
import cookie from 'js-cookie'
import qs from 'qs'
import { localStorageKeys, getStorage } from '@/utils/localStorage.helper'
import { tokenExpired } from '@/utils/common.helper'

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
      const expired = tokenExpired(token)
      if (expired === true) {
        _redirectToLoginPage()
        return
      }
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
    const token = _getToken()
    if (token) {
      const expired = tokenExpired(token)
      if (expired === true) {
        _redirectToLoginPage()
        return
      }
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

const _getToken = () => {
  const token = getStorage(localStorageKeys.TOKEN)
  return token
}

const _redirectToLoginPage = () => {
  // store.dispatch(resetSession());
  window.location.href = '/login'
}

export { APIServiceUpload }
export default APIService
