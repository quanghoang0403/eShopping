import { Image } from "antd";

function Logo(props) {
  const { width = 54, src = "https://s3-sgn09.fptcloud.com/gofnb-dev/devimages/14122022233901.png" } = props;
  return <Image preview={false} src={src} width={width} />;
}

export default Logo;
