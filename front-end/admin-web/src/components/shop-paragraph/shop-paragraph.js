import { Typography } from "antd";
const { Paragraph } = Typography;

export default function ShopParagraph(props) {
  const { children } = props;

  return (
    <Paragraph style={{ maxWidth: "inherit" }} placement="top" ellipsis={{ tooltip: children }} color="#50429B">
      {children}
    </Paragraph>
  );
}
