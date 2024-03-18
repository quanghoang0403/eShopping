/// Format date
export const formatDate = (date, format) => {
  if (format) {
    return moment.utc(date).local().locale('vi').format(format)
  }
  return moment.utc(date).local().locale('vi').format(DateFormat.DD_MM_YYYY)
}

/**
 * Convert moment to date time zone
 * @param {*} momentLocalTime moment
 * @returns
 */
export const momentFormatDateTime = (momentLocalTime) => {
  if (momentLocalTime) {
    return momentLocalTime.format()
  } else {
    return null
  }
}

export const getStartDate = (momentDate) => {
  if (momentDate) {
    return momentFormatDateTime(momentDate?.startOf('day'))
  }

  return null
}

export const getEndDate = (momentDate) => {
  if (momentDate) {
    return momentFormatDateTime(momentDate?.endOf('day'))
  }

  return null
}

// Format time from dd/MM/yyyy: 00:00:00 to dd/MM/yyyy: current time
export const formatOnlyDate = (moment) => {
  const time = new Date()
  moment.set('hour', time.getHours()).set('minute', time.getMinutes()).set('second', time.getSeconds()).set('millisecond', time.getMilliseconds())

  return moment
}
