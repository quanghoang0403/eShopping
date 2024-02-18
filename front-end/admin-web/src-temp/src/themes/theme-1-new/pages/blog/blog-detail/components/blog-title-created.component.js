import React from "react";
import "./blog-card-detail-content.component.scss";
import { UserLineDueToneIcon } from "../../../../assets/icons.constants";

export default function BlogDetailCreated({ isCustomize, dataBlogDetailMockUp, blogDetail, translatedData }) {
  return !isCustomize && !blogDetail?.createdBy ? (
    <></>
  ) : (
    <>
      <UserLineDueToneIcon />
      <span className="ml-8">
        {translatedData.by} {isCustomize ? dataBlogDetailMockUp.createdBy : blogDetail?.createdBy}
      </span>
    </>
  );
}
