import { Button, Col } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";
import blogsDataService from "../../../../../data-services/blog-data.service";
import { getStoreConfig } from "../../../../../utils/helpers";
import { blogListCategoriesDefault, blogListDefault, blogListRecentPostDefault } from "../default-data";
import { BlogCardCategoriesComponent } from "./blog-card-categories.component";
import { BlogCardContentComponent } from "./blog-card-content.component";
import "./blog-list-content.component.scss";
const StyledBlogList = styled.div`
  background-color: ${(props) =>
    props?.config?.blogList?.backgroundType == 1 ? props?.config?.blogList?.backgroundColor : "none"};
  }

  .blog-list-content-customize {
    background-image: ${(props) =>
      props?.config?.blogList?.backgroundType == 2 ? "url(" + props?.config?.blogList?.backgroundImage + ")" : "none"};
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    .row-content-custom {
      .col-list-card {
        .button-view-more {
          background: ${(props) => props?.colorGroup?.buttonBackgroundColor};
          border: 1px solid ${(props) => props?.colorGroup?.buttonBorderColor};
          span {
            color: ${(props) => props?.colorGroup?.buttonTextColor}
          };
        }
        .blog-card-content-customize {
          .row-created-information {
            /* .created-time {
              color: ${(props) => props?.colorGroup?.textColor};
              svg {
                path {
                  stroke: ${(props) => props?.colorGroup?.textColor};
                }
              }
            } */
            /* .tag {
              span {
                color: ${(props) => props?.colorGroup?.textColor};
              }
              svg {
                path {
                  stroke: ${(props) => props?.colorGroup?.textColor};
                }
              }
            } */
            .created-by {
              span {
                color: ${(props) => props?.colorGroup?.textColor};
              }
              /* svg {
                path {
                  stroke: ${(props) => props?.colorGroup?.textColor};
                }
              } */
            }
          }
          .row-title .title{
            color: ${(props) => props?.colorGroup?.titleColor};
          }
          .row-content .content {
            color: ${(props) => props?.colorGroup?.textColor};
          }
          .row-button {
            background: ${(props) => props?.colorGroup?.buttonBackgroundColor};
            border: 1px solid ${(props) => props?.colorGroup?.buttonBorderColor};
            span {
                color: ${(props) => props?.colorGroup?.buttonTextColor};
              }
            .icon-arrow{
              path{
                fill: ${(props) => props?.colorGroup?.buttonTextColor};
              }
            }
          }
        }
      }
      .col-list-categories-and-rencent-post .blog-card-categories-and-recent-post-customize .blog-card-recent-post-customize{
        .recent-post .post-component .post-content {
          .post-created-time{
            span {
              color: ${(props) => props?.colorGroup?.textColor};
            }
            svg {
              path {
                stroke: ${(props) => props?.colorGroup?.textColor};
              }
            }
          }
          .post-title {
            color: ${(props) => props?.colorGroup?.titleColor};
          }
        }
      }
    }
  }

  .blog-list-content {
    background-image: ${(props) =>
      props?.config?.blogList?.backgroundType == 2 ? "url(" + props?.config?.blogList?.backgroundImage + ")" : "none"};
    .row-content-custom {
      .col-list-card {
        .button-view-more {
          background: ${(props) => props?.colorGroup?.buttonBackgroundColor};
          border: 1px solid ${(props) => props?.colorGroup?.buttonBorderColor};
          span {
            color: ${(props) => props?.colorGroup?.buttonTextColor}
          };
        }
        .blog-card-content {
          .row-created-information {
            /* .created-time {
              color: ${(props) => props?.colorGroup?.textColor};
              svg {
                path {
                  stroke: ${(props) => props?.colorGroup?.textColor};
                }
              }
            } */
            /* .tag {
              span {
                color: ${(props) => props?.colorGroup?.textColor};
              }
              svg {
                path {
                  stroke: ${(props) => props?.colorGroup?.textColor};
                }
              }
            } */
            .created-by {
              span {
                color: ${(props) => props?.colorGroup?.textColor};
              }
              /* svg {
                path {
                  stroke: ${(props) => props?.colorGroup?.textColor};
                }
              } */
            }
          }
          .row-title .title{
            color: ${(props) => props?.colorGroup?.titleColor};
          }
          .row-content .content {
            color: ${(props) => props?.colorGroup?.textColor};
          }
          .row-button {
            background: ${(props) => props?.colorGroup?.buttonBackgroundColor};
            border: 1px solid ${(props) => props?.colorGroup?.buttonBorderColor};
            span {
                color: ${(props) => props?.colorGroup?.buttonTextColor};
              }
            .icon-arrow{
              path{
                fill: ${(props) => props?.colorGroup?.buttonTextColor};
              }
            }
          }
        }
      }
      .col-list-categories-and-rencent-post .blog-card-categories-and-recent-post .blog-card-recent-post{
        .recent-post .post-component .post-content {
          .post-created-time{
            span {
              color: ${(props) => props?.colorGroup?.textColor};
            }
            svg {
              path {
                stroke: ${(props) => props?.colorGroup?.textColor};
              }
            }
          }
          .post-title {
            color: ${(props) => props?.colorGroup?.titleColor};
          }
        }
      }
    }
  } 

`;

export function BlogListContentComponent(props) {
  const [t] = useTranslation();
  const pageData = {
    viewMore: t("button.viewMore", "Xem thêm"),
    by: t("blog.by", "Bởi"),
  };
  const { config, isCustomize, clickToFocusCustomize } = props;
  const [blogListData, setBlogListData] = useState([]);
  const [blogRecentPost, setBlogRecentPost] = useState([]);
  const [blogCategories, setBlogCategories] = useState([]);
  const colorGroup = props?.general.color?.colorGroups.find((c) => c.id === props?.config?.blogList?.colorGroupId);
  const [isLoadingViewMore, setIsLoadingViewMore] = useState(false);
  const [itemsPerPage, setItemPerPage] = useState(5); // Số lượng giá trị hiển thị mỗi lần
  const [visibleItemsCount, setVisibleItemsCount] = useState(itemsPerPage);

  const categoryId = localStorage.getItem("categoryId");
  const keySearch = localStorage.getItem("keySearch");
  const [keySearchBindingInput, setKeySearchBindingInput] = useState("");
  const isMaxWidth575 = useMediaQuery({ maxWidth: 575 });
  const isMaxWidth1200 = useMediaQuery({ maxWidth: 1200 });

  useEffect(() => {
    setKeySearchBindingInput(keySearch);
  }, []);

  useEffect(() => {
    if (!isMaxWidth1200) return;
    const rowContentCustom = document.getElementById("row-content-custom-blog-theme1");
    const blogCardCategoriesSearch = document.getElementById("blog-card-categories-search-blog-theme1");
    if (rowContentCustom && blogCardCategoriesSearch) {
      // Move element "blog-card-categories-search" to the first child of "row-content-custom"
      rowContentCustom.insertBefore(blogCardCategoriesSearch, rowContentCustom.firstChild);
    }
  }, []);

  useEffect(() => {
    if (isMaxWidth575) {
      const tagElements = document.querySelectorAll(".tag-component-category-blog-theme1");
      if (tagElements) {
        const handleClick = () => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        };

        tagElements.forEach((tagElement) => {
          tagElement.addEventListener("click", handleClick);
        });

        return () => {
          tagElements.forEach((tagElement) => {
            tagElement.removeEventListener("click", handleClick);
          });
        };
      }
    }
  }, [isMaxWidth575]);

  const handleViewMoreClick = () => {
    setIsLoadingViewMore(true);
    setItemPerPage(itemsPerPage + 5);
    setTimeout(() => {
      setVisibleItemsCount((prevCount) => prevCount + itemsPerPage);
      setIsLoadingViewMore(false);
    }, 1000);
  };

  useEffect(() => {
    handleLoadBlogsData();
  }, [itemsPerPage]);

  const storeConfig = getStoreConfig();

  const searchFunction = async (searchText) => {
    if (searchText) {
      const lowerCaseText = searchText.toLowerCase(); // Chuyển thành viết thường
      const normalizedText = lowerCaseText.removeVietnamese();
      const blogsData = await blogsDataService.getBlogsAllInforAsync(
        1,
        itemsPerPage,
        searchText,
        "",
        "",
        true,
        false,
      );
      setBlogListData(blogsData?.data);
    } else {
      const blogsData = await blogsDataService.getBlogsAllInforAsync(
        1,
        itemsPerPage,
        "",
        "",
        "",
        true,
        false,
      );
      setBlogListData(blogsData?.data);
    }
    if (isMaxWidth575) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const onClickCategories = async (categoryId) => {
    if (!categoryId) {
      const blogsData = await blogsDataService.getBlogsAllInforAsync(
        1,
        itemsPerPage,
        "",
        "",
        "",
        true,
        false,
      );
      setBlogListData(blogsData?.data);
    } else {
      const blogsData = await blogsDataService.getBlogsAllInforAsync(
        1,
        itemsPerPage,
        "",
        categoryId,
        "",
        true,
        false,
      );
      setBlogListData(blogsData?.data);
    }
    if (isMaxWidth575) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleLoadData = async (keySearch, categoriesId) => {
    const lowerCaseText = keySearch.toLowerCase();
    const keySearchNormalized = lowerCaseText.removeVietnamese();
    const blogsData = await blogsDataService.getBlogsAllInforAsync(
      1,
      itemsPerPage,
      keySearchNormalized,
      categoriesId,
      "",
      true,
      false,
    );
    const blogsRecentPostData = await blogsDataService.getBlogsAllInforAsync(
      1,
      5,
      keySearchNormalized,
      "",
      "",
      true,
      false,
    );
    setBlogListData(blogsData?.data);
    const blogCategories = await blogsDataService.getBlogCategoryDataAsync(storeConfig?.storeId);
    setBlogCategories(blogCategories?.data?.blogCategories);
    setBlogRecentPost(blogsRecentPostData?.data?.blogs);
    localStorage.setItem("categoryId", "null");
    localStorage.setItem("keySearch", "null");
  };

  const handleLoadBlogsData = async () => {
    if (isCustomize) {
      setBlogListData(blogListDefault);
      setBlogCategories(blogListCategoriesDefault);
      setBlogRecentPost(blogListRecentPostDefault);
    } else {
      if (categoryId !== null && categoryId !== undefined && categoryId !== "null" && categoryId !== "undefined") {
        handleLoadData("", categoryId);
      } else if (keySearch !== null && keySearch !== undefined && keySearch !== "null" && keySearch !== "undifined") {
        handleLoadData(keySearch, "");
      } else {
        handleLoadData("", "");
      }
    }
  };

  return (
    <StyledBlogList isCustomize={isCustomize} colorGroup={colorGroup} config={config}>
      <div className={isCustomize ? "blog-list-content-customize" : "blog-list-content"}>
        <div className="row-content-custom" id="row-content-custom-blog-theme1">
          <Col className="col-list-card">
            {blogListData?.blogs?.slice(0, visibleItemsCount).map((blogData, index) => (
              <BlogCardContentComponent
                setItemPerPage={setItemPerPage}
                isCustomize={isCustomize}
                key={blogData.id}
                {...blogData}
              />
            ))}
            {visibleItemsCount < blogListData?.total && (
              <Button loading={isLoadingViewMore} onClick={handleViewMoreClick} className="button-view-more">
                <span>{pageData.viewMore}</span>
              </Button>
            )}
          </Col>
          <Col className="col-list-categories-and-rencent-post">
            <BlogCardCategoriesComponent
              onClickCategories={onClickCategories}
              blogRecentPost={blogRecentPost}
              blogCategories={blogCategories}
              isCustomize={isCustomize}
              searchFunction={searchFunction}
              keySearch={
                !keySearchBindingInput || keySearchBindingInput === "null" || keySearchBindingInput === "undefined"
                  ? ""
                  : keySearchBindingInput
              }
              {...props}
            />
          </Col>
        </div>
      </div>
    </StyledBlogList>
  );
}
