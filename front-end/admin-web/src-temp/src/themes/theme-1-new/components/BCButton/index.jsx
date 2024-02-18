import { Button } from "antd";

export const BCButton = (props) => {
  const { disabled, isLoading, htmlType = "button", className, onClick, themePageConfig, children } = props;
  return (
    <Button
      disabled={disabled}
      type="primary"
      loading={isLoading}
      htmlType={htmlType}
      className={className}
      onClick={onClick}
      style={{
        color: themePageConfig?.colorGroup?.buttonTextColor,
        backgroundColor: themePageConfig?.colorGroup?.buttonBackgroundColor,
        borderColor: themePageConfig?.colorGroup?.buttonBorderColor,
      }}
    >
      {children}
    </Button>
  );
};
