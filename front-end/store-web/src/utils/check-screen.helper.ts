import { SizeScreenConstants } from '../constants/size-screen.constants'
import { useMediaQuery } from 'react-responsive'

export default function useWindowDimensions() {
  let currentScreen = SizeScreenConstants.NORMAL // Tablet
  if (useMediaQuery({ maxWidth: 1024 })) {
    currentScreen = SizeScreenConstants.IS_TABLET
  }

  if (useMediaQuery({ maxWidth: 764 })) {
    currentScreen = SizeScreenConstants.IS_MOBILE
  }
  return currentScreen
}
