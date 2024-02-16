import { CRYPTOJS_AES_ENCRYPT_KEY } from "constants/application.constants";

const CryptoJS = require("crypto-js");

// Using AES algorithm
/**
 * Encrypt function
 * @param {string} originalData
 * @returns data after encrypting
 */
export const encryptWithAES = (originalData) => {
  const encrypted = CryptoJS.AES.encrypt(originalData, CRYPTOJS_AES_ENCRYPT_KEY).toString();

  return encrypted;
};

/**
 * Decrypt function
 * @param {string} decoded_data
 * @returns original data
 */
export const decryptWithAES = (decoded_data) => {
  if (decoded_data) {
    const bytes = CryptoJS.AES.decrypt(decoded_data, CRYPTOJS_AES_ENCRYPT_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);

    return originalText;
  }

  return "";
};
