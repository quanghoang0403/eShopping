import { message } from "antd";
import axios from "axios";
import { logService } from "services/log/log.service";
import { resetSession } from "store/modules/session/session.actions";
import { env, ENVIRONMENT } from "../env";
import { store } from "../store";
import { startDataServiceProcessing, stopDataServiceProcessing } from "../store/modules/processing/processing.actions";
import { tokenExpired } from "./helpers";
import { getStorage, localStorageKeys } from "./localStorage.helpers";

const logType = {
  normal: "",
  success: "SUCCESS",
  error: "ERROR",
};

const date = new Date();
const timezoneOffset = date.getTimezoneOffset();
const options = { prefix: "DATA_SERVICE", color: "green", enableLog: false };
const http = axios.create({
  baseURL: `${env.REACT_APP_ROOT_DOMAIN}/api`,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "X-TIMEZONE-OFFSET": timezoneOffset,
  },
  timeout: 30000,
});

http.interceptors.request.use(
  async (config) => {
    //#region AI logging
    _handleAILogging(config, logType.normal, "");
    //#endregion

    store.dispatch(startDataServiceProcessing());
    if (config.withCredentials) {
      const token = _getToken();
      if (token) {
        const expired = tokenExpired(token);
        if (expired === true) {
          _redirectToLoginPage();
          return;
        }

        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    const usedTimePreviousAction = getStorage(localStorageKeys.USED_TIME);
    if (usedTimePreviousAction) {
      config.headers["used-time"] = usedTimePreviousAction;
    }

    return config;
  },
  (error) => {
    //#region AI logging
    const { config } = error?.response;
    _handleAILogging(config, logType.error, error);
    //#endregion

    return Promise.reject(error);
  },
);

http.interceptors.response.use(
  async (response) => {
    //#region AI logging
    const { config } = response;
    _handleAILogging(config, logType.success, response);
    //#endregion

    _httpLogging(response?.data);

    store.dispatch(stopDataServiceProcessing());

    if (config?.responseType === "blob") {
      return response;
    }

    if (response.status === 200) {
      return response?.data;
    }

    return response;
  },
  (error) => {
    //#region AI logging
    if (error && error.response) {
      const { config } = error?.response;
      _handleAILogging(config, logType.error, error);
    }
    //#endregion

    _httpLogging(error?.response);

    store.dispatch(stopDataServiceProcessing());

    const responseTokenExpired = error?.response?.headers["token-expired"];
    if (responseTokenExpired && responseTokenExpired === "true") {
      store.dispatch(resetSession());
      window.location.href = "/login";
      return Promise.reject(error?.response);
    }

    const token = _getToken();
    /// User has token and receive 401 => restricted page
    if (token && error?.response?.status === 401) {
      var isExpired = tokenExpired(token);
      if (isExpired === true) {
        _redirectToLoginPage();
      } else {
        window.location.href = "/page-not-permitted";
      }
    }

    /// If error is 401 and has not token redirect to login page
    if (!token && error?.response?.status === 401) {
      _redirectToLoginPage();
    }

    if (error?.response?.status === 403) {
      window.location.href = "/page-not-permitted";
    }

    if (error?.response?.status === 404) {
      _redirectToNotFoundPage();
    }

    if (error && error.response && error.response.data.errors && error.response.data.errors.length > 0) {
      const { errors } = error.response.data;
      return Promise.reject(errors);
    }

    const errorMessage = error?.response?.data?.message;
    if (errorMessage) {
      message.error(errorMessage);
    }

    return Promise.reject(error?.response);
  },
);

export const downloadAsync = async (url, onProgressCallback) => {
  var response = await http.get(url, {
    responseType: "blob",
    onDownloadProgress: (progressEvent) => {
      const progress = (progressEvent.loaded / progressEvent.total) * 100;
      onProgressCallback(progress);
    },
  });

  const _getFileName = (response) => {
    const { headers } = response;
    var filename = "";
    var disposition = headers["content-disposition"];
    if (disposition && disposition.indexOf("attachment") !== -1) {
      var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      var matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, "");
      }
    }
    return filename;
  };
  const { data } = response;
  const file = {
    fileName: _getFileName(response),
    data: data,
  };

  return file;
};

//#region Private methods

const _getToken = () => {
  let token = getStorage(localStorageKeys.TOKEN);
  return token;
};

/// Clear session and redirect to login page
const _redirectToLoginPage = () => {
  store.dispatch(resetSession());
  window.location.href = "/login";
};

///  redirect to NotFound page
const _redirectToNotFoundPage = () => {
  window.location.href = "/pageNotFound";
};

const _httpLogging = (data) => {
  if (env.NODE_ENV === ENVIRONMENT.Development) {
    console.log("%cresponse >>", "color: #349f01", data);
  }
};

const _handleAILogging = (httpConfig, logType, data) => {
  const { method, url } = httpConfig;
  const logName = `${method.toUpperCase()} ${url} >>> ${logType}: `;
  const jsonData = JSON.stringify(data);
  switch (logType) {
    case logType.error:
      logService.trackException(logName, jsonData, options);
      break;
    default:
      logService.trackTrace(logName, jsonData, options);
      break;
  }
};

//#endregion

export default http;
