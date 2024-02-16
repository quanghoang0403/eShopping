import { firebase } from "../../providers/firebase.provider";
import { getStorage, localStorageKeys } from "../../utils/localStorage.helpers";
import logService from "../log/log.service";

export const signInWithPhoneNumber = (phoneNumber, callback) => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-login", {
      size: "invisible",
    });
  }
  try {
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        callback && callback({ success: true });
      })
      .catch((err) => {
        console.log("err", err);
        callback && callback({ success: false, message: err.message });
      });
  } catch (err) {
    console.log("err", err);
    callback && callback({ success: false, message: err.message });
  }
};

export const confirmSMSVerificationCode = (verifyCode, callback) => {
  if (window.confirmationResult) {
    window.confirmationResult
      ?.confirm(verifyCode)
      .then((result) => {
        callback && callback({ success: true, data: result });
      })
      .catch((err) => {
        callback && callback({ success: false, message: err.message });
      });
  }
};

export const writeFirebaseLog = (message) => {
  const jsonConfig = getStorage(localStorageKeys.STORE_CONFIG);
  const storeConfig = JSON.parse(jsonConfig);
  const logInfo = { storeID: storeConfig?.storeId, message: message };
  logService.trackTrace("[OTP LOG] " + JSON.stringify(logInfo));
};