import { SizeScreenConstants } from "../constants/size-screen.constants";
import { useMediaQuery } from "react-responsive";

export interface InviewPortType {
  callback: () => void;
  target: HTMLElement;
  options: IntersectionObserverInit | undefined;
  freezeOnceVisible: boolean;
}

// export const checkInViewIntersectionObserver = ({
//   target,
//   options = { root: null, rootMargin: `0%`, threshold: 0 },
//   callback,
//   freezeOnceVisible = false,
// }: InviewPortType) => {
//   const _funCallback: IntersectionObserverCallback = (
//     entries: IntersectionObserverEntry[],
//     observer: IntersectionObserver
//   ) => {
//     entries.map((entry: IntersectionObserverEntry) => {
//       if (entry.isIntersecting) {
//         //
//         callback();
//         //  ---- IF TRUE WE WILL UNOBSERVER AND FALSE IS NO
//         if (freezeOnceVisible) {
//           observer.unobserve(entry.target);
//         }
//       }
//       return true;
//     });
//   };

//   // _checkBrowserSupport-----
//   if (typeof window.IntersectionObserver === "undefined") {
//     console.error(
//       "window.IntersectionObserver === undefined! => Your Browser is Notsupport"
//     );
//     return;
//   }

//   const observer = new IntersectionObserver(_funCallback, options);
//   target && observer.observe(target);
// };

export const useWindowDimensions = () => {
  let currentScreen = SizeScreenConstants.NORMAL; // Tablet
  if (useMediaQuery({ maxWidth: 1024 })) {
    currentScreen = SizeScreenConstants.IS_TABLET;
  }

  if (useMediaQuery({ maxWidth: 764 })) {
    currentScreen = SizeScreenConstants.IS_MOBILE;
  }
  return currentScreen;
};
