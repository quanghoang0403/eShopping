export const DateFormat = {
  DD_MM_YYYY: 'DD/MM/YYYY',
  YYYY_MM_DD: 'YYYY/MM/DD',
  MM_DD_YYYY: 'MM/DD/YYYY',
  HH_MM_DD_MM_YYYY: 'hh:mm A DD/MM/yyyy',
  DD_MM_YYYY_HH_MM_SS: 'DD/MM/YYYY, hh:mm:ss',
  MM_DD_YYYY_HH_MM_SS: 'MM/DD/YYYY, hh:mm:ss',
  DD_MM_YYYY_DASH: 'DD-MM-YYYY',
  DDMMYYYYHHmmss: 'DDMMYYYYHHmmss',
  YYYY_MM_DD_HH_MM_SS: 'yyyy-MM-DD HH:mm:ss',
  YYYY_MM_DD_HH_MM_SS_2: 'YYYY-MM-DD HH:mm:ss',
  HH_MM: 'HH:mm',
  HH_MM_DD_MM_YYYY_: 'HH:mm DD/MM/yyyy',
  HH_MM____DD_MM_YYYY_: 'HH:mm      DD/MM/yyyy',
  YYYY_MM_DD_HH_MM: 'yyyy-MM-DD HH:mm',
  DD_MM_YYYY_HH_MM: 'DD/MM/YYYY, HH:mm',
  DD_MM_YYYY_HH_MM_SS_: 'DD/MM/YYYY HH:mm:ss',
  DD_MM: 'DD/MM',
  DD_MM_YYYY_HH_MM_NO_COMMA: 'DD/MM/YYYY HH:mm',
  HH_MM_dash_DD_MM_YYYY: 'HH:mm - DD/MM/YYYY'
}

export const DefaultConstants = {
  ADMIN_ACCOUNT: 'ADMIN',
  STAFF_ACCOUNT: 'STAFF'
}

export const currency = 'đ'

export const TrackingSteps = {
  error: 'error',
  process: 'process'
}

export const Percent = '%'

export const NoDataFound = 'No Data Found'

export const EnDash = '-'

export const ImageSizeDefault = 5242880

export const AllowedNumberOfPhotosDefault = 1

export const guidIdEmptyValue = '00000000-0000-0000-0000-000000000000'

// This pattern allows enter space at the before and after of the email string
export const emailPattern = /^\s*[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}\s*$/

export const MaxCharacterForLongText = 65

export const MaxNumberInput = 999999999

export const blank = '_blank'

export const blankWindowDimensions = 'height=650,width=520'

export const isGuid = (id) => {
  var guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return guidRegex.test(id);
}
