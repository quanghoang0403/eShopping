import { t } from "i18next";
import moment from "moment";
import { ScrollHeaderType } from "../constants/enums";
import { HyperlinkType } from "../constants/hyperlink-type.constants";
import { CURRENCY_CODE } from "../constants/string.constants";
import { backgroundTypeEnum } from "../theme-2-new/constants/store-web-page.constants";
import { localStorageKeys } from "./localStorage.helpers";

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
export const formatTextNumber = (number) => {
  if (isNaN(number) || number === null) {
    return "0";
  }
  return `${number}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "";
};

export const formatNumberWithCommas = (number) => {
  if (isNaN(number) || number === null) {
    return "0";
  }
  return `${number}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "";
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

/*
Check onKeyPress event and check input key.
If YES: allow key input
IF NO: deny key input
Parameter:
id: is the ID of the InputText
event: the event of the input
min: minimum number
max: maximum number
precision: number of precision allow
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

export const roundNumberBaseCurrency = (number, currencyAlias) => {
  switch (currencyAlias) {
    case "VND":
      return roundNumber(number, 0);
    default:
      return roundNumber(number, 2);
  }
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

export const GetObjectByPath = (path, obj, split) => {
  if (path === undefined || path === null || path === "") return undefined;
  if (obj === undefined || obj === null || obj === "") return undefined;
  if (split === undefined || split === null || split === "") return undefined;
  return path.split(split).reduce((acc, c) => acc && acc[c], obj);
};

export const validateThemePage = (config, pageID) => {
  if (!config) return true;
  if (!config.pages || config.pages.length === 0) return true;
  const pageConfig = config.pages.find((p) => p.id === pageID);
  if (!pageConfig || pageConfig === {}) return true;
  if (!pageConfig.config || pageConfig.config === {}) return true;

  //Choose Image but not upload any images.
  if (pageConfig.config?.header?.backgroundType === 2) {
    const isImageHasValue =
      Boolean(pageConfig.config?.header?.backgroundImage) || Boolean(pageConfig.config?.header?.backgroundImageUrl);

    if (!isImageHasValue) return false;
  }

  //Check for Productlist page.
  if (pageConfig.config?.productsProductList?.backgroundType === 2) {
    const checkHasImage = !(
      !pageConfig.config?.productsProductList?.backgroundImage &&
      !pageConfig.config?.productsProductList?.backgroundImageUrl
    );
    if (!checkHasImage) return false;
  }

  //Check for bestSellingProduct.
  if (pageConfig.config?.bestSellingProduct?.generalCustomization?.backgroundType === 2) {
    const checkHasImage = !(
      !pageConfig.config?.bestSellingProduct?.generalCustomization?.backgroundImage &&
      !pageConfig.config?.bestSellingProduct?.generalCustomization?.backgroundImageUrl
    );
    if (!checkHasImage) return false;
  }

  //Check for signatureProduct
  if (pageConfig.config?.signatureProduct !== undefined && pageConfig.config?.signatureProduct !== null) {
    const checkValidData = !pageConfig.config?.signatureProduct?.signatureProducts?.some(
      (s) => !s.nameCategory || !s.textArea || !s.buttonText,
    );
    if (!checkValidData) return false;
  }

  //Check for category URL
  if (pageConfig.config?.category !== undefined && pageConfig.config?.category !== null) {
    const checkValidURL = !pageConfig.config?.category?.categoryList?.some(
      (c) => c.hyperlinkType === 6 && !isValidHttpUrl(c.hyperlinkValue),
    );
    if (!checkValidURL) return false;
  }

  //Check for checkout page.
  if (pageConfig.config?.checkout?.backgroundType === 2) {
    const checkHasImage = !(
      !pageConfig.config?.checkout?.backgroundImage && !pageConfig.config?.checkout?.backgroundImageUrl
    );
    if (!checkHasImage) return false;
  }

  //Check for checkout page relatedProducts
  if (pageConfig.config?.relatedProducts?.backgroundType === 2) {
    const checkHasImage = !(
      !pageConfig.config?.relatedProducts?.backgroundImage && !pageConfig.config?.relatedProducts?.backgroundImageUrl
    );
    if (!checkHasImage) return false;
  }

  //Check for my profile page
  if (pageConfig.config?.backgroundType === 2) {
    const checkHasImage = pageConfig.config?.backgroundImage;
    if (!checkHasImage) return false;
  }

  //Check for banner when has hyperlink required
  if (!checkHyperlinkBannerValidation(pageConfig?.config?.banner?.bannerList)) {
    return false;
  }

  // Check validate Upload QR code
  if (config.general?.footer?.downloadApp?.qrCode == true) {
    if (
      config.general?.footer?.downloadApp?.qrCodeImage == null ||
      config.general?.footer?.downloadApp?.qrCodeImage == undefined ||
      config.general?.footer?.downloadApp?.qrCodeImage == ""
    ) {
      window.isNotSelectQRCodeImage = true;
      return false;
    }
  }

  // Check validate Upload Image Blog
  if (pageConfig.config?.blogList?.backgroundType == 2) {
    if (
      pageConfig.config?.blogList?.backgroundImage == null ||
      pageConfig.config?.blogList?.backgroundImage == undefined ||
      pageConfig.config?.blogList?.backgroundImage == ""
    ) {
      window.isNotBackgroundImageBlogListBlog = true;
      return false;
    }
  }

  // Check validate Upload Image Blog Header
  if (pageConfig.config?.header?.backgroundType == 2) {
    if (
      pageConfig.config?.header?.backgroundImage == null ||
      pageConfig.config?.header?.backgroundImage == undefined ||
      pageConfig.config?.header?.backgroundImage == ""
    ) {
      window.isNotBackgroundImageBlogListHeader = true;
      return false;
    }
  }

  // Check validate Advertisement Component - Background Image
  if (pageConfig.config?.advertisement?.generalCustomization?.backgroundType == 2) {
    if (pageConfig.config?.advertisement?.generalCustomization?.backgroundImage == null) {
      window.isNotSelectAdvertisementBackground = true;
      return false;
    }
  }

  // Check validate image promotion section
  if (pageConfig.config?.promotionSection?.generalCustomization?.backgroundType === 2) {
    const checkHasImage = !(
      !pageConfig.config?.promotionSection?.generalCustomization?.backgroundImage &&
      !pageConfig.config?.promotionSection?.generalCustomization?.backgroundImageDiscountSection
    );
    if (!checkHasImage) {
      window.isNotBackgroundPromotion = true;
      return false;
    }
  }

  return true;
};

export const isValidHttpUrl = (url) => {
  if (!url) return false;
  if (url === "#") return true;
  const checkURL = url.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
  );
  return checkURL !== null;
};

//This function is used to compare 2 color HEX
export const CompareColor = (c1, c2) => {
  if (!c1 && !c2) return true;

  if (!c1 || !c2) return false;

  return c1.replace(/ /g, "") === c2.replace(/ /g, "");
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

export const OnlineStoreFeaturePath = {
  Preview: "/theme-preview/",
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

/// Format date
export const formatDate = (date, format) => {
  if (format) {
    return moment.utc(date).local().format(format);
  }
  return moment.utc(date).local().format("DD/MM/YYYY");
};

export const formatDateBlogs = (date, string, lang) => {
  if (lang == "vi") {
    const day = moment.utc(date).local().format("D");
    const month = moment.utc(date).local().format("M");
    const year = moment.utc(date).local().format("YYYY");
    return day + " " + string + " " + month + ", " + year;
  } else {
    return moment.utc(date).local("vi").format("Do MMMM, YYYY");
  }
};

/**
 * firstNumber has been reduced how much of the above on secondNumber
 */
export const calculatePercentage = (firstNumber, secondNumber) => {
  if (firstNumber === 0) {
    return "100%";
  }
  if (firstNumber >= secondNumber) {
    return "0%";
  }
  return formatTextNumber(roundNumber(((secondNumber - firstNumber) / secondNumber) * 100, 0)) + "%";
};

export const calculatePercentageFlashSale = (firstNumber, secondNumber) => {
  if (firstNumber === 0) {
    return "100%";
  }
  if (firstNumber >= secondNumber) {
    return "0%";
  }
  return formatTextNumber(roundNumber(((secondNumber - firstNumber) / secondNumber) * 100, 1)) + "%";
};

export const getStoreConfig = () => {
  const jsonConfig = localStorage.getItem(localStorageKeys.STORE_CONFIG);
  const storeConfig = JSON.parse(jsonConfig);

  return storeConfig;
};

export const addMinutes = (date, minutes) => {
  date.setMinutes(date.getMinutes() + minutes);
  return date;
};

export const padTo2Digits = (num) => {
  return num.toString().padStart(2, "0");
};

export const padTo9Digits = (num) => {
  return num.toString().padStart(9, "0");
};

export const convertMsToTime = (milliseconds) => {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;
  hours = hours % 24;

  return `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
};

export const getLabelPromotion = (
  isFlashSale,
  isDiscountPercent,
  discountValue,
  isHasPromotion,
  originalPrice,
  sellingPrice,
  currencySymbol = "đ",
  hasMinus = true,
) => {
  if (isHasPromotion && !isFlashSale) {
    if (isDiscountPercent) {
      return (hasMinus ? "-" : "") + formatTextNumber(discountValue) + "%";
    } else {
      return (hasMinus ? "-" : "") + formatTextNumber(discountValue) + currencySymbol;
    }
  } else {
    if (originalPrice >= sellingPrice) {
      return (hasMinus ? "-" : "") + calculatePercentage(sellingPrice, originalPrice);
    } else {
      return null;
    }
  }
};

/// Format date time
export const formatDateTime = (dateTime, format) => {
  if (format) {
    return moment.utc(dateTime).local().format(format);
  }

  return moment.utc(dateTime).local().format();
};

//remove Vietnamese
String.prototype.removeVietnamese = function () {
  let newStr = this?.toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
  return newStr;
};

/// Check object is empty like {}
export const isEmptyObject = (obj) => {
  for (var prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }

  return JSON.stringify(obj) === JSON.stringify({});
};

export const handleHyperlinkValue = (hyperlinkType, hyperlinkValue) => {
  switch (hyperlinkType) {
    case HyperlinkType.HOME_PAGE:
      return "/home";
    case HyperlinkType.PRODUCTS:
      return "/product-list";
    case HyperlinkType.CONTACT:
      return "/contact";
    case HyperlinkType.ABOUT_US:
      return "/about-us";
    case HyperlinkType.BLOGS:
      return "/blog";
    case HyperlinkType.URL:
      return hyperlinkValue;
    case HyperlinkType.CATEGORY:
      return `/product-list/${hyperlinkValue}`;
    case HyperlinkType.PRODUCT_DETAIL:
      return `/product-detail/${hyperlinkValue}`;
    case HyperlinkType.MY_PAGES:
      return `/page/${hyperlinkValue}`;
    case HyperlinkType.BLOG_DETAIL:
      return `/blog/${hyperlinkValue}`;
    default:
      break;
  }
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

export const executeAfter = (ms, callback) => {
  clearTimeout(window.searchTimeout);
  return new Promise((resolve) => {
    window.searchTimeout = setTimeout(() => {
      callback();
      resolve();
    }, ms);
  });
};

export function truncateText(text, textLength) {
  let truncated = text.length > 50 ? text.substring(0, 50) + "..." : text;
  if (textLength) {
    truncated = text.length > textLength ? text.substring(0, textLength) + "..." : text;
  }
  return truncated;
}

export const formatTimeStringToLocal = (timeString, format) => {
  if (!timeString) return;
  const timezoneOffset = moment().utcOffset();
  return moment.utc(timeString, format).local().utcOffset(timezoneOffset).format(format);
};

export const checkHyperlinkBannerValidation = (bannerList) => {
  let isValid = true;
  if (bannerList?.length > 0) {
    for (let i = 0; i < bannerList?.length; i++) {
      if (
        bannerList[i]?.hyperlinkType === HyperlinkType.URL ||
        bannerList[i]?.hyperlinkType === HyperlinkType.CATEGORY ||
        bannerList[i]?.hyperlinkType === HyperlinkType.PRODUCT_DETAIL
      ) {
        if (bannerList[i]?.hyperlinkValue === null || bannerList[i]?.hyperlinkValue === undefined) {
          isValid = false;
          break;
        }
      }
    }
  }
  return isValid;
};

export const getStyleConfigCustomize = (data, imageDefault) => {
  const backgroundColorImageDefault = "/images/default-theme/background-default-blog-theme-2.png";
  let style = {};
  if (data?.backgroundType) {
    if (data?.backgroundType === backgroundTypeEnum.Color) {
      style = {
        backgroundColor: data?.backgroundColor,
      };
    } else {
      style = {
        backgroundImage: `url(${data?.backgroundImage ?? backgroundColorImageDefault})`,
        backgroundRepeat: `no-repeat`,
        backgroundPosition: `center`,
        backgroundSize: `cover`,
      };
    }
  } else {
    if (data?.backgroundColor) {
      style = { backgroundColor: data?.backgroundColor };
    } else {
      style = {
        backgroundImage: `url(${data?.backgroundImage ?? backgroundColorImageDefault})`,
        backgroundRepeat: `no-repeat`,
        backgroundPosition: `center`,
        backgroundSize: `cover`,
      };
    }
  }

  return style;
};

export const queryParamsUrl = (params) => {
  if (!params) return;
  const newParams = { ...params };
  let queryParams = "";
  for (const key in newParams) {
    if (queryParams !== "") {
      queryParams += "&";
    }
    queryParams += key + "=" + encodeURIComponent(newParams[key]);
  }
  return queryParams;
};

export function formatCreatedTime(inputDate, languageSession) {
  const countryCode = languageSession?.default?.countryCode;
  const formattedDate = moment(inputDate).format(countryCode === "VN" ? "DD [tháng] MM, YYYY" : "DD MMMM, YYYY");

  return formattedDate;
}

/**
 *
 * @param {*} data
 * @returns True: The array is not empty. False: The array is empty or not array.
 */
export const checkNonEmptyArray = (data) => {
  return Array.isArray(data) && data?.length > 0;
};

export function addEventClickAndStretchToScroll(elementId) {
  const container = document.getElementById(elementId);
  let isDown = false;
  let startX;
  let scrollLeft;

  container.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });
  document.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = x - startX; // Adjust the scroll speed here
    container.scrollLeft = scrollLeft - walk;
  });

  document.addEventListener("mouseup", () => {
    isDown = false;
  });
}
/**
 *
 * @param {*} element
 * @returns True: is being seen on the screen.
 */
export const isVisible = (element) => {
  const rectInView = element.getBoundingClientRect();
  const offsetBottom = 0;
  const offsetTop = 0;
  const useHeight = window.innerHeight;
  const hitbox_top = useHeight;
  const element_top = rectInView.top;
  const element_bottom = rectInView.top + useHeight;
  return hitbox_top < element_bottom + offsetBottom && hitbox_top > element_top - offsetTop;
};

export const throttle = (callback = () => {}, limit = 300) => {
  let tick = false;
  return () => {
    if (!tick) {
      callback();
      tick = true;
      setTimeout(function () {
        tick = false;
      }, limit);
    }
  };
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

export const isValidGuid = (str) => {
  // Regex to check valid
  // GUID
  let regex = new RegExp(/^[{]?[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}[}]?$/);

  // if str
  // is empty return false
  if (str === null) {
    return false;
  }

  // Return true if the str
  // matched the ReGex
  if (regex.test(str) === true) {
    return true;
  } else {
    return false;
  }
};

export function colorToRgba(color, alpha = 0.9) {
  if (!color || typeof color !== "string") return;
  // Xử lý các trường hợp màu HEX (#RRGGBB), RGB và tên màu
  if (color.startsWith("#")) {
    // Trường hợp HEX
    const hexColor = color.replace("#", "");
    const r = parseInt(hexColor.slice(0, 2), 16);
    const g = parseInt(hexColor.slice(2, 4), 16);
    const b = parseInt(hexColor.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } else if (color.startsWith("rgb")) {
    // Trường hợp RGB hoặc RGBA
    const rgbaColor = color.replace(/[^\d,.]/g, "").split(",");
    if (rgbaColor.length === 3) {
      rgbaColor.push(alpha);
    } else if (rgbaColor.length !== 4) {
      return null; // Xử lý trường hợp không hợp lệ
    }
    // Giảm giá trị alpha đi 0.5 (nếu là RGBA)
    if (rgbaColor.length === 4) {
      rgbaColor[3] = Math.max(rgbaColor[3] - alpha, 0);
    }
    return `rgba(${rgbaColor.join(", ")})`;
  } else {
    // Trường hợp tên màu
    const div = document.createElement("div");
    div.style.color = color;
    document.body.appendChild(div);
    const computedColor = getComputedStyle(div).color;
    document.body.removeChild(div);
    return computedColor.replace("rgb", "rgba").replace(")", `, ${alpha})`);
  }
}

/**
 *
 * @param {*} number
 * @returns Text currency has been rounded according to the country.
 *
 * Example:
 *
 * In Vietnam(currencyCode = "VND"), the currency symbol is "đ": number = 100000.011 then return 100,000đ
 *
 * Other countries, the currency symbol is <currencySymbol>: number = 100000.011 then return 100,000.01<currencySymbol>
 */
export const formatTextCurrency = (number) => {
  const storeConfig = getStoreConfig();
  const { currencyCode = "VND", currencySymbol = "đ" } = storeConfig;

  if (isNaN(number) || number === null) {
    return "0" + currencySymbol;
  }

  let roundedNumber = 0;
  switch (currencyCode) {
    case CURRENCY_CODE.VND:
      roundedNumber = roundNumber(number, 0);
      break;

    default:
      roundedNumber = roundNumber(number, 2);
      break;
  }

  return `${roundedNumber}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + currencySymbol;
};

export function handleScrollBackToTop(prevScrollPos, currentScrollPos) {
  if (prevScrollPos > currentScrollPos) {
    const backToTopButtonElement = document.querySelector("#back2Top");
    if (backToTopButtonElement) {
      backToTopButtonElement.classList.add("d-none");
    }
  } else {
    const backToTopButtonElement = document.querySelector("#back2Top");
    if (backToTopButtonElement) {
      backToTopButtonElement.classList.remove("d-none");
    }
  }
  if (currentScrollPos <= 150 || prevScrollPos <= 150) {
    const backToTopButtonElement = document.querySelector("#back2Top");
    if (backToTopButtonElement) {
      backToTopButtonElement.classList.add("d-none");
    }
  }
}

export function handleScrollHeaderTheme2(headerConfiguration, prevScrollPos, currentScrollPos) {
  if (headerConfiguration?.scrollType === ScrollHeaderType.FIXED) return;
  if (prevScrollPos > currentScrollPos) {
    document.getElementById("header-theme2").style.top = "0";
  } else {
    document.getElementById("header-theme2").style.top = "-100px";
  }
  if (currentScrollPos <= 0 || prevScrollPos <= 0) {
    document.getElementById("header-theme2").style.top = "0";
  }
}

export function handleScrollNavProductListTheme2(headerConfiguration, prevScrollPos, currentScrollPos) {
  let idnav = document.getElementById("nav-category-sticky");
  let headerWeb = document.getElementById("header-theme2");
  if (headerConfiguration?.scrollType === ScrollHeaderType.FIXED || prevScrollPos > currentScrollPos) {
    headerWeb.style.top = 0;
    if (idnav) {
      idnav.style.top = `${headerWeb.clientHeight}px`;
    }
  } else {
    headerWeb.style.top = "-100px";
    if (idnav) {
      idnav.style.top = "0";
    }
  }
  if (currentScrollPos <= 0 || prevScrollPos <= 0) {
    headerWeb.style.top = "0";
  }
}
// Format time to HH:mm MM/dd/yyyy
// Examples: 2023-11-14T18:00:00 --> 18:00 14/11/2023
export const generateArrivalTime = (arrivalTime) => {
  try {
    const dateTimeArrival = new Date(arrivalTime);
    const hour = dateTimeArrival?.getHours();
    const mininute = dateTimeArrival?.getMinutes();
    // Ensure that hours and minutes always have two digits.
    return `${hour > 10 ? hour : `0${hour}`}:${mininute > 10 ? mininute : `0${mininute}`} ${formatDate(
      dateTimeArrival,
    )}`;
  } catch {
    return "";
  }
};

export function mappingDiscountApplyToPromotionPopupData(promotions) {
  if (!promotions || !Array.isArray(promotions)) return;
  let promotionPopupData = [];
  if (checkNonEmptyArray(promotions)) {
    let discountObject = {
      name: t("checkOutPage.discount", "Discount"),
    };
    const discountDetails = promotions?.map((item) => {
      return {
        name: item?.name,
        value: formatTextNumber(-item?.discountValue) + "đ",
      };
    });
    discountObject.details = discountDetails;
    promotionPopupData.push(discountObject);
  }
  return promotionPopupData;
}

export function convertLocalTime(localTime, date) {
  if (!localTime || !date) {
    return null;
  }
  var dateTime = moment(date + " " + localTime, "YYYY/MM/DD HH:mm");
  return new Date(dateTime);
}

export function areArraysEqual(arr1, arr2) {
  if (arr1 === null || arr2 === null) {
    return false;
  }
  return arr1?.length === arr2?.length && arr1.every((value, index) => value === arr2[index]);
}

export const depauseMethod = (methodName, timeout, callBack) => {
  if (window[methodName]) {
    clearTimeout(window[methodName]);
  }
  window[methodName] = setTimeout(() => {
    if (callBack) {
      callBack();
    }
  }, timeout);
};
