const callbackToastMessage = (callback, afterCallback) => {
  if (callback) {
    callback();
  }
  if (window.toastMessageMaxDiscount) {
    clearTimeout(window.toastMessageMaxDiscount);
  }
  window.toastMessageMaxDiscount = setTimeout(() => {
    if (afterCallback) {
      afterCallback();
    }
  }, 3000);
};

const calculationMaxDiscountService = (data, callback, afterCallback) => {
  // If quantity <= 1 auto have discount
  if (data?.quantity <= 1) return;

  //Flash Sale
  if (data?.isFlashSale && data?.isDiscountTotal) return;

  // Discount on total bill, specific product category, specific product
  let totalPriceIncludedTopping = data?.totalPriceValue;
  if (data?.isIncludedTopping) {
    totalPriceIncludedTopping += data?.totalPriceTopping;
  }
  if (totalPriceIncludedTopping > data?.maximumDiscountAmount && data?.maximumDiscountAmount !== 0) {
    callbackToastMessage(callback, afterCallback);
  } else {
    if (afterCallback) {
      afterCallback();
    }
  }
};

const maxDiscountService = {
  calculationMaxDiscountService,
};

export default maxDiscountService;
