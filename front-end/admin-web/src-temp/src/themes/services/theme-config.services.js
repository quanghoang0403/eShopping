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

const themeConfigServices = {
  getConfigsByKey,
  getConfigs,
};

export default themeConfigServices;
