import { ThemeKeys } from "constants/theme.constants";
import { store } from "store";
import { setHeaderMenuOptions, setThemeConfig } from "store/modules/theme-customize/theme-customize.actions";

function mergeArrays(arr1, arr2) {
  let mergedArray = [...arr1];
  for (let item2 of arr2) {
    let found = false;
    for (let i = 0; i < mergedArray.length; i++) {
      if (mergedArray[i].id === item2.id) {
        found = true;
        mergedArray[i] = item2;
        break;
      }
    }
    if (!found) {
      mergedArray.push(item2);
    }
  }
  return mergedArray;
}

function mergeObjects(obj1, obj2) {
  for (let key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (typeof obj2[key] === "object" && !Array.isArray(obj2[key])) {
        if (!obj1.hasOwnProperty(key)) {
          obj1[key] = {};
        }
        obj1[key] = mergeObjects(obj1[key], obj2[key]);
      } else if (Array.isArray(obj2[key])) {
        if (!obj1.hasOwnProperty(key) || key === ThemeKeys.MenuItems) {
          obj1[key] = obj2[key];
        } else {
          obj1[key] = mergeArrays(obj1[key], obj2[key]);
        }
      } else {
        obj1[key] = obj2[key];
      }
    }
  }
  return obj1;
}

export const mergeThemeConfig = (defaultConfig, latestConfig) => {
  return mergeObjects(defaultConfig, latestConfig);
};

export const getThemeThumbnail = (themeId) => {
  if (themeId === ThemeKeys.TropicalFruit) {
    return "/images/default-theme/1/theme-thumbnail.png";
  }
  if (themeId === ThemeKeys.PhoViet) {
    return "/images/default-theme/2/theme-thumbnail.png";
  }
};

export const dispatchThemeConfig2Redux = (themeConfig) => {
  store.dispatch(setThemeConfig(themeConfig));
};

export const dispatchThemeHeaderMenuOptions2Redux = (data) => {
  store.dispatch(setHeaderMenuOptions(data));
};

