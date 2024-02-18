export const DateFormat = {
  DD_MM_YYYY: "DD/MM/YYYY",
  YYYY_MM_DD: "YYYY/MM/DD",
  YYYY_MM_DD_2: "YYYY-MM-DD",
  MM_DD_YYYY: "MM/DD/YYYY",
  HH_MM_DD_MM_YYYY: "hh:mm A DD/MM/yyyy",
  DD_MM_YYYY_HH_MM_SS: "DD/MM/YYYY, hh:mm:ss",
  DD_MM_YYYY_DASH: "DD-MM-YYYY",
  DDMMYYYYHHmmss: "DDMMYYYYHHmmss",
  YYYY_MM_DD_HH_MM_SS: "yyyy-MM-DD HH:mm:ss",
  HH_MM: "HH:mm",
  HH_MM_2: "HH:MM",
  HH_MM_DD_MM_YYYY_: "HH:mm DD/MM/yyyy",
  YYYY_MM_DD_HH_MM: "yyyy-MM-DD HH:mm",
  DD_MM_YYYY_HH_MM: "DD/MM/YYYY hh:mm",
  DD_MM_YYYY_HH_MM_2: "DD/MM/YYYY, HH:mm",
  DD_MM_YYYY_HH_MM_SS_: "DD/MM/YYYY HH:mm:ss",
  DD_MMMM_YYYY_HH_mm_ss: "DD MMMM YYYY HH:mm:ss",
  lll: "lll", // Jun 1, 2023 1:39 PM
  ll: "ll", // Jun 6, 2023
  DD_MMMM_YYYY_HH_mm_ss_2: "DD MMMM YYYY, HH:mm:ss",
  MMM_DO_YYYY_HH_mm_ss: "MMM Do YYYY, HH:mm:ss",
  YYYY_MM_DDTHH_mm_ss_SSSZ: "YYYY-MM-DDTHH:mm:ss.SSSZ",
};

export const ValidTimeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

export const DefaultConstants = {
  ADMIN_ACCOUNT: "ADMIN",
};

export const currency = {
  vnd: "VND",
  d: "đ",
};

export const DefaultCountryISO = {
  vn: "VN",
};

export const TrackingSteps = {
  error: "error",
  process: "process",
};

export const tableSettings = {
  page: 1,
  pageSize: 20,
};

export const Percent = "%";

export const ClassicMember = "Classic Member";

export const NoDataFound = "No Data Found";

export const EnDash = "-";

export const RevenueMaxValue = 1000000;

export const maximumTotalAmountSpent = 999999999;

export const OrderMaxValue = 10;

export const ImageSizeDefault = 5242880;

export const StoreLogoSizeLimit = 10485760;

export const AllowedNumberOfPhotosDefault = 1;

export const contentArticleEmailCampaign = {
  mainArticle: 0,
  firstSubArticle: 1,
  secondSubArticle: 2,
};

export const guidIdEmptyValue = "00000000-0000-0000-0000-000000000000";

export const theValueLastDayOfTheWeekend = 7;

// This pattern allows enter space at the before and after of the email string
export const emailPattern = /^\s*[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}\s*$/;

export const profileTabTheme1 = {
  accountInformation: 1,
  orders: 2,
  addressList: 3,
  logout: 4,
  loyaltyPoint: 5,
  myReservations: 6,
  loginOrRegister: 7,
};

export const maxNumberCart = 99;

export const ThemeKey = "921016fe-d34e-4192-beb8-15d775d0ee5b";

export const PHONE_NUMBER_REGEX = /^[0-9]{9,12}\s*?$/;

export const BAR_CODE_TYPE = {
  CODE_39: "code39",
  CODE_128: "code128",
};

export const DateView = {
  YEAR: "year",
  DECADE: "decade",
};

export const intervalTime = 15;
