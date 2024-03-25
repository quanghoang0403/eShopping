import axios from 'axios'
import qs from 'qs'
import { tokenExpired } from '@/utils/common.helper'
import { useAppSelector, useAppDispatch } from '@/hooks/reduxHook'
import { sessionActions } from '@/redux/features/sessionSlice'

const _redirectToLoginPage = () => {
  const dispatch = useAppDispatch()
  dispatch(sessionActions.logout())
  window.location.href = '/login'
}

const _configRequest = async (request: any) => {
  if (!request.params) {
    request.params = {}
  }
  const token = useAppSelector((state) => state.session.token)
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
}

const _configResponse = async (response: any) => response.data

const _configError = async (error: any) => {
  console.log(error)
  const messageError = error.response.data?.message || error.message
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
