import { Tooltip } from "antd";

function TooltipPromotionConfig(props) {
  const { text, textTooltip, className } = props;
  const styleTooltip = {
    padding: "12px 16px",
    minWidth: "350px",
    color: "#FFF",
    textAlign: "center",
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: 600,
    lineHeight: "28px",
  };

  return (
    <Tooltip placement="topRight" title={textTooltip} color="#50429B" overlayInnerStyle={styleTooltip}>
      <span className={`${className} tooltip-promotion-config`}>{text}</span>
    </Tooltip>
  );
}

export default TooltipPromotionConfig;
