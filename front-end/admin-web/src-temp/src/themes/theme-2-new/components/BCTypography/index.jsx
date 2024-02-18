import { Typography } from "antd";

export const BCTypography = (props) => {
  const { children, level = 0, className } = props;
  let fontSize = "14px";
  switch (level) {
    case 1:
      fontSize = "16px";
      break;
    case 2:
      fontSize = "18px";
      break;
    case 0:
    default:
  }

  return (
    <Typography.Text className={className} style={{ fontSize: fontSize }}>
      {children}
    </Typography.Text>
  );
};
