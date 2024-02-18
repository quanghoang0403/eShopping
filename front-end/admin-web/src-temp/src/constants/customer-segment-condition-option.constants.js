import {
  ageDataEnum,
  customerDataEnum,
  genderEnum,
  monthsInYear,
  objectiveEnum,
  orderConditionEnum,
  orderDataEnum,
  registrationDateConditionEnum,
} from "./customer-segment-condition.constants";

export const objectiveOptions = [
  {
    id: objectiveEnum.customerData,
    name: "customerSegment.condition.customerData",
  },

  {
    id: objectiveEnum.orderData,
    name: "customerSegment.condition.orderData",
  },
];

export const customerDataOptions = [
  {
    id: customerDataEnum.registrationDate,
    name: "customerSegment.condition.registrationDate",
  },
  {
    id: customerDataEnum.birthday,
    name: "customerSegment.condition.birthday",
  },
  {
    id: customerDataEnum.age,
    name: "customerSegment.condition.age",
  },
  {
    id: customerDataEnum.gender,
    name: "customerSegment.condition.gender",
  },
  {
    id: customerDataEnum.platform,
    name: "customerSegment.condition.platform",
  },
  {
    id: customerDataEnum.tag,
    name: "customerSegment.condition.tag",
  },
];

export const registrationDateConditionOptions = [
  {
    id: registrationDateConditionEnum.on,
    name: "customerSegment.condition.on",
  },
  {
    id: registrationDateConditionEnum.before,
    name: "customerSegment.condition.before",
  },
  {
    id: registrationDateConditionEnum.after,
    name: "customerSegment.condition.after",
  },
];

export const monthsInYearOptions = [
  {
    id: monthsInYear.jan,
    name: "customerSegment.condition.month.january",
  },
  {
    id: monthsInYear.feb,
    name: "customerSegment.condition.month.february",
  },
  {
    id: monthsInYear.mar,
    name: "customerSegment.condition.month.march",
  },
  {
    id: monthsInYear.apr,
    name: "customerSegment.condition.month.april",
  },
  {
    id: monthsInYear.may,
    name: "customerSegment.condition.month.may",
  },
  {
    id: monthsInYear.jun,
    name: "customerSegment.condition.month.june",
  },
  {
    id: monthsInYear.jul,
    name: "customerSegment.condition.month.july",
  },
  {
    id: monthsInYear.aug,
    name: "customerSegment.condition.month.august",
  },
  {
    id: monthsInYear.sep,
    name: "customerSegment.condition.month.september",
  },
  {
    id: monthsInYear.oct,
    name: "customerSegment.condition.month.october",
  },
  {
    id: monthsInYear.nov,
    name: "customerSegment.condition.month.november",
  },
  {
    id: monthsInYear.dec,
    name: "customerSegment.condition.month.december",
  },
];

export const ageConditionOptions = [
  {
    id: ageDataEnum.isEqual,
    name: "customerSegment.condition.isEqual",
  },
  {
    id: ageDataEnum.isLargerThan,
    name: "customerSegment.condition.isLargerThan",
  },
  {
    id: ageDataEnum.isLargerThanOrEqual,
    name: "customerSegment.condition.isLargerThanOrEqual",
  },
  {
    id: ageDataEnum.isLessThan,
    name: "customerSegment.condition.isLessThan",
  },
  {
    id: ageDataEnum.isLessThanOrEqual,
    name: "customerSegment.condition.isLessThanOrEqual",
  },
];

export const genderConditionOptions = [
  {
    id: genderEnum.male,
    name: "customerSegment.condition.male",
  },
  {
    id: genderEnum.female,
    name: "customerSegment.condition.female",
  },
  {
    id: genderEnum.other,
    name: "customerSegment.condition.others",
  },
];

export const orderDataOptions = [
  {
    id: orderDataEnum.totalCompletedOrders,
    name: "customerSegment.condition.totalCompletedOrders",
  },
  {
    id: orderDataEnum.totalPurchasedAmount,
    name: "customerSegment.condition.totalPurchasedAmount",
  },
  {
    id: orderDataEnum.days,
    name: "customerSegment.condition.timeFromLastOrder",
  },
];

export const orderConditionOptions = [
  {
    id: orderConditionEnum.isEqual,
    name: "customerSegment.condition.isEqual",
  },
  {
    id: orderConditionEnum.isLargerThan,
    name: "customerSegment.condition.isLargerThan",
  },
  {
    id: orderConditionEnum.isLargerThanOrEqual,
    name: "customerSegment.condition.isLargerThanOrEqual",
  },
  {
    id: orderConditionEnum.isLessThan,
    name: "customerSegment.condition.isLessThan",
  },
  {
    id: orderConditionEnum.isLessThanOrEqual,
    name: "customerSegment.condition.isLessThanOrEqual",
  },
];
