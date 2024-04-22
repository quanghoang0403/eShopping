export const MaximumNumber = 999999999
export const MinimumNumber = 0
export const EmptyId = '00000000-0000-0000-0000-000000000000'
export const DELAYED_TIME = 0

export const tableSettings = {
  page: 1,
  pageSize: 20
}

export const COLOR = {
  PRIMARY: '#50429B',
  SECONDARY: '#EBE8FE'
}

export const sortConstant = {
  ASC: 'ascend',
  DESC: 'descent'
}

/**
 * Range number 0-999999999
 * https://regexr.com/
 */
export const inputNumberRange1To999999999 = {
  range: '^([0-9]|[1-9][0-9]{1,8})$'
}

/**
 * Range number 1-999999999
 * https://regexr.com/
 */
export const inputNumberRangeOneTo999999999 = {
  range: '^([1-9]|[1-9][0-9]{1,8})$'
}

/**
 * Range number 0-100
 * https://regexr.com/
 */
export const inputNumberRange0To100 = {
  range: '^([0-9]|[1-9][0-9]|100)$'
}

/**
 * Range number 0-10000
 * https://regexr.com/
 */
export const inputNumberRange0To10000 = {
  range: '^(0|[1-9]\\d{0,3}|10000)(\\.\\d+)?$'
}

/**
 * Range number 0-999999999
 * https://regexr.com/
 */
export const inputNumberRange0To999999999 = {
  range: '^(0|[1-9]\\d{0,8})$'
}

export const inputNumberRange0To999999999DotAllow = {
  range: '^(0|([1-9]\\d{0,8}))(\\.\\d+)?$'
}

export const inputNumberRange1To999999999DotAllow = {
  range: '^([0-9]|[1-9][0-9]{1,8})(\\.\\d+)?$'
}

export const INPUT_PHONE_NUMBER_REGEX = /^[0-9]{9,12}\s*?$/

export const PHONE_NUMBER_REGEX = /(03[2-9]|05[2689]|07[06-9]|08[1-9]|09[0-49])+([0-9]{7})\b/

export const MAXIMUM_FILE_SIZE = 20 * 1024 * 1024 // 20 MB => bytes

export const MAXIMUM_FILE_SIZE_DISPLAY = 20 // 20 MB
