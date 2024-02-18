import { Typography } from "antd";
const { Paragraph } = Typography;

export default function FnbParagraph(props) {
  const { children } = props;

  return (
    <Paragraph style={{ maxWidth: "inherit" }} placement="top" ellipsis={{ tooltip: children }} color="#50429B">
      {children}
    </Paragraph>
  );
}
