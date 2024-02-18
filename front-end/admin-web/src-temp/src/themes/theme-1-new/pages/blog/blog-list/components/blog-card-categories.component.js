import { Button, Input, Row, Tooltip } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { ArrowUpIcon, SearchICon } from "../../../../assets/icons.constants";
import "./blog-card-categories.component.scss";
import { BlogCardRecentPostComponent } from "./blog-card-recent-post.component";

export function BlogCardCategoriesComponent(props) {
  const {
    blogCategories,
    blogRecentPost,
    onClickCategories,
    isCustomize,
    searchFunction,
    keySearch = "",
    fontFamily,
    colorGroupArticle
  } = props;
  const isMinWidth1200 = useMediaQuery({ minWidth: 1200 });
  const [t] = useTranslation();
  const DEFAULT_SEARCH = "FIRST";
  const pageData = {
    viewMore: t("button.viewMore", "Xem thêm"),
    searchText: t("blogList.searchText", "Nhập từ khóa để tìm kiếm"),
    searching: t("blogList.searching", "Tìm Kiếm"),
    categories: t("blogList.categories", "Danh Mục"),
    all: t("blogList.all", "Tất cả"),
  };
  const colorGroup = props?.general?.color?.colorGroups?.find((c) => c.id === props?.config?.header?.colorGroupId);
  const [searchTerm, setSearchTerm] = useState(DEFAULT_SEARCH);
  const [isOnChange, setIsOnChange] = useState(false);
  return (
    <>
      <div
        className={isCustomize ? "blog-card-categories-search-customize" : "blog-card-categories-search"}
        id="blog-card-categories-search-blog-theme1"
      >
        <Row className="categories">
          <span className="title-categories">{pageData.searching}</span>
          <div className="search-bar">
            <Input
              autoFocus={false}
              maxLength={100}
              className="search-component"
              allowClear
              size="large"
              placeholder={pageData.searchText}
              prefix={<SearchICon onClick={() => searchFunction(searchTerm)} />}
              onChange={(e) => {
                setIsOnChange(true);
                setSearchTerm(e.target.value);
              }}
              onPressEnter={(e) => searchFunction(e.target.value)}
              value={isOnChange ? searchTerm : keySearch}
            />
          </div>
        </Row>
      </div>
      <div
        className={
          isCustomize ? "blog-card-categories-and-recent-post-customize" : "blog-card-categories-and-recent-post"
        }
      >
        {blogCategories?.length > 0 && (
          <div className="categories">
            <span className="title-categories">{pageData.categories}</span>
            {isMinWidth1200 ? (
              <Tooltip
                color={colorGroup?.buttonBackgroundColor}
                placement="topLeft"
                title={<span style={{ fontFamily: fontFamily }}>{pageData.all}</span>}
              >
                <Button
                  className="tag-component tag-component-category-blog-theme1"
                  onClick={(e) => onClickCategories()}
                >
                  <div className="tag-name" data-tooltip={pageData.all}>
                    <ArrowUpIcon />
                    <span>{pageData.all}</span>
                  </div>
                </Button>
              </Tooltip>
            ) : (
              <Button className="tag-component tag-component-category-blog-theme1" onClick={(e) => onClickCategories()}>
                <div className="tag-name" data-tooltip={pageData.all}>
                  <ArrowUpIcon />
                  <span>{pageData.all}</span>
                </div>
              </Button>
            )}

            {blogCategories?.map((tag, index) => {
              if (tag?.total > 0 && isMinWidth1200)
                return (
                  <Tooltip
                    color={colorGroup?.buttonBackgroundColor}
                    placement="topLeft"
                    title={<span style={{ fontFamily: fontFamily }}>{tag.name}</span>}
                  >
                    <Button
                      className="tag-component tag-component-category-blog-theme1"
                      onClick={(e) => onClickCategories(tag.id)}
                    >
                      <div className="tag-name">
                        <ArrowUpIcon />
                        <span>{tag.name}</span>
                      </div>
                      <span className="tag-number">{tag.total}</span>
                    </Button>
                  </Tooltip>
                );
              if (tag?.total > 0 && !isMinWidth1200)
                return (
                  <Button
                    className="tag-component tag-component-category-blog-theme1"
                    onClick={(e) => onClickCategories(tag.id)}
                  >
                    <div className="tag-name">
                      <ArrowUpIcon />
                      <span>{tag.name}</span>
                    </div>
                    <span className="tag-number">{tag.total}</span>
                  </Button>
                );
            })}
          </div>
        )}
      </div>
      <div
        className={
          isCustomize ? "blog-card-categories-and-recent-post-customize" : "blog-card-categories-and-recent-post"
        }
        style={{ position: "sticky", top: "100px" }}
      >
        {blogRecentPost?.length > 0 && (
          <BlogCardRecentPostComponent
            blogRecentPost={blogRecentPost}
            isCustomize={isCustomize}
            colorGroupArticle={colorGroupArticle}
          />
        )}
      </div>
    </>
  );
}
