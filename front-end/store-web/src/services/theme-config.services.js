import { GlobalCSSProperty } from "../constants/css-property.constant";
import { store } from "../modules";

const getValueFromKey = (arrayAttributes, obj) => {
  arrayAttributes.forEach((key) => {
    if (obj[key] && obj[key] instanceof Object) {
      obj = obj[key];
    } else {
      return (obj = obj[key]);
    }
  });
  return obj;
};

const getConfigsByKey = (arrayKeys) => {
  const themeConfigs = getConfigs();
  const value = getValueFromKey(arrayKeys, themeConfigs);
  return value;
};

const getConfigs = () => {
  const themeConfigs = store.getState()["session"]["themeConfig"];
  return themeConfigs;
};

const isExistLink = (links, link) => {
  let isExist = false;
  links.forEach((element) => {
    const thisElement = element.href;
    const thisLink = link.href;
    if (thisElement === thisLink) {
      isExist = true;
    }
  });

  return isExist;
};

export const addFont = (path) => {
  const link = document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("href", path);
  var head = document.head;
  var links = head.querySelectorAll("link");
  const _isExistLink = isExistLink(links, link);
  if (_isExistLink === false) {
    document.head.insertBefore(link, document.head.firstChild);
  }
};

function setGlobalCSSPropertyByColorGroupDefault() {
  var themeConfig = themeConfigServices.getConfigs();
  const colorGroupDefault = themeConfig?.general?.color?.colorGroups?.[0];
  const rootStyle = document.documentElement.style;
  rootStyle.setProperty(GlobalCSSProperty.GLOBAL_TITLE_COLOR, colorGroupDefault?.titleColor);
  rootStyle.setProperty(GlobalCSSProperty.GLOBAL_TEXT_COLOR, colorGroupDefault?.textColor);
  rootStyle.setProperty(GlobalCSSProperty.GLOBAL_BUTTON_BACKGROUND_COLOR, colorGroupDefault?.buttonBackgroundColor);
  rootStyle.setProperty(GlobalCSSProperty.GLOBAL_BUTTON_TEXT_COLOR, colorGroupDefault?.buttonTextColor);
  rootStyle.setProperty(GlobalCSSProperty.GLOBAL_BUTTON_BORDER_COLOR, colorGroupDefault?.buttonBorderColor);
}

const themeConfigServices = {
  getConfigsByKey,
  getConfigs,
  setGlobalCSSPropertyByColorGroupDefault,
};

export default themeConfigServices;
