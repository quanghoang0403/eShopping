import jwt_decode from 'jwt-decode'
import moment from 'moment'
import { getCurrency } from './string.helper'

/// Run the function in next tick
export const executeAfter = (ms, callback) => {
  clearTimeout(window.searchTimeout)
  return new Promise((resolve) => {
    window.searchTimeout = setTimeout(() => {
      callback()
      resolve()
    }, ms)
  })
}

/// random GuidId
export const randomGuid = () => {
  const s = []
  const hexDigits = '0123456789abcdef'
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-'

  const uuid = s.join('')
  return uuid
}

/**
 * Convert API response errors to error object
 * @param {*} errors
 * @returns Object
 */
export const getApiError = (errors) => {
  const errorsData = errors?.map((err) => {
    return {
      name: lowercaseFirst(err.type),
      message: err.message,
    }
  })

  const object = errorsData.reduce((obj, item) => Object.assign(obj, { [item.name]: item.message }), {})

  return object
}

/**
 * Build Form data from object
 * @param {*} formData
 * @param {*} data
 * @param {*} parentKey
 */
export const buildFormData = (formData, data, parentKey) => {
  if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
    Object.keys(data).forEach((key) => {
      buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key)
    })
  } else {
    const value = data === null ? '' : data
    formData.append(parentKey, value)
  }
}

/**
 * Convert json object to form data
 * @param {*} data
 * @returns
 */
export const jsonToFormData = (data) => {
  const formData = new FormData()
  buildFormData(formData, data)
  return formData
}

export const compareTwoArrays = (array1, array2) => {
  try {
    if (array1?.length > 0 && array2?.length > 0) {
      const array2Sorted = array2?.slice()?.sort()
      const result =
        array1?.length === array2?.length &&
        array1
          ?.slice()
          ?.sort()
          ?.every(function (value, index) {
            return value === array2Sorted[index]
          })
      return result
    } else {
      return false
    }
  } catch {
    return false
  }
}

export const tokenExpired = (token) => {
  const decoded = jwt_decode(token)
  const utcTime = moment.unix(decoded.exp)
  const tokenExpireDate = new Date(utcTime.format('M/DD/YYYY hh:mm:ss A UTC'))
  const currentDate = Date.now()
  const tokenExpired = moment(currentDate).isAfter(tokenExpireDate) ?? false

  return tokenExpired
}

export const shortString = (text, length) => {
  if (text === '' || text === null || text === undefined || length < 1) return ''
  if (text.length < length) return text
  return text.substring(0, length) + '...'
}

export const sortChildRoute = (routes) => {
  let numberIndex = 0
  for (let i = 0; i < routes.length; i++) {
    const element = routes[i]
    if (element.isMenu === true && hasPermission(element.permission)) {
      const permissionGroup = getPermissionGroup(element.permission)
      if (permissionGroup.every((x) => x.isFullPermission === true)) {
        routes[i].position = 0
      } else {
        routes[i].position = numberIndex + 1
      }
      numberIndex++
    }
  }

  return routes
}

/**
 Try to convert string to JSON, if str is not a JSON format => return null. Otherwise return an Object
 Use this function to call JSON.parse(str) once for performance.
 Input: str is a string
 **/
export const tryJsonString = (str) => {
  let jsonData = {}
  try {
    jsonData = JSON.parse(str)
  } catch (e) {
    return null
  }
  return jsonData
}

/**
 Check if a string can convert to JSON, if YES return true. Otherwise return false
 Input: str is a string
 **/
export const isJsonString = (str) => {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

/**
 * Get the value of a given query string parameter.
 */
export const getParamsFromUrl = (url) => {
  const params = new URLSearchParams(url)
  const result = {}
  for (const [key, value] of params.entries()) {
    result[key] = value
  }

  return result
}

/**
 * Get Unique Id
 * @returns string (ex: 'ed596b16-debf-4471-b824-79e0d568ef0f')
 */
export const getUniqueId = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16))
}

// If the number is a decimal. This function will format and return the value of the decimal number and the corresponding decimal part
export const getTheNumberValueWithAmountDigitsDecimalIfTheNumberIsADecimal = (numberValue, amountDigitsDecimalValue = 2) => {
  const isInteger = checkIfNumberIsAInteger(numberValue)
  let resultValue = numberValue
  if (!isInteger && numberValue !== 0) {
    resultValue = (Math.round(numberValue * 100) / 100).toFixed(amountDigitsDecimalValue)
  }

  return resultValue
}

/**
 * @param {*} arrayAttributes: List keys get value (ex: ['general', 'generalBackground', 'backgroundType'])
 * @param {*} newObject: object and will get key to compare with key of old object
 * @param {*} oldObject: object will being compare
 */
const compareValue = (arrayAttributes, newObject, oldObject) => {
  return arrayAttributes.every((value) => {
    let valueNew = getValueFromKey(value, newObject)
    let valueOld = getValueFromKey(value, oldObject)
    if (/<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>/.test(valueNew) && /<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>/.test(valueOld)) {
      valueNew = valueNew.replace(/(?:\r\n|\r|\n)/g, '')
      valueOld = valueOld.replace(/(?:\r\n|\r|\n)/g, '')
    }
    if (Array.isArray(valueNew) && Array.isArray(valueOld)) {
      valueNew = valueNew.length
      valueOld = valueOld.length
    }
    if (valueNew !== undefined && valueNew !== valueOld && valueOld !== undefined) return false
    else return true
  })
}

const getValueFromKey = (arrayAttributes, obj) => {
  arrayAttributes.forEach((key) => {
    obj = obj?.[key]
  })
  return obj
}

let result = []
const recurse = (object, preKey = [], currentKey = []) => {
  if (object != null && object !== '') {
    const arrayKeys = Object.keys(object)
    if (arrayKeys.length > 0 && typeof object === 'object') {
      preKey = [...currentKey]
      arrayKeys.forEach((key) => {
        const childObject = object[key]
        const newKey = preKey.concat(key)
        recurse(childObject, preKey, newKey)
      })
    } else {
      result.push(currentKey)
    }
  } else {
    result.push(currentKey)
  }
}

export const CompareTwoObjs = (newObject, oldObject, currentPage) => {
  const keys1 = Object.keys(newObject)
  let flag = true
  for (const key of keys1) {
    if (key === 'general') {
      result = []
      if (newObject[key] instanceof Object) {
        recurse(newObject[key])
        if (result.length > 0) {
          const valueNewGeneral = newObject[key]
          const valueOldGeneral = oldObject[key]
          flag = compareValue(result, valueNewGeneral, valueOldGeneral)
        }
      }
    }
    if (key === 'pages' && flag === true) {
      result = []
      const pageConfigNew = newObject[key].find((x) => x.id === currentPage?.id)
      const indexOfPageNew = newObject[key]?.indexOf(pageConfigNew)

      const pageConfigOld = oldObject[key].find((x) => x.id === currentPage?.id)
      const indexOfPageOld = oldObject[key]?.indexOf(pageConfigOld)

      if (newObject[key][indexOfPageNew] instanceof Object) {
        recurse(newObject[key][indexOfPageNew])
        if (result.length > 0) {
          const valueNewGeneral = newObject[key][indexOfPageNew]
          const valueOldGeneral = oldObject[key][indexOfPageOld]
          flag = compareValue(result, valueNewGeneral, valueOldGeneral)
        }
      }
    }
  }
  return flag
}

export const getFilename = (url) => {
  if (url) {
    return url.split('/').pop().split('#')[0].split('?')[0]
  }
  return null
}

export const getFileExtension = (filename) => {
  const ext = /^.+\.([^.]+)$/.exec(filename)
  return ext == null ? '' : ext[1]
}

export const getThumbnailUrl = (url, device = 'web' | 'mobile') => {
  const fileName = getFilename(url)
  const fileExtension = getFileExtension(fileName)
  if (fileName && fileExtension && fileExtension !== 'gif' && fileExtension !== 'webp' && fileExtension !== 'ico' && fileExtension !== 'svg') {
    return replaceLastOccurrence(url, '.', `.thumb.${device}.`)
  }
  return url
}

export const getKeyByValue = (object, value) => {
  return Object.keys(object).find((key) => object[key] === value)
}

export const replaceParameter = (originalString, parameter) => {
  if (!originalString || !parameter) return originalString

  // Replace the parameter value with the actual value
  const replacedString = originalString.replace(/{{(.*?)}}/g, (match, key) => parameter[key] ?? match)

  return replacedString
}

export const convertSeoUrl = (url) => {
  return url
    .toString() // Convert to string
    .normalize('NFD') // Change diacritics
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/-/g, ' ') // Replace "-" character
    .replace(/[^a-z0-9\+]/g, ' ') // Remove anything that is not a letter, number or dash
    .replace(/\s+/g, ' ')
    .trim() // Remove extra white space
    .replace(/[\u0300-\u036f]/g, '') // Remove illegal characters
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase() // Change to lowercase
    .replace(/\s+/g, '+') // Change whitespace to dashes
    .replace(/&/g, '-and-') // Replace ampersand
    .replace(/-+/g, '-') // Remove duplicate dashes
    .replace(/^-*/, '') // Remove starting dashes
    .replace(/-*$/, '') // Remove trailing dashes
    .replace(/\+/g, '-') // Replace plus signs with dashes
}

export const convertSeoUrlToText = (urlSeo) => {
  if (!urlSeo) return
  return urlSeo?.replace(/\+/g, ' ')
}

export const formatNumber = (val, defaultNull = false) => {
  if (!val) return defaultNull ? null : 0
  return `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export const formatNumberCurrency = (val, defaultNull = false) => {
  return formatNumber(val, defaultNull) + getCurrency()
}

export const parserDecimalNumber = (val, defaultNull = false) => {
  if (!val) return defaultNull ? null : 0
  return Number.parseFloat(val.replace(/\$\s?|(\,*)/g, '').replace(/(\,{1})/g, ',')).toFixed(2)
}
