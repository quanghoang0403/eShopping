import { message } from "antd";
import axios from "axios";
import { PLATFORM_ID } from "../constants/config.constants";
import { getStorage, localStorageKeys } from "./localStorage.helpers";

export const createHttp = () => {
  const jsonConfig = getStorage(localStorageKeys.STORE_CONFIG);
  const storeConfig = JSON.parse(jsonConfig);
  var date = new Date();
  var timezoneOffset = date.getTimezoneOffset();

  const http = axios.create({
    baseURL: storeConfig?.apiUrl,
    withCredentials: true,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "X-STORE-ID": storeConfig?.storeId,
      "X-TIMEZONE-OFFSET": timezoneOffset,
      "platform-id": PLATFORM_ID,
    },
    timeout: 300000,
  });

  const _getToken = () => {
    let token = getStorage(localStorageKeys.TOKEN);
    return token;
  };

  // http.interceptors.request.use(
  //   async (config) => {
  //     const token = storeConfig?.token ?? _getToken();
  //     if (token) {
  //       config.headers.Authorization = `Bearer ${token}`;
  //     }

  //     return config;
  //   },
  //   (error) => {
  //     //#region AI logging
  //     return Promise.reject(error);
  //   }
  // );

  http.interceptors.response.use(
    async (response) => {
      return response;
    },
    (error) => {
      if (error?.response?.status === HttpStatusCode.BadRequest) {
        return error?.response;
      } else {
        const errorMessage = error?.response?.data?.message;
        if (errorMessage) {
          message.error(errorMessage);
        }
        return Promise.reject(error?.response);
      }
    }
  );
  return http;
};

export const HttpStatusCode = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
};
