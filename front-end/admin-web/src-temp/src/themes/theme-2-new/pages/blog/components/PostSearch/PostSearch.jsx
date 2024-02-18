import React from "react";
import { FnbInput } from "../../../../components/fnb-input/fnb-input.component";
import { SearchIconBlog } from "../../../../assets/icons.constants";
import "./styles.scss";
import { Col, Row } from "antd";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const PostSearch = ({ onChange, colorGroupBlogHeader = {} }) => {
  const [t] = useTranslation();
  const translateData = {
    enterKeySearch: t("blog.enterKeySearch", "Enter a keyword to search"),
    search: t('blog.search', "Searching")
  };
  const [search, setSearch] = useState('');
  return (
    <Row className="post-search-theme2">
      <Col
        className="title"
        style={{ color: colorGroupBlogHeader?.titleColor }}
      >
        {translateData.search}
      </Col>
      <Col className="input-search">
        <FnbInput
          prefix={<SearchIconBlog onClick={() => onChange(search)}/>}
          placeholder={translateData.enterKeySearch}
          className="input-search-blog"
          onChange={(event) => setSearch(event?.target?.value)}
          onPressEnter={(event) => onChange(event?.target?.value)}
          maxLength={100}
          allowClear={true}
        />
      </Col>
    </Row>
  );
};

export default PostSearch;
