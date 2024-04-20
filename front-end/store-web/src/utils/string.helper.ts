export const cx = (...classNames: any[]) => classNames.filter(Boolean).join(' ')

export const upperFirst = (string: string) => {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : ''
}

export const replaceLastOccurrence = (str: string, find: string, replace: string) => {
  const lastIndex = str?.lastIndexOf(find)
  if (lastIndex) {
    if (lastIndex === -1) {
      return str
    }
    const before = str.substring(0, lastIndex)
    const after = str.substring(lastIndex + find.length)
    return before + replace + after
  }
  return str
}

/**
 * Capitalize uppercase a string
 * @param {*} string
 * @output "I HAVE LEARNED SOMETHING NEW TODAY"
 */
export const capitalizeUpperCaseWord = (words: string) => {
  if (words) {
    return words.toUpperCase()
  }
  return ''
}

/**
 * Capitalize the first letter of each word in a string
 * @param {*} string
 * @input "i have learned something new today"
 * @output "I Have Learned Something New Today"
 */
export const capitalizeFirstLetterEachWord = (words: string) => {
  if (words) {
    const separateWord = words.toLowerCase().split(' ')
    for (let i = 0; i < separateWord.length; i++) {
      separateWord[i] = separateWord[i].charAt(0).toUpperCase() + separateWord[i].substring(1)
    }
    return separateWord.join(' ')
  }
  return ''
}

// Capitalized Case
export const capitalize = (data: string) => {
  const result = data.toLowerCase()
  return result[0].toUpperCase() + result.slice(1)
}

/*
  LOWERCASE FIRST LETTER OF STRING
  Example: "HELLO" => "hELLO"
*/
export const lowercaseFirst = (str: string) => {
  return str[0].toLowerCase() + str.slice(1)
}

export const getCurrency = () => {
  // const { session } = store.getState()
  // const { auth } = session
  // if (auth?.user) {
  //   return auth?.user?.currencyCode ?? ''
  // }
  return 'đ'
}

export const getShortValue = (number: number) => {
  if (!number || number === 0) {
    return '0'
  }

  if (number < 1000000) {
    return formatTextNumber(number)
  }
  const absNumber = Math.abs(number)
  const tier = Math.floor(Math.log10(absNumber) / 3)
  if (tier === 0) {
    return number.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
  }
  const scaled = number / Math.pow(1000, tier)
  return scaled
    .toFixed(2)
    .replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
    .replace('.00', '')
}

export const getUnitNumberType = (number: number) => {
  if (number >= 1_000_000_000_000) return 4
  if (number >= 1_000_000_000) return 3
  if (number >= 1_000_000) return 2
  if (number >= 1_000) return 1
  return 0
}

export const formatTextNumber = (number: number) => {
  if (isNaN(number) || number === null) {
    return '0'
  }
  return `${number}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ''
}

export const formatNumber = (val: number | string, defaultNull = false) => {
  if (!val) return defaultNull ? null : 0
  return `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

/// Format Currency with code
export const formatCurrency = (number: number) => {
  if (number >= 0) {
    const currencyCode = `${getCurrency()}`
    return formatNumber(number) + currencyCode
  }
  return number
}

export const parserDecimalNumber = (val: string, defaultNull = false) => {
  if (!val) return defaultNull ? null : 0
  return Number.parseFloat(val.replace(/\$\s?|(\,*)/g, '').replace(/(\,{1})/g, ',')).toFixed(2)
}

export const formatTextRemoveComma = (value: string) => {
  return value.replace(/\$\s?|(,*)/g, '')
}

/*
  ROUND NUMBER
  Params:
  @number: number to round
  @precision: precision of round
*/
export const roundNumber = (number: number, precision: number) => {
  if (precision === undefined || precision === null || precision < 1) {
    precision = 1
  } else {
    precision = Math.pow(10, precision)
  }

  return Math.round(number * precision) / precision
}

/**
 * Format file name
 * @param {*} fileName
 * @input "hình- -ảnh"
 * @output "hinh-anh"
 */
export const fileNameNormalize = (fileName: string) => {
  const parsed = fileName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/([^\w]+|\s+)/g, '-') // Replace space and other characters by hyphen
    .replace(/\-\-+/g, '-') // Replaces multiple hyphens by one hyphen
    .replace(/(^-+|-+$)/g, '') // Remove extra hyphens from beginning or end of the string

  return parsed
}
