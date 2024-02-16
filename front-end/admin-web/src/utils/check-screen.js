import { SizeScreen } from "constants/size-screen.constants";
import { useMediaQuery } from "react-responsive";

export default function useWindowDimensions() {
  var currentScreen = SizeScreen.NORMAL; //Tablet
  if (useMediaQuery({ maxWidth: 1024 })) {
    currentScreen = SizeScreen.IS_TABLET;
  }

  if (useMediaQuery({ maxWidth: 764 })) {
    currentScreen = SizeScreen.IS_MOBILE;
  }
  return currentScreen;
}
