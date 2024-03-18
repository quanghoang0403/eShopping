// eslint-disable-next-line no-extend-native
String.prototype.clone = function (maxlength) {
  if (this) {
    let newStr = this?.toString() + '-copy'

    if (maxlength) {
      // If newStr has more than maxlength characters => only get maxlength characters.
      if (newStr.length > maxlength && maxlength > 0) {
        newStr = newStr.substring(0, maxlength)
      }
    }

    return newStr
  }

  return 'New'
}

/**
 * Check onKeyPress event and check input key
 * @param {event} event the event of the input
 * @param {string} id is the ID of the InputText
 * @param {number} min: minimum number
 * @param {number} max: maximum number
 * @param {number} precision: number of precision allow
 * @returns {boolean} TRUE: allow key input, FALSE: deny key input
 */
export const checkOnKeyPressValidation = (event, id, min, max, precision) => {
  // If min >=0, do not allow enter -
  if (min != null && min >= 0) {
    if (event.key === '-') {
      return false
    }
  }
  // If do not enter precision. Only allow input number or -
  if (precision != null && precision === 0) {
    if (!/[0-9]/.test(event.key) && event.key !== '-') {
      return false
    }
  } else {
    if (!/[0-9]/.test(event.key) && event.key !== '.' && event.key !== '-') {
      return false
    }
  }

  // Get current text and check to allow input or not?
  let text = id == null || id === '' ? null : document.getElementById(id).value
  if (text === null) return true
  text = text.toString().replace(/,/g, '')

  // Do not allow input . in font of a number
  if (text === '' && event.key === '.') return false
  // Do not allow input ..
  if (text.indexOf('.') >= 0 && event.key === '.') return false
  // Do not allow input --
  if (text.indexOf('-') >= 0 && event.key === '-') return false
  // Do not allow input - in the middle of text
  if (text !== '' && event.key === '-') return false

  // Check current text in range. If not in range do not allow
  if (document.getElementById(id).selectionStart === undefined || document.getElementById(id).selectionStart === null) {
    text = text + event.key
  } else {
    if (document.getElementById(id).selectionEnd > document.getElementById(id).selectionStart) {
      text = text.substring(0, document.getElementById(id).selectionStart) + event.key + text.substring(document.getElementById(id).selectionEnd + 1)
    } else text = text + event.key
  }

  try {
    if (max !== null && text * 1.0 > max) {
      return false
    }
    if (min !== null && text * 1.0 < min) {
      return false
    }
  } catch {}

  return true
}

/*
  Check onKeyUp event and check input text.
  If YES: do nothing
  IF NO: set input text to valid number
  Parameter:
  id: is the ID of the InputText
  event: the event of the input
  min: minimum number
  max: maximum number
  */
export const checkOnKeyUpValidation = (event, id, min, max) => {
  // Make sure input data in range after user finish entering a key
  let text = id == null || id === '' ? '' : document.getElementById(id).value
  if (text === null) return true
  text = text.toString().replace(',', '')

  try {
    if (max !== null && text * 1.0 > max) return false
    if (min !== null && text * 1.0 < min) return false
  } catch {
    return false
  }

  return true
}

// This function will check if the number is the decimal
export const checkIfNumberIsAInteger = (numberValue) => {
  if (numberValue) {
    return Number.isInteger(numberValue)
  }

  return false
}

export const isValidHttpUrl = (string) => {
  let url
  try {
    url = new URL(string)
  } catch (_) {
    return false
  }
  return url.protocol === 'http:' || url.protocol === 'https:'
}

/// check valid email
export const isValidEmail = (string) => {
  const emailPattern =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (!emailPattern.test(string)) {
    return false
  }
  return true
}

/// check valid phone number
export const isValidPhoneNumber = (string) => {
  const phonePattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
  if (!phonePattern.test(string)) {
    return false
  }
  return true
}

export const ValidPhonePattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,6}$/im

export const isDecimalKey = (val) => {
  const charCode = val.which ? val.which : val.keyCode
  if (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57)) return false

  return true
}

export const isDecimalNumber = (value) => {
  // check value is number
  if (isNaN(value)) {
    return false
  }

  // check value is decimal
  const parsedValue = parseFloat(value)
  return parsedValue % 1 !== 0
}
