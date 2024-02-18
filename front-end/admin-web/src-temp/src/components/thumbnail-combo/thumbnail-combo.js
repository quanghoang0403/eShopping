import React from "react";
import { Image } from "antd";
import { images } from "constants/images.constants";
import "./thumbnail-combo.scss";

export function ThumbnailCombo(props) {
  const { src, width, height } = props;
  return (
    <>
      <Image preview={false} className="thumbnail-combo" width={width ?? 56} height={height ?? 56} src={src ?? "error"} fallback={images.thumbnailComboDefault} />
    </>
  );
}