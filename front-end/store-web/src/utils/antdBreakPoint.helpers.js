export const antdBreakPoint = {
  xs: "480px",
  sm: "576px",
  md: "768px",
  lg: "992px",
  xl: "1200px",
  xxl: "1600px",
};

export const antdBreakPointName = {
  XS: "xs",
  SM: "sm",
  MD: "md",
  LG: "lg",
  XL: "xl",
  XXL: "xxl",
};

export const isMobileBreakPoint = (queryBreakPoints) => {
  if (!queryBreakPoints) return false;
  const isXS = queryBreakPoints[antdBreakPointName.XS] ?? false;
  const isSM = queryBreakPoints[antdBreakPointName.SM] ?? false;
  const isMD = queryBreakPoints[antdBreakPointName.MD] ?? false;
  const isLG = queryBreakPoints[antdBreakPointName.LG] ?? false;
  const isXL = queryBreakPoints[antdBreakPointName.XL] ?? false;
  const XXL = queryBreakPoints[antdBreakPointName.XXL] ?? false;
  return (isXS || isSM) && !isMD && !isLG && !isXL && !XXL;
};
