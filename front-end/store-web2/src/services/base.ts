import axios, { AxiosResponse } from 'axios'
import cookie from 'js-cookie'
import { tokenExpired } from '@/utils/common.helper'
import { getCookie, cookieKeys, resetSession, setCookie } from '@/utils/localStorage.helper'
import qs from 'qs'

const _redirectToLoginPage = () => {
  window.location.href = '/login'
}

const refreshToken = async () => {
  const token = getCookie(cookieKeys.TOKEN)
  const refreshToken = getCookie(cookieKeys.REFRESH_TOKEN)
  if (refreshToken && token) {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND}/authenticate/refresh-token`, { token, refreshToken })
      if (response.data) {
        setCookie(cookieKeys.TOKEN, response.data.token)
        setCookie(cookieKeys.REFRESH_TOKEN, response.data.refreshToken)
      } else {
        resetSession()
      }
    } catch (error) {
      resetSession()
      console.error(error)
    }
  } else {
    resetSession()
  }
}

const _configRequest = async (request: any) => {
  if (!request.params) {
    request.params = {}
  }
  let token = getCookie(cookieKeys.TOKEN)
  if (token) {
    const expired = tokenExpired(token)
    if (expired === true) {
      await refreshToken()
      token = getCookie(cookieKeys.TOKEN)
    }
    request.headers.Authorization = `Bearer ${token}`
  } else {
    delete request.headers.Authorization
  }
  request.baseURL = process.env.NEXT_PUBLIC_BACKEND
  request.paramsSerializer = (params: any) => qs.stringify(params)
  return request
}

//const _configResponse = async (response: any) => response

const _configResponse = async (response: AxiosResponse<any>) => response.data

// const _configResponse = async <T>(response: AxiosResponse<IBaseResponse<T>>) => {
//   return response.data;
// };

const _configError = async (error: any) => {
  console.log('error', error)
  const messageError = error.response?.data?.message || error.message
  if (axios.isCancel(error)) {
    return new Promise((r) => {
      console.log('Cancel:', r)
    })
  }
  if (
    error.request.responseType === 'blob' &&
    error.response.data instanceof Blob &&
    error.response.data.type &&
    error.response.data.type.toLowerCase().indexOf('json') !== -1
  ) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => {
        error.response.data = JSON.parse(reader.result as string)
        resolve(
          Promise.reject({
            ...error,
            message: messageError,
          })
        )
      }

      reader.onerror = () => {
        reject({
          ...error,
          message: messageError,
        })
      }
      reader.readAsText(error?.response?.data)
    })
  }

  return Promise.reject({
    ...error,
    message: messageError,
  })
}

const APIService = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
})

const APIServiceUpload = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND,
})

APIService.interceptors.request.use(_configRequest, _configError)
APIService.interceptors.response.use(_configResponse, _configError)

APIServiceUpload.interceptors.request.use(_configRequest, _configError)
APIServiceUpload.interceptors.response.use(_configResponse, _configError)

export { APIServiceUpload }
export default APIService
