export const upperFirst = (string) => {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : ''
}

// eslint-disable-next-line no-extend-native
String.prototype.removeVietnamese = function () {
  const newStr = this?.toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')

  return newStr
}

export const replaceLastOccurrence = (str, find, replace) => {
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
export const capitalizeUpperCaseWord = (words) => {
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
export const capitalizeFirstLetterEachWord = (words) => {
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
export const capitalize = (data) => {
  const result = data.toLowerCase()
  return result[0].toUpperCase() + result.slice(1)
}

/*
  LOWERCASE FIRST LETTER OF STRING
  Example: "HELLO" => "hELLO"
*/
export const lowercaseFirst = (str) => {
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

export const getSuffixShortValue = (number) => {
  if (!number || number === 0) {
    return ''
  }
  const absNumber = Math.abs(number)
  let suffixShoftValue = ''
  if (absNumber >= 1000000) {
    suffixShoftValue = 'millions'
  }
  if (absNumber >= 1000000000) {
    suffixShoftValue = 'billions'
  }
  if (absNumber >= 1000000000000) {
    suffixShoftValue = 'trillions'
  }

  return suffixShoftValue
}

export const getShortValue = (number) => {
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

export const getCurrencyWithSymbol = () => {
  const { session } = store.getState()
  const { auth } = session
  if (auth?.user) {
    return auth?.user?.currencySymbol ?? 'VND'
  }
  return 'VND'
}

/// Format Currency with code
export const formatCurrency = (number, decimalScale = 2) => {
  const convertNumber = parseFloat(number)
  if (convertNumber >= 0) {
    const currencyCode = ` ${getCurrency()}`
    return <CurrencyFormat value={convertNumber} displayType={'text'} thousandSeparator={true} suffix={currencyCode} decimalScale={decimalScale} />
  }
  return ''
}

/// Format Currency with code
export const formatCurrencyWithoutSuffix = (number) => {
  const convertNumber = parseFloat(number)
  if (convertNumber >= 0) {
    return <CurrencyFormat value={convertNumber} displayType={'text'} thousandSeparator={true} />
  }
  return ''
}

/// Format Currency without currency symbol
export const formatCurrencyWithoutSymbol = (number) => {
  const convertNumber = parseFloat(number)
  if (convertNumber >= 0) {
    return <CurrencyFormat value={convertNumber} displayType={'text'} thousandSeparator={true} />
  }
  return ''
}

/// Format Currency with symbol
export const formatCurrencyWithSymbol = (number) => {
  const convertNumber = parseFloat(number)
  const currencySymbol = ' đ'
  return <CurrencyFormat value={convertNumber} displayType={'text'} thousandSeparator={true} suffix={currencySymbol} />
}

export const getUnitNumberType = (number) => {
  if (number >= 1_000_000_000_000) return 4
  if (number >= 1_000_000_000) return 3
  if (number >= 1_000_000) return 2
  if (number >= 1_000) return 1
  return 0
}

export const formatNumber = (number, decimalScale = 2) => {
  if (!number) {
    return number
  }

  return <CurrencyFormat value={number} displayType={'text'} thousandSeparator={true} decimalScale={decimalScale} />
}

export const formatTextNumber = (number) => {
  if (isNaN(number) || number === null) {
    return '0'
  }
  return `${number}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ''
}

export const formatNumberDecimalOrInteger = (number) => {
  if (isNaN(number) || number === null) {
    return '0'
  }
  const convertNumber = isDecimalNumber(number) ? roundNumber(parseFloat(number), 2) : parseFloat(number)
  return `${convertNumber}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ''
}

export const formatTextRemoveComma = (value) => {
  return value.replace(/\$\s?|(,*)/g, '')
}

/*
  ROUND NUMBER
  Params:
  @number: number to round
  @precision: precision of round
*/
export const roundNumber = (number, precision) => {
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
export const fileNameNormalize = (fileName) => {
  const parsed = fileName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/([^\w]+|\s+)/g, '-') // Replace space and other characters by hyphen
    .replace(/\-\-+/g, '-') // Replaces multiple hyphens by one hyphen
    .replace(/(^-+|-+$)/g, '') // Remove extra hyphens from beginning or end of the string

  return parsed
}
