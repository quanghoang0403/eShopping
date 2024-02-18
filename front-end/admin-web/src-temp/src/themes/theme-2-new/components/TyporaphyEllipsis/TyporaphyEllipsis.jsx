import { Typography } from "antd";
import "./TyporaphyEllipsis.scss";

function TyporaphyEllipsis({ rows = 1, title = "", fontSize = 14, ...props }) {
  const { Paragraph } = Typography;
  return (
    <Paragraph
      ellipsis={{
        rows: rows,
        tooltip: {
          color: "#fff",
          placement: "bottom",
          overlayInnerStyle: {
            borderRadius: "12px",
            color: "#282828",
            fontSize: "16px",
          },
          title: title,
        },
        suffix: "",
      }}
      className="fnb-typorapyh-ellipsis"
      style={{ fontSize }}
      {...props}
    >
      {title}
    </Paragraph>
  );
}

export default TyporaphyEllipsis;
