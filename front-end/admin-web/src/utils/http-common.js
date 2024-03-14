import { message } from 'antd'
import axios from 'axios'
import { resetSession } from 'store/modules/session/session.actions'
import { env, ENVIRONMENT } from '../env'
import { store } from '../store'
import { tokenExpired } from './helpers'
import { getStorage, localStorageKeys } from './localStorage.helpers'
import i18n from 'utils/i18n'

const { t } = i18n
const date = new Date()
const timezoneOffset = date.getTimezoneOffset()
const http = axios.create({
  baseURL: `${env.REACT_APP_ROOT_DOMAIN}`,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'X-TIMEZONE-OFFSET': timezoneOffset
  },
  timeout: 30000
})

http.interceptors.request.use(
  async (config) => {
    if (config.withCredentials) {
      const token = _getToken()
      if (token) {
        const expired = tokenExpired(token)
        if (expired === true) {
          _redirectToLoginPage()
          return
        }

        config.headers.Authorization = `Bearer ${token}`
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

http.interceptors.response.use(
  async (response) => {
    const { config } = response
    _httpLogging(response?.data)

    if (config?.responseType === 'blob') {
      return response
    }

    if (response.status === 200) {
      return response?.data
    }

    return response
  },
  (error) => {
    _httpLogging(error?.response)

    const responseTokenExpired = error?.response?.headers['token-expired']
    if (responseTokenExpired && responseTokenExpired === 'true') {
      // store.dispatch(resetSession());
      window.location.href = '/login'
      return Promise.reject(error?.response)
    }

    const token = _getToken()
    /// User has token and receive 401 => restricted page
    if (token && error?.response?.status === 401) {
      const isExpired = tokenExpired(token)
      if (isExpired === true) {
        _redirectToLoginPage()
      } else {
        window.location.href = '/page-not-permitted'
      }
    }

    /// If error is 401 and has not token redirect to login page
    if (!token && error?.response?.status === 401) {
      _redirectToLoginPage()
    }

    if (error?.response?.status === 403) {
      window.location.href = '/page-not-permitted'
    }

    if (error?.response?.status === 404) {
      _redirectToNotFoundPage()
    }

    if (
      error &&
      error.response &&
      error.response.data.errors &&
      error.response.data.errors.length > 0
    ) {
      const { errors } = error.response.data
      return Promise.reject(errors)
    }

    const errorMessage = error?.response?.data?.message
    if (errorMessage) {
      message.error(t(errorMessage))
    }

    return Promise.reject(error?.response)
  }
)

export const downloadAsync = async (url, onProgressCallback) => {
  const response = await http.get(url, {
    responseType: 'blob',
    onDownloadProgress: (progressEvent) => {
      const progress = (progressEvent.loaded / progressEvent.total) * 100
      onProgressCallback(progress)
    }
  })

  const _getFileName = (response) => {
    const { headers } = response
    let filename = ''
    const disposition = headers['content-disposition']
    if (disposition && disposition.indexOf('attachment') !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
      const matches = filenameRegex.exec(disposition)
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, '')
      }
    }
    return filename
  }
  const { data } = response
  const file = {
    fileName: _getFileName(response),
    data
  }

  return file
}

// #region Private methods

const _getToken = () => {
  const token = getStorage(localStorageKeys.TOKEN)
  return token
}

/// Clear session and redirect to login page
const _redirectToLoginPage = () => {
  // store.dispatch(resetSession());
  window.location.href = '/login'
}

///  redirect to NotFound page
const _redirectToNotFoundPage = () => {
  window.location.href = '/pageNotFound'
}

const _httpLogging = (data) => {
  if (env.NODE_ENV === ENVIRONMENT.Development) {
    console.log('%cresponse >>', 'color: #349f01', data)
  }
}

// #endregion

export default http
