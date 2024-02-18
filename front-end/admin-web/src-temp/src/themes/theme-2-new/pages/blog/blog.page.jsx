import { Col, Pagination, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { useParams } from "react-router-dom";
import blogDataService from "../../../data-services/blog-data.service";
import { getStorage, localStorageKeys } from "../../../utils/localStorage.helpers";
import { NoPostIcon } from "../../assets/icons.constants";
import backgroundBlogDefault from "../../assets/images/background-default-blog-theme-2.png";
import { EnumBlogName } from "../../constants/enum";
import PageType from "../../constants/page-type.constants";
import { backgroundTypeEnum, theme2ElementCustomize } from "../../constants/store-web-page.constants";
import Index from "../../index";
import "./Blog.scss";
import HeaderBlog from "./HeaderBlog/HeaderBlog";
import { mockupDataPostContent } from "./components/MockupData/MockupData";
import PostCategory from "./components/PostCategory/PostCategory";
import PostContent from "./components/PostContent/PostContent";
import PostDetail from "./components/PostDetail/PostDetail";
import PostSearch from "./components/PostSearch/PostSearch";
import PostViewedMostList from "./components/PostViewedMost/PostViewedMostList";

function Blog({ isCustomize, clickToFocusCustomize, ...props }) {
  const [t] = useTranslation();
  const translateData = {
    blogPage: t("blog.blogPage", "Blog page"),
  };
  useEffect(() => {
    document.title = translateData.blogPage;
  }, []);

  const BlogListPage = (props) => {
    const { config, general, isCustomize, isDefault, clickToFocusCustomize, id, fontFamily } = props;
    const paramsUrl = useParams();
    const isDetail = Boolean(paramsUrl?.urlEncode);
    const isCustomizeAndBlogDetail = isCustomize && id === PageType.BLOG_DETAIL_PAGE;
    const { header = {}, blogs = {} } = config;
    const translateData = {
      noPost: t("blog.noPost", "Chưa có bài viết"),
    };
    const isDevicesTabletAndMobile = useMediaQuery({ maxWidth: 1336 });
    const colorGroupBlogHeader = general?.color?.colorGroups?.find((a) => a?.id === header?.colorGroupId) ?? {};
    const colorGroupBlogs = general?.color?.colorGroups?.find((a) => a?.id === blogs?.colorGroupId) ?? {};

    function getBackgroundBlog(blogs = {}) {
      let style = {};
      if (blogs?.backgroundType) {
        if (blogs?.backgroundType === backgroundTypeEnum.Color) {
          style = {
            backgroundColor: blogs?.backgroundColor,
          };
        } else {
          style = {
            background: `url(${blogs?.backgroundImage ?? backgroundBlogDefault}) no-repeat center/cover`,
          };
        }
      }

      return style;
    };

    const jsonConfig = getStorage(localStorageKeys.STORE_CONFIG);
    const storeConfig = JSON.parse(jsonConfig);
    const storeId = storeConfig?.storeId;

    const paramsInitial = {
      pageNumber: 1,
      pageSize: 5,
      keySearch: "",
      categoryId: "",
      creatorId: "",
      isCreateTime: true,
    };
    const [params, setParams] = useState(paramsInitial);

    const [blogList, setBlogList] = useState([]);
    const [blogListViewerMost, setBlogListViewerMost] = useState([]);
    const [totalPage, setTotalPage] = useState(isCustomize ? 5 : 0);
    const [styleBackground, setStyleBackground] = useState(getBackgroundBlog(blogs));

    useEffect(() => {
      if (isCustomize || !storeId) return;
      (async () => {
        try {
          const response = await blogDataService.getBlogAsync(params);
          setBlogList(response?.data?.blogs);
          setTotalPage(response?.data?.total);
        } catch (error) {}
      })();
    }, [params.pageNumber, params.categoryId, params.keySearch]);

    useEffect(() => {
      if (isCustomize || !storeId) return;
      (async () => {
        try {
          const response = await blogDataService.getBlogAsync({
            ...params,
            isCreateTime: true,
          });
          setBlogListViewerMost(response?.data?.blogs);
        } catch (error) {}
      })();
    }, []);

    useEffect(() => {
      if (isCustomize || !storeId) return;
      if (params?.keySearch || params?.categoryId) {
        window.history?.pushState({}, "", "/blog");
        window.history?.replaceState({}, "", "/blog");
      }
    }, [params?.keySearch, params?.categoryId]);

    useEffect(() => {
      setStyleBackground(getBackgroundBlog(blogs));
    }, [blogs, id]);

    const handleChangeParams = (name, value) => {
      if (isCustomize) return;
      setParams((preState) => ({ ...preState, [name]: value }));
    };
    
    const isBlogListPageById = id === PageType.BLOG_PAGE;
    const isHeaderBlogList = isBlogListPageById || (isDetail && (params?.categoryId || params?.keySearch));

    return (
      <div className="blog-theme2">
        {isHeaderBlogList && (
          <Row id="blogHeader" style={{ display: "block" }}>
            <HeaderBlog
              header={header}
              colorGroupBlogHeader={colorGroupBlogHeader}
              isCustomize={isCustomize}
              clickToFocusCustomize={clickToFocusCustomize}
            />
          </Row>
        )}
        <Row id="blogList" onClick={() => clickToFocusCustomize && clickToFocusCustomize(theme2ElementCustomize.Blogs)}>
          <Row
            style={{
              width: "100%",
              justifyContent: "center",
              alignContent: "center",
              flexDirection: "column",
              paddingTop: 16,
              ...styleBackground,
            }}
          >
            <Row
              className={`${isDevicesTabletAndMobile ? "blog-list-theme2-not-desktop" : "blog-list-theme2-desktop"} ${
                isBlogListPageById ? "blog-list-theme2-by-id" : "blog-detail-theme2-by-id"
              } ${isHeaderBlogList ? "filter-move-on-top-theme2" : "filter-move-on-bottom-theme2"}`}
            >
              {isDevicesTabletAndMobile && isBlogListPageById && (
                <Row style={{ justifyContent: "center" }} className="pagination-blog-theme2">
                  <Pagination
                    defaultCurrent={1}
                    pageSize={5}
                    defaultPageSize={5}
                    total={totalPage}
                    current={params?.pageNumber}
                    onChange={(value) => handleChangeParams("pageNumber", value)}
                  />
                </Row>
              )}

              {(isDetail && !params?.categoryId && !params?.keySearch) || isCustomizeAndBlogDetail ? (
                <Row className="session-post-content" style={{ justifyContent: "center", paddingTop: 80 }}>
                  <Col className="post-content-list">
                    <PostDetail
                      isCustomize={isCustomize}
                      colorGroupBlogHeader={colorGroupBlogs}
                      fontFamily={fontFamily}
                    />
                  </Col>
                </Row>
              ) : (
                <Col className={`post-content-list ${!isCustomize && blogList?.length < 1 ? "no-post-content" : ""}`}>
                  {isCustomize ? (
                    mockupDataPostContent.map((post) => (
                      <Row key={post?.id}>
                        <PostContent data={post} type={EnumBlogName.BLOG_PAGE} colorGroupBlogHeader={colorGroupBlogs} />
                      </Row>
                    ))
                  ) : blogList?.length > 0 ? (
                    blogList.map((post) => (
                      <Row key={post?.id}>
                        <PostContent
                          colorGroupBlogHeader={colorGroupBlogs}
                          data={post}
                          isCustomize={isCustomize}
                          type={EnumBlogName.BLOG_PAGE}
                        />
                      </Row>
                    ))
                  ) : (
                    <Row className="no-post" style={{ marginRight: "50vh" }}>
                      <Row>
                        <NoPostIcon />
                      </Row>
                      <Row className="text-no-post">{translateData.noPost}</Row>
                    </Row>
                  )}
                </Col>
              )}

              <Col
                className={`filter-post ${
                  isHeaderBlogList ? "filter-post-blog-list-theme2" : "filter-post-blog-detail-theme2"
                }`}
                style={{ marginLeft: 48 }}
              >
                <Row
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 20,
                    padding: "24px 10px",
                    paddingTop: 10,
                  }}
                  className="filter-post-blog-theme2"
                >
                  <Col className="post-search-blog-theme2">
                    <PostSearch
                      onChange={(value) => handleChangeParams("keySearch", value)}
                      colorGroupBlogHeader={colorGroupBlogs}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <PostCategory
                      isCustomize={isCustomize}
                      colorGroupBlogHeader={colorGroupBlogs}
                      onClickCategory={(id) => handleChangeParams("categoryId", id)}
                    />
                  </Col>
                </Row>
                {!isDevicesTabletAndMobile && (
                  <Row className="post-recent-blog-theme2-desktop">
                    <Col>
                      <PostViewedMostList
                        isCustomize={isCustomize}
                        data={blogListViewerMost}
                        colorGroupBlogHeader={colorGroupBlogs}
                      />
                    </Col>
                  </Row>
                )}
              </Col>
            </Row>

            {isDevicesTabletAndMobile && (
              <Row className="post-recent-blog-theme2">
                <Col>
                  <PostViewedMostList
                    isCustomize={isCustomize}
                    data={blogListViewerMost}
                    colorGroupBlogHeader={colorGroupBlogs}
                  />
                </Col>
              </Row>
            )}

            {!isDevicesTabletAndMobile && isBlogListPageById && (
              <Row style={{ justifyContent: "center" }} className="pagination-blog-theme2">
                <Pagination
                  defaultCurrent={1}
                  pageSize={5}
                  defaultPageSize={5}
                  total={totalPage}
                  current={params?.pageNumber}
                  onChange={(value) => handleChangeParams("pageNumber", value)}
                />
              </Row>
            )}
          </Row>
        </Row>
      </div>
    );
  };
  
  return (
    <Index
      {...props}
      isCustomize={isCustomize}
      contentPage={(__props) => {
        return <BlogListPage {...__props} isCustomize={isCustomize} clickToFocusCustomize={clickToFocusCustomize} />
      }}
    />
  );
}

export default Blog;
