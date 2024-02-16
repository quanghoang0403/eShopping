import promotionDataService from "../data-services/promotion-data.service";

export const getPromotionsAsync = async (branchId) => {
  const result = promotionDataService.getPromotionsByBranchIdAsync(branchId);
  return result;
};

/**
 * Lock multiple calls on the same time
 * @param {*} ms
 * @param {*} callback
 * @param {*} methodName
 */
export function LockMultipleCalls(callback, methodName = "DefaultName", timeout = 100) {
  clearTimeout(window[methodName]);
  return new Promise((resolve) => {
    window[methodName] = setTimeout(() => {
      callback();
      resolve();
    }, timeout);
  });
}
