import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import {
  default as blogDataService,
  default as blogsDataService,
} from "../../../../../data-services/blog-data.service";
import { getStoreConfig } from "../../../../../utils/helpers";
import blogArticleImageDefault from "../../../../assets/images/blog-detail-image-default.jpg";
import { backgroundTypeEnum, theme1ElementCustomize } from "../../../../constants/store-web-page.constants";
import { BlogCardCategoriesComponent } from "../../blog-list/components/blog-card-categories.component";
import { blogListCategoriesDefault, blogListRecentPostDefault } from "../../blog-list/default-data";
import { BlogCardDetailContentComponent } from "./blog-card-detail-content.component";
import "./blog-detail-content.component.scss";
import { BlogHyperlinkContainerComponent } from "./blog-hyperlink-container.component";
export function BlogDetailContentComponent(props) {
  const param = useParams();
  const { clickToFocusCustomize, general, isCustomize, config, fontFamily } = props;
  const colorGroupArticle = general?.color?.colorGroups?.find((a) => a?.id === config?.article?.colorGroupId) ?? {};
  const [t] = useTranslation();
  const history = useHistory();
  const isMaxWith1200 = useMediaQuery({ maxWidth: 1200 });
  const bannerImage =
    (config?.article?.backgroundType === backgroundTypeEnum.Image && config?.article?.backgroundImage) ??
    blogArticleImageDefault;
  const [blogDetail, setBlogDetail] = useState(null);
  const [blogRecentPost, setBlogRecentPost] = useState([]);
  const [blogCategories, setBlogCategories] = useState([]);
  const storeConfig = getStoreConfig();
  const isMaxWidth575 = useMediaQuery({ maxWidth: 575 });
  const isMaxWidth1200 = useMediaQuery({ maxWidth: 1200 });

  const onClickCategories = (categoryId) => {
    if (!isCustomize) {
      if (categoryId == null && categoryId === undefined) {
        localStorage.setItem("categoryId", "");
      } else {
        localStorage.setItem("categoryId", categoryId.toString());
      }
      history.push("/blog");
    }
    if (isMaxWidth575) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const searchFunction = (keySearch) => {
    if (!isCustomize) {
      if (keySearch == null && keySearch === undefined) {
        localStorage.setItem("keySearch", "");
      } else {
        localStorage.setItem("keySearch", keySearch.toString());
      }
      history.push("/blog");
    }
    if (isMaxWidth575) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (!isCustomize && param?.path) {
      getInitData(param?.path);
    }
    handleLoadBlogCategoriesData();
  }, []);

  useEffect(() => {
    if (!isMaxWidth1200) return;
    const tabletBottomContentElement = document.querySelector(
      "#themeArticleBlogDetail .tablet-bottom-content-blog-detail-theme1",
    );
    const blogCardCategoriesSearchElement = document.querySelector(
      "#themeArticleBlogDetail .tablet-bottom-content-blog-detail-theme1 .blog-card-categories-search",
    );
    const hyperlinkContainerElement = document.querySelector("#themeArticleBlogDetail .hyperlink-blog-detail-theme1");
    const mainContentContainerElement = document.querySelector("#themeArticleBlogDetail .main-content-container");

    if (tabletBottomContentElement && blogCardCategoriesSearchElement && mainContentContainerElement) {
      const container = document.createElement("div");
      container.classList.add("container-blog-card-search-detail-theme1");
      container.appendChild(blogCardCategoriesSearchElement);
      if (hyperlinkContainerElement) {
        hyperlinkContainerElement.insertAdjacentElement("afterend", container);
      } else {
        mainContentContainerElement.appendChild(container);
      }
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

  const getInitData = async (blogId) => {
    const res = await blogDataService.getBlogByIdAsync(blogId);
    if (res) {
      setBlogDetail(res?.data?.blog);
      const response = await blogDataService.putCountBlogAsync({
        storeId: storeConfig?.storeId,
        blogId: res?.data?.blog?.id,
      });
    }
  };

  const handleLoadBlogCategoriesData = async () => {
    if (isCustomize) {
      setBlogCategories(blogListCategoriesDefault);
      setBlogRecentPost(blogListRecentPostDefault);
    } else {
      const blogsRecentPostData = await blogsDataService.getBlogsAllInforAsync(
        1,
        5,
        "",
        "",
        "",
        true,
        false,
      );
      const blogCategories = await blogsDataService.getBlogCategoryDataAsync(storeConfig?.storeId);
      setBlogCategories(blogCategories?.data?.blogCategories);
      setBlogRecentPost(blogsRecentPostData?.data?.blogs);
    }
  };

  return (
    <div
      className={`blog-detail-container ${isCustomize && "is-customize"}`}
      style={{
        background:
          config?.article?.backgroundType === backgroundTypeEnum.Color
            ? config?.article?.backgroundColor
            : "url(" + config?.article?.backgroundImage + ")",
        backgroundSize: "cover",
      }}
    >
      <div
        id={"themeArticleBlogDetail"}
        onClick={() => {
          if (clickToFocusCustomize) clickToFocusCustomize(theme1ElementCustomize.ArticleBlogDetail);
        }}
      >
        <div
          className="blog-detail-content"
          style={{
            background:
              config?.article?.backgroundType === backgroundTypeEnum.Color
                ? config?.article?.backgroundColor
                : "url(" + bannerImage + ")",
            backgroundSize: "cover",
          }}
          id="blog-detail-content-blog-detail-theme1"
        >
          {/* Hyperlink */}
          <div className="hyperlink-blog-detail-theme1">
            <BlogHyperlinkContainerComponent
              {...props}
              blogDetail={blogDetail}
              t={t}
              colorGroupArticle={colorGroupArticle}
            />
          </div>

          <div className="main-content-container">
            {/* Left content */}
            <BlogCardDetailContentComponent {...props} blogDetail={blogDetail} t={t} tags={blogDetail?.blogTags} />

            {/* Right content */}
            {!isMaxWith1200 && (
              <div className="blog-right-content">
                <BlogCardCategoriesComponent
                  {...props}
                  colorGroupArticle={colorGroupArticle}
                  blogRecentPost={blogRecentPost}
                  blogCategories={blogCategories}
                  isCustomize={isCustomize}
                  onClickCategories={onClickCategories}
                  searchFunction={(keySearch) => {
                    searchFunction(keySearch);
                  }}
                />
              </div>
            )}
          </div>
        </div>
        {isMaxWith1200 && (
          <div className="tablet-bottom-content tablet-bottom-content-blog-detail-theme1">
            <BlogCardCategoriesComponent
              {...props}
              colorGroupArticle={colorGroupArticle}
              blogRecentPost={blogRecentPost}
              blogCategories={blogCategories}
              isCustomize={isCustomize}
              onClickCategories={onClickCategories}
              searchFunction={(keySearch) => {
                searchFunction(keySearch);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
