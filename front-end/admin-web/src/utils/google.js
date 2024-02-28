import { DEFAULT_LOCATION, RESPONSE_STATUS } from '../constants/google.constant'

export const checkGoogleApiKey = async (googleApiKey) => {
  let isGoogleApiWorked = false
  const api = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${DEFAULT_LOCATION.StepMedia.Lat},${DEFAULT_LOCATION.StepMedia.Lng}&key=${googleApiKey}`
  await fetch(api)
    .then((res) => res.json())
    .then((data) => {
      isGoogleApiWorked = data.status === RESPONSE_STATUS.Status
    })
    .catch((error) => console.error(error))

  return isGoogleApiWorked
}

export function getAddressDetails (addressComponents) {
  if (!addressComponents || addressComponents?.length < 1) return

  const details = {
    ward: '',
    district: '',
    city: ''
  }

  for (const component of addressComponents) {
    const types = component.types

    if (types.includes('sublocality') || types.includes('sublocality_level_1')) {
      details.ward = component.long_name
    } else if (types.includes('administrative_area_level_2')) {
      details.district = component.long_name
    } else if (types.includes('administrative_area_level_1')) {
      details.city = component.long_name
    }
  }

  return details
};
