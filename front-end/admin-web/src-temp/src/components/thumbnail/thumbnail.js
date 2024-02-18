import { Image } from "antd";
import { images } from "constants/images.constants";
import "./thumbnail.scss";

export function Thumbnail(props) {
  const { src, width, height, imageDefault = images.imgDefault } = props;
  return (
    <>
      <Image
        preview={false}
        className="thumbnail"
        width={width ?? 56}
        height={height ?? 56}
        src={src ?? "error"}
        fallback={imageDefault}
      />
    </>
  );
}
