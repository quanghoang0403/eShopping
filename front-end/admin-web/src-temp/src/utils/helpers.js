/* eslint-disable no-useless-escape */
import { TEMPLATE_ID } from "constants/qr-code.constants";
import { currency, DateFormat } from "constants/string.constants";
import { OnlineStoreFeaturePath } from "constants/theme.constants";
import { createBrowserHistory } from "history";
import JsBarcode from "jsbarcode";
import jwt_decode from "jwt-decode";
import moment from "moment";
import QRCode from "qrcode";
import CurrencyFormat from "react-currency-format";
import languageService from "services/language/language.service";
import { store } from "store";
import i18n from "utils/i18n";
import { getStorage, localStorageKeys } from "./localStorage.helpers";
import { decryptWithAES } from "./securityHelpers";

const { t } = i18n;
export const browserHistory = createBrowserHistory();

/// Format date
export const formatDate = (date, format) => {
  if (format) {
    return moment.utc(date).local().locale(languageService.getLang()).format(format);
  }
  return moment.utc(date).local().locale(languageService.getLang()).format(DateFormat.DD_MM_YYYY);
};

export const stringDate = (languageCode) => {
  return moment()
    .toDate()
    .toLocaleDateString(languageCode || "en-US");
};

/**
 * Convert utc time to local time
 * @example utc 1AM => local time = 8AM (+7 GMT)
 * @param {*} dateTime
 * @returns
 */
export const convertUtcToLocalTime = (dateTime) => {
  if (dateTime) return moment.utc(dateTime).local();
  return null;
};

export const getCurrency = () => {
  const { session } = store.getState();
  const { auth } = session;
  if (auth?.user) {
    return auth?.user?.currencyCode ?? "";
  }
  return "";
};

export const getCurrencyWithSymbol = () => {
  const { session } = store.getState();
  const { auth } = session;
  if (auth?.user) {
    return auth?.user?.currencySymbol ?? "VND";
  }
  return "VND";
};

/// Format Currency with code
export const formatCurrency = (number) => {
  let convertNumber = parseFloat(number);
  if (convertNumber >= 0) {
    const currencyCode = ` ${getCurrency()}`;
    return <CurrencyFormat value={convertNumber} displayType={"text"} thousandSeparator={true} suffix={currencyCode} />;
  }
  return "";
};

/// Format Currency with code
export const formatCurrencyWithoutSuffix = (number) => {
  let convertNumber = parseFloat(number);
  if (convertNumber >= 0) {
    return <CurrencyFormat value={convertNumber} displayType={"text"} thousandSeparator={true} />;
  }
  return "";
};

/// Format Currency without currency symbol
export const formatCurrencyWithoutSymbol = (number) => {
  let convertNumber = parseFloat(number);
  if (convertNumber >= 0) {
    return <CurrencyFormat value={convertNumber} displayType={"text"} thousandSeparator={true} />;
  }
  return "";
};

/// Format Currency with symbol
export const formatCurrencyWithSymbol = (number) => {
  let convertNumber = parseFloat(number);
  const currencySymbol = ` ${getCurrencyWithSymbol() !== "" ? getCurrencyWithSymbol() : currency.d}`;
  return <CurrencyFormat value={convertNumber} displayType={"text"} thousandSeparator={true} suffix={currencySymbol} />;
};

export const formatNumber = (number) => {
  return <CurrencyFormat value={number} displayType={"text"} thousandSeparator={true} />;
};

export const formatTextNumber = (number) => {
  if (isNaN(number) || number === null) {
    return "0";
  }
  return `${number}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "";
};

export const formatNumberDecimalOrInteger = (number) => {
  if (isNaN(number) || number === null) {
    return "0";
  }
  let convertNumber = isDecimalNumber(number) ? roundNumber(parseFloat(number), 2) : parseFloat(number);
  return `${convertNumber}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "";
};

export const formatTextRemoveComma = (value) => {
  return value.replace(/\$\s?|(,*)/g, "");
};

/// Run the function in next tick
export const executeAfter = (ms, callback) => {
  clearTimeout(window.searchTimeout);
  return new Promise((resolve) => {
    window.searchTimeout = setTimeout(() => {
      callback();
      resolve();
    }, ms);
  });
};

// Get permission from store
export const getPermissions = () => {
  const { session } = store.getState();
  return session?.permissions ?? [];
};

/// Check permission
export const hasPermission = (permissionId) => {
  if (permissionId === "public") return true;

  const { session } = store.getState();
  let allPermissions = session?.permissions ?? [];
  if (allPermissions.length === 0) {
    var storagePermissions = getStorage(localStorageKeys.PERMISSIONS);
    let decodeData = decryptWithAES(storagePermissions);
    if (decodeData) {
      var permissions = JSON.parse(decodeData);
      allPermissions = permissions;
    }
  }

  const isArrayPermissions = Array.isArray(permissionId);
  if (isArrayPermissions === true) {
    let hasPermission = false;
    permissionId.forEach((p) => {
      const index = allPermissions.findIndex((x) => x?.id?.toString().toUpperCase() === p?.toString().toUpperCase());

      if (index !== -1) {
        hasPermission = true;
        return true;
      }
    });

    return hasPermission;
  } else {
    const index = allPermissions.findIndex(
      (x) => x?.id?.toString().toUpperCase() === permissionId?.toString().toUpperCase(),
    );
    return index !== -1;
  }
};

/// random GuidId
export const randomGuid = () => {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
};

/// check valid email
export const isValidEmail = (string) => {
  const emailPattern =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailPattern.test(string)) {
    return false;
  }
  return true;
};

/// check valid phone number
export const isValidPhoneNumber = (string) => {
  const phonePattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  if (!phonePattern.test(string)) {
    return false;
  }
  return true;
};

export const ValidPhonePattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,6}$/im;

/*
  Create combos from groups of array
  Example:
  Group has two array:
  array 1: ["1", "2"]
  array 2: ["4", "5"]
  Result: [ [ '1', '4' ], [ '1', '5' ], [ '2', '4' ], [ '2', '5' ] ]
*/
export const combinationPossible = (groups) => {
  const availableGroups = groups.filter((g) => g && g.length > 0);
  const combos = availableGroups.reduce((a, b) => a.flatMap((x) => b.map((y) => x + "#" + y)), [""]);
  const result = combos.map((combo) => {
    const members = combo.split("#").filter((x) => x !== "");
    return members;
  });

  return result;
};

/*
  ROUND NUMBER
  Params:
  @number: number to round
  @precision: precision of round
*/
export const roundNumber = (number, precision) => {
  if (precision === undefined || precision === null || precision < 1) {
    precision = 1;
  } else {
    precision = Math.pow(10, precision);
  }

  return Math.round(number * precision) / precision;
};

/*
  LOWERCASE FIRST LETTER OF STRING
  Example: "HELLO" => "hELLO"
*/
export const lowercaseFirst = (str) => {
  return str[0].toLowerCase() + str.slice(1);
};

/**
 * Convert API response errors to error object
 * @param {*} errors
 * @returns Object
 */
export const getApiError = (errors) => {
  const errorsData = errors?.map((err) => {
    return {
      name: lowercaseFirst(err.type),
      message: err.message,
    };
  });

  var object = errorsData.reduce((obj, item) => Object.assign(obj, { [item.name]: item.message }), {});

  return object;
};

/*
  MAPPING VALIDATE ERROR
*/
export const getValidationMessages = (errors) => {
  return errors?.map((err) => {
    return {
      name: lowercaseFirst(err.type),
      errors: [t(err.message)],
    };
  });
};

/*
  MAPPING VALIDATE ERROR WITH PARENT FIELD
*/
export const getValidationMessagesWithParentField = (errors, field) => {
  return errors?.map((err) => {
    return {
      name: [field, lowercaseFirst(err.type)],
      errors: [t(err.message)],
    };
  });
};

/**
 * Build Form data from object
 * @param {*} formData
 * @param {*} data
 * @param {*} parentKey
 */
export const buildFormData = (formData, data, parentKey) => {
  if (data && typeof data === "object" && !(data instanceof Date) && !(data instanceof File)) {
    Object.keys(data).forEach((key) => {
      buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
    });
  } else {
    const value = data === null ? "" : data;
    formData.append(parentKey, value);
  }
};

/**
 * Convert json object to form data
 * @param {*} data
 * @returns
 */
export const jsonToFormData = (data) => {
  const formData = new FormData();
  buildFormData(formData, data);
  return formData;
};

//Capitalized Case
export const capitalize = (data) => {
  var result = data.toLowerCase();
  return result[0].toUpperCase() + result.slice(1);
};

export const compareTwoArrays = (array1, array2) => {
  try {
    if (array1?.length > 0 && array2?.length > 0) {
      let array2Sorted = array2?.slice()?.sort();
      let result =
        array1?.length === array2?.length &&
        array1
          ?.slice()
          ?.sort()
          ?.every(function (value, index) {
            return value === array2Sorted[index];
          });
      return result;
    } else {
      return false;
    }
  } catch {
    return false;
  }
};

/**
 * Capitalize the first letter of each word in a string
 * @param {*} string
 * @input "i have learned something new today"
 * @output "I Have Learned Something New Today"
 */
export const capitalizeFirstLetterEachWord = (words) => {
  if (words) {
    var separateWord = words.toLowerCase().split(" ");
    for (var i = 0; i < separateWord.length; i++) {
      separateWord[i] = separateWord[i].charAt(0).toUpperCase() + separateWord[i].substring(1);
    }
    return separateWord.join(" ");
  }
  return "";
};

/**
 * Format file name
 * @param {*} fileName
 * @input "hình- -ảnh"
 * @output "hinh-anh"
 */
export const fileNameNormalize = (fileName) => {
  const parsed = fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/([^\w]+|\s+)/g, "-") // Replace space and other characters by hyphen
    .replace(/\-\-+/g, "-") // Replaces multiple hyphens by one hyphen
    .replace(/(^-+|-+$)/g, ""); // Remove extra hyphens from beginning or end of the string

  return parsed;
};

export const tokenExpired = (token) => {
  const decoded = jwt_decode(token);
  const utcTime = moment.unix(decoded.exp);
  var tokenExpireDate = new Date(utcTime.format("M/DD/YYYY hh:mm:ss A UTC"));
  const currentDate = Date.now();
  var tokenExpired = moment(currentDate).isAfter(tokenExpireDate) ?? false;

  return tokenExpired;
};

export const getPermission = (permissionId) => {
  if (permissionId === "public") return true;
  const { session } = store.getState();
  let allPermissions = session?.permissions ?? [];
  if (allPermissions.length === 0) {
    var storagePermissions = getStorage(localStorageKeys.PERMISSIONS);
    let decodeData = decryptWithAES(storagePermissions);
    if (decodeData) {
      var permissions = JSON.parse(decodeData);
      allPermissions = permissions;
    }
  }

  const index = allPermissions.findIndex((x) => x.id === permissionId);

  return index !== -1 ? allPermissions[index] : null;
};

export const getPermissionGroup = (...permissions) => {
  const { session } = store.getState();
  let allPermissions = session?.permissionGroup ?? [];
  if (allPermissions.length === 0) {
    var storagePermissions = getStorage(localStorageKeys.PERMISSION_GROUP);
    let decodeData = decryptWithAES(storagePermissions);
    if (decodeData) {
      var _permissions = JSON.parse(decodeData);
      allPermissions = _permissions;
    }
  }
  var results = [];
  for (let i = 0; i < permissions.length; i++) {
    const element = permissions[i];
    var permission = getPermission(element);
    let permissionGroupId = permission?.permissionGroupId;
    if (permissionGroupId) {
      const index = allPermissions.findIndex((x) => x.permissionGroupId === permissionGroupId);
      if (index !== -1) {
        results.push(allPermissions[index]);
      }
    }
  }

  return results;
};

export const shortString = (text, length) => {
  if (text === "" || text === null || text === undefined || length < 1) return "";
  if (text.length < length) return text;
  return text.substring(0, length) + "...";
};

export const sortChildRoute = (routes) => {
  let numberIndex = 0;
  for (let i = 0; i < routes.length; i++) {
    const element = routes[i];
    if (element.isMenu === true && hasPermission(element.permission)) {
      var permissionGroup = getPermissionGroup(element.permission);
      if (permissionGroup.every((x) => x.isFullPermission === true)) {
        routes[i].position = 0;
      } else {
        routes[i].position = numberIndex + 1;
      }
      numberIndex++;
    }
  }

  return routes;
};

var lockedAt = 0;
const timeOut = 600;
export const preventMultipleClick = (e, ...funcs) => {
  if (+new Date() - lockedAt > timeOut) {
    funcs.forEach((func) => {
      if (func && {}.toString.call(func) === "[object Function]") {
        func();
      }
    });
  }
  lockedAt = +new Date();
};

/**
 Try to convert string to JSON, if str is not a JSON format => return null. Otherwise return an Object
 Use this function to call JSON.parse(str) once for performance.
 Input: str is a string
 **/
export const tryJsonString = (str) => {
  let jsonData = {};
  try {
    jsonData = JSON.parse(str);
  } catch (e) {
    return null;
  }
  return jsonData;
};

/**
 Check if a string can convert to JSON, if YES return true. Otherwise return false
 Input: str is a string
 **/
export const isJsonString = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

/**
 * Get the value of a given query string parameter.
 */
export const getParamsFromUrl = (url) => {
  const params = new URLSearchParams(url);
  const result = {};
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }

  return result;
};

/**
 * Get Unique Id
 * @returns string (ex: 'ed596b16-debf-4471-b824-79e0d568ef0f')
 */
export const getUniqueId = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
  );
};

// Format time from dd/MM/yyyy: 00:00:00 to dd/MM/yyyy: current time
export const formatOnlyDate = (moment) => {
  var time = new Date();
  moment
    .set("hour", time.getHours())
    .set("minute", time.getMinutes())
    .set("second", time.getSeconds())
    .set("millisecond", time.getMilliseconds());

  return moment;
};

export const getStartDateEndDateInUtc = (startDate, endDate) => {
  let startDateParseMoment = moment(startDate);
  let endDateParseMoment = moment(endDate).add(1, "d").seconds(-1);
  // Parse local time from client to UTC time before comparation
  let fromDate = moment.utc(startDateParseMoment).format(DateFormat.YYYY_MM_DD_HH_MM_SS);
  let toDate = moment.utc(endDateParseMoment).format(DateFormat.YYYY_MM_DD_HH_MM_SS);

  return {
    fromDate,
    toDate,
  };
};

export const getStartDateEndDate = (startDate, endDate) => {
  let startDateParseMoment = moment(startDate);
  let endDateParseMoment = moment(endDate).add(1, "d").seconds(-1);
  // Parse local time from client to UTC time before comparation
  let fromDate = moment(startDateParseMoment).format(DateFormat.YYYY_MM_DD_HH_MM_SS);
  let toDate = moment(endDateParseMoment).format(DateFormat.YYYY_MM_DD_HH_MM_SS);

  return {
    fromDate,
    toDate,
  };
};

/**
 * Format bytes of file size
 * @param {*} bytes the size in bytes to be converted
 * @param {*} decimals
 * @returns
 */
export function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export const handleDownloadFile = ({ fileName, data }) => {
  var a = document.createElement("a");
  var url = window.URL.createObjectURL(data);
  a.href = url;
  a.download = fileName;
  document.body.append(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

/**
 * Convert moment to date time zone
 * @param {*} momentLocalTime moment
 * @returns
 */
export const momentFormatDateTime = (momentLocalTime) => {
  if (momentLocalTime) {
    return momentLocalTime.format();
  } else {
    return null;
  }
};

export const getStartDate = (momentDate) => {
  if (momentDate) {
    return momentFormatDateTime(momentDate?.startOf("day"));
  }

  return null;
};

export const getEndDate = (momentDate) => {
  if (momentDate) {
    return momentFormatDateTime(momentDate?.endOf("day"));
  }

  return null;
};

// eslint-disable-next-line no-extend-native
String.prototype.clone = function (maxlength) {
  if (this) {
    let newStr = this?.toString() + "-copy";

    if (maxlength) {
      //If newStr has more than maxlength characters => only get maxlength characters.
      if (newStr.length > maxlength && maxlength > 0) {
        newStr = newStr.substring(0, maxlength);
      }
    }

    return newStr;
  }

  return "New";
};

// eslint-disable-next-line no-extend-native
String.prototype.removeVietnamese = function () {
  let newStr = this?.toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");

  return newStr;
};

export const isValidHttpUrl = (string) => {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
};

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
  //If min >=0, do not allow enter -
  if (min != null && min >= 0) {
    if (event.key === "-") {
      return false;
    }
  }
  //If do not enter precision. Only allow input number or -
  if (precision != null && precision === 0) {
    if (!/[0-9]/.test(event.key) && event.key !== "-") {
      return false;
    }
  } else {
    if (!/[0-9]/.test(event.key) && event.key !== "." && event.key !== "-") {
      return false;
    }
  }

  //Get current text and check to allow input or not?
  var text = id == null || id === "" ? null : document.getElementById(id).value;
  if (text === null) return true;
  text = text.toString().replace(/,/g, "");

  //Do not allow input . in font of a number
  if (text === "" && event.key === ".") return false;
  //Do not allow input ..
  if (text.indexOf(".") >= 0 && event.key === ".") return false;
  //Do not allow input --
  if (text.indexOf("-") >= 0 && event.key === "-") return false;
  //Do not allow input - in the middle of text
  if (text !== "" && event.key === "-") return false;

  //Check current text in range. If not in range do not allow
  if (document.getElementById(id).selectionStart === undefined || document.getElementById(id).selectionStart === null)
    text = text + event.key;
  else {
    if (document.getElementById(id).selectionEnd > document.getElementById(id).selectionStart) {
      text =
        text.substring(0, document.getElementById(id).selectionStart) +
        event.key +
        text.substring(document.getElementById(id).selectionEnd + 1);
    } else text = text + event.key;
  }

  try {
    if (max !== null && text * 1.0 > max) {
      return false;
    }
    if (min !== null && text * 1.0 < min) {
      return false;
    }
  } catch {}

  return true;
};

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
  //Make sure input data in range after user finish entering a key
  var text = id == null || id === "" ? "" : document.getElementById(id).value;
  if (text === null) return true;
  text = text.toString().replace(",", "");

  try {
    if (max !== null && text * 1.0 > max) return false;
    if (min !== null && text * 1.0 < min) return false;
  } catch {
    return false;
  }

  return true;
};

// This function will check if the number is the decimal
export const checkIfNumberIsAInteger = (numberValue) => {
  if (numberValue) {
    return Number.isInteger(numberValue);
  }

  return false;
};

// If the number is a decimal. This function will format and return the value of the decimal number and the corresponding decimal part
export const getTheNumberValueWithAmountDigitsDecimalIfTheNumberIsADecimal = (
  numberValue,
  amountDigitsDecimalValue = 2,
) => {
  let isInteger = checkIfNumberIsAInteger(numberValue);
  let resultValue = numberValue;
  if (!isInteger) {
    resultValue = (Math.round(numberValue * 100) / 100).toFixed(amountDigitsDecimalValue);
  }

  return resultValue;
};

/**
 * Capitalize uppercase a string
 * @param {*} string
 * @output "I HAVE LEARNED SOMETHING NEW TODAY"
 */
export const capitalizeUpperCaseWord = (words) => {
  if (words) {
    return words.toUpperCase();
  }
  return "";
};

/**
 * @param {*} str : String
 * @param {*} maxlength: maximum characters to display
 * @Param (*) postfix: String
 * @returns: If str has length > maxlength => show only maxlength(str) + postfix instead.
 */
export const StringWithLimitLength = (str, maxlength, postfix) => {
  if (str === undefined || str === null) return "";
  if (maxlength <= 0) return "";
  if (str.length > maxlength) {
    let result = str.substring(0, maxlength);

    while (result !== "" && result.slice(-1) !== " ") result = result.substring(0, result.length - 1);

    return result + postfix;
  }

  return str;
};

/**
 * @param {*} arrayAttributes: List keys get value (ex: ['general', 'generalBackground', 'backgroundType'])
 * @param {*} newObject: object and will get key to compare with key of old object
 * @param {*} oldObject: object will being compare
 */
const compareValue = (arrayAttributes, newObject, oldObject) => {
  return arrayAttributes.every((value) => {
    let valueNew = getValueFromKey(value, newObject);
    let valueOld = getValueFromKey(value, oldObject);
    if (
      /<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>/.test(valueNew) &&
      /<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>/.test(valueOld)
    ) {
      valueNew = valueNew.replace(/(?:\r\n|\r|\n)/g, "");
      valueOld = valueOld.replace(/(?:\r\n|\r|\n)/g, "");
    }
    if (Array.isArray(valueNew) && Array.isArray(valueOld)) {
      valueNew = valueNew.length;
      valueOld = valueOld.length;
    }
    if (valueNew !== undefined && valueNew !== valueOld && valueOld !== undefined) return false;
    else return true;
  });
};

const getValueFromKey = (arrayAttributes, obj) => {
  arrayAttributes.forEach((key) => {
    obj = obj?.[key];
  });
  return obj;
};

let result = [];
const recurse = (object, preKey = [], currentKey = []) => {
  if (object != null && object !== "") {
    var arrayKeys = Object.keys(object);
    if (arrayKeys.length > 0 && typeof object === "object") {
      preKey = [...currentKey];
      arrayKeys.forEach((key) => {
        const childObject = object[key];
        let newKey = preKey.concat(key);
        recurse(childObject, preKey, newKey);
      });
    } else {
      result.push(currentKey);
    }
  } else {
    result.push(currentKey);
  }
};

export const CompareTwoObjs = (newObject, oldObject, currentPage) => {
  const keys1 = Object.keys(newObject);
  let flag = true;
  for (let key of keys1) {
    if (key === "general") {
      result = [];
      if (newObject[key] instanceof Object) {
        recurse(newObject[key]);
        if (result.length > 0) {
          const valueNewGeneral = newObject[key];
          const valueOldGeneral = oldObject[key];
          flag = compareValue(result, valueNewGeneral, valueOldGeneral);
        }
      }
    }
    if (key === "pages" && flag === true) {
      result = [];
      const pageConfigNew = newObject[key].find((x) => x.id === currentPage?.id);
      var indexOfPageNew = newObject[key]?.indexOf(pageConfigNew);

      const pageConfigOld = oldObject[key].find((x) => x.id === currentPage?.id);
      var indexOfPageOld = oldObject[key]?.indexOf(pageConfigOld);

      if (newObject[key][indexOfPageNew] instanceof Object) {
        recurse(newObject[key][indexOfPageNew]);
        if (result.length > 0) {
          const valueNewGeneral = newObject[key][indexOfPageNew];
          const valueOldGeneral = oldObject[key][indexOfPageOld];
          flag = compareValue(result, valueNewGeneral, valueOldGeneral);
        }
      }
    }
  }
  return flag;
};

export const getPathByCurrentURL = () => {
  const currentURL = window.location.pathname;
  if (currentURL.substring(0, OnlineStoreFeaturePath.Preview.length) === OnlineStoreFeaturePath.Preview) {
    const indexEnd = currentURL.indexOf("/", OnlineStoreFeaturePath.Preview.length);
    if (indexEnd !== -1) {
      return currentURL.substring(0, indexEnd);
    }
  }
  return "";
};

export const replaceLastOccurrence = (str, find, replace) => {
  var lastIndex = str?.lastIndexOf(find);
  if (lastIndex) {
    if (lastIndex === -1) {
      return str;
    }
    var before = str.substring(0, lastIndex);
    var after = str.substring(lastIndex + find.length);
    return before + replace + after;
  }
  return str;
};

export const getFilename = (url) => {
  if (url) {
    return url.split("/").pop().split("#")[0].split("?")[0];
  }
  return null;
};

export const getFileExtension = (filename) => {
  var ext = /^.+\.([^.]+)$/.exec(filename);
  return ext == null ? "" : ext[1];
};

export const getThumbnailUrl = (url, device = "web" | "mobile") => {
  const fileName = getFilename(url);
  const fileExtension = getFileExtension(fileName);
  if (
    fileName &&
    fileExtension &&
    fileExtension !== "gif" &&
    fileExtension !== "webp" &&
    fileExtension !== "ico" &&
    fileExtension !== "svg"
  ) {
    return replaceLastOccurrence(url, ".", `.thumb.${device}.`);
  }
  return url;
};

export const getKeyByValue = (object, value) => {
  return Object.keys(object).find((key) => object[key] === value);
};

export const replaceParameter = (originalString, parameter) => {
  if (!originalString || !parameter) return originalString;

  // Replace the parameter value with the actual value
  const replacedString = originalString.replace(/{{(.*?)}}/g, (match, key) => parameter[key] ?? match);

  return replacedString;
};

export const convertTextToBarcodeBase64 = (text, option = {}) => {
  const canvas = document.createElement("canvas");
  JsBarcode(canvas, text, option);
  return canvas.toDataURL();
};

export const convertTextToQRCodeBase64Async = async (text, option = {}) => {
  return await QRCode.toDataURL(text, option);
};

export const convertSeoUrl = (url) => {
  return url
    .toString() // Convert to string
    .normalize("NFD") // Change diacritics
    .replace(/[\u0300-\u036f]/g, "") // Remove illegal characters
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase() // Change to lowercase
    .replace(/\s+/g, "+") // Change whitespace to dashes
    .replace(/&/g, "-and-") // Replace ampersand
    .replace(/[^a-z0-9\+]/g, "") // Remove anything that is not a letter, number or dash
    .replace(/-+/g, "-") // Remove duplicate dashes
    .replace(/^-*/, "") // Remove starting dashes
    .replace(/-*$/, "") // Remove trailing dashes
    .replace(/\+/g, "-"); // Replace plus signs with dashes
};

export const convertSeoUrlToText = (urlSeo) => {
  if (!urlSeo) return;
  return urlSeo?.replace(/\+/g, " ");
};

export const getUrlQrCode = (acpId, accountNumber) => {
  if (acpId && accountNumber) {
    return `https://api.vietqr.io/image/${acpId}-${accountNumber}-${TEMPLATE_ID}.jpg?amount=0`;
  } else return "";
};

export const formatterDecimalNumber = (val, defaultNull = false) => {
  if (!val) return defaultNull ? null : 0;
  return `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",").replace(/\.(?=\d{0,2}$)/g, ".");
};

export const parserDecimalNumber = (val, defaultNull = false) => {
  if (!val) return defaultNull ? null : 0;
  return Number.parseFloat(val.replace(/\$\s?|(\,*)/g, "").replace(/(\,{1})/g, ",")).toFixed(2);
};

export const isDecimalKey = (val) => {
  var charCode = val.which ? val.which : val.keyCode;
  if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) return false;

  return true;
};

export const isDecimalNumber = (value) => {
  // check value is number
  if (isNaN(value)) {
    return false;
  }

  // check value is decimal
  const parsedValue = parseFloat(value);
  return parsedValue % 1 !== 0;
};

export const getColorForChart = (hue, saturation, lightness, count) => {
  const listColor = [];
  count = count || 1;
  const alpha = 1 / count;
  for (let i = 0; i < count; i++) {
    let hsla = `hsla(` + hue + `, ` + saturation + `%, ` + lightness + `%, ` + (1 - i * alpha) + ` )`;
    listColor.push(hsla);
  }
  return listColor;
};
