export const DayOfWeekConstants = {
  ALL_DAYS: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 7,
};

export const DayOfWeekGetNameConstants = [
  {
    id: DayOfWeekConstants.ALL_DAYS,
    text: "branchWorkingHour.allDaysInWeek",
    objectName: "allDays",
  },
  {
    id: DayOfWeekConstants.MONDAY,
    text: "dayOfWeek.monday",
    objectName: "monday",
  },
  {
    id: DayOfWeekConstants.TUESDAY,
    text: "dayOfWeek.tuesday",
    objectName: "tuesday",
  },
  {
    id: DayOfWeekConstants.WEDNESDAY,
    text: "dayOfWeek.wednesday",
    objectName: "wednesday",
  },
  {
    id: DayOfWeekConstants.THURSDAY,
    text: "dayOfWeek.thursday",
    objectName: "thursday",
  },
  {
    id: DayOfWeekConstants.FRIDAY,
    text: "dayOfWeek.friday",
    objectName: "friday",
  },
  {
    id: DayOfWeekConstants.SATURDAY,
    text: "dayOfWeek.saturday",
    objectName: "saturday",
  },
  {
    id: DayOfWeekConstants.SUNDAY,
    text: "dayOfWeek.sunday",
    objectName: "sunday",
  },
];

export const ListDayOfWeek = Object.values(DayOfWeekConstants);

export const mappingWorkingHours = (workingHours) => {
  const newWorkingHours = workingHours?.map((item) => ({
    ...item,
    dayOfWeek: item.dayOfWeek === DayOfWeekConstants.SUNDAY ? 0 : item.dayOfWeek,
  }));
  return newWorkingHours;
};
