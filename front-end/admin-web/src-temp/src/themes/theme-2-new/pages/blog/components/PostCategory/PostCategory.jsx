import { Col, Row, Tooltip, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";
import { FreeMode, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import blogCategoryDataService from "../../../../../data-services/blog-category-data.service";
import { getStorage, localStorageKeys } from "../../../../../utils/localStorage.helpers";
import { mockupPostCategory } from "../MockupData/MockupData";
import "./styles.scss";

const PostCategory = (props) => {
  const { isCustomize, onClickCategory, colorGroupBlogHeader } = props;
  const isMaxWidth1199 = useMediaQuery({ maxWidth: 1199 });
  const jsonConfig = getStorage(localStorageKeys.STORE_CONFIG);
  const storeConfig = JSON.parse(jsonConfig);
  const storeId = storeConfig.storeId;
  const swiperRef = useRef(null);
  const [blogCategories, setBlogCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [t] = useTranslation();

  const translateData = {
    noPost: t("blog.noPost", "Chưa có bài viết nào"),
    all: t("blog.all", "Tất cả"),
    categoty: t("blog.category", "Danh mục"),
    noCategory: t("blog.noCategory", "Chưa có danh mục"),
  };
  useEffect(() => {
    if (isCustomize || !storeId) return;
    (async () => {
      try {
        const response = await blogCategoryDataService.getBlogCategoryAsync({
          storeId,
        });
        setBlogCategories(response?.data?.blogCategories);
      } catch (error) {}
    })();
  }, []);

  const handleOnClickCategory = (id) => {
    onClickCategory && onClickCategory(id);
    setCategoryId(id);
  };

  const StyledCategoryName = styled.div`
    /* color: ${colorGroupBlogHeader?.buttonTextColor}; */
  `;

  let settings = { spaceBetween: 12, slidesPerView: "auto" };

  return (
    <Row
      className={`post-category-theme2 ${isMaxWidth1199} ? "post-category-tablet-mobile-theme2" : "post-category-desktop-theme2"`}
    >
      <Col className="title" style={{ color: colorGroupBlogHeader?.titleColor }}>
        {translateData.categoty}
      </Col>
      <Col className="category-list">
        <Swiper
          {...settings}
          freeMode={true}
          modules={[FreeMode, Navigation]}
          ref={swiperRef}
          className="swiper-category-list-theme2"
        >
          <Row className="category">
            {isMaxWidth1199 ? (
              <SwiperSlide key={"0"}>
                <Row
                  className={`category-item ${categoryId ? "" : "category-item-default"}`}
                  style={{
                    color: categoryId ? colorGroupBlogHeader?.textColor : colorGroupBlogHeader?.buttonTextColor,
                  }}
                  onClick={() => handleOnClickCategory("")}
                >
                  <Typography.Text
                    ellipsis={{ rows: 1 }}
                    style={{
                      color: categoryId ? colorGroupBlogHeader?.textColor : colorGroupBlogHeader?.buttonTextColor,
                      border: `1px solid ${colorGroupBlogHeader?.buttonBorderColor ?? "#DB4D29"}`,
                      borderRadius: 12,
                      padding: 12,
                      backgroundColor: colorGroupBlogHeader?.buttonBackgroundColor ?? "#fff",
                    }}
                  >
                    {(isCustomize || blogCategories.length > 0) && translateData.all}
                  </Typography.Text>
                </Row>
              </SwiperSlide>
            ) : (
              <Row
                className={`category-item ${categoryId ? "" : "category-item-default"}`}
                style={{
                  color: categoryId ? colorGroupBlogHeader?.textColor : colorGroupBlogHeader?.buttonTextColor,
                }}
                onClick={() => handleOnClickCategory("")}
              >
                <StyledCategoryName>
                  {(isCustomize || blogCategories.length > 0) && translateData.all}
                </StyledCategoryName>
              </Row>
            )}

            {isCustomize ? (
              mockupPostCategory?.map((category) => (
                <Row
                  key={category?.id}
                  className="category-item"
                  style={{
                    color:
                      category?.id === +categoryId
                        ? colorGroupBlogHeader?.buttonTextColor
                        : colorGroupBlogHeader?.textColor,
                  }}
                  onClick={() => handleOnClickCategory(+category?.id)}
                >
                  <StyledCategoryName>{category?.name}</StyledCategoryName>
                </Row>
              ))
            ) : blogCategories.length > 0 ? (
              blogCategories?.map((category) => {
                if (isMaxWidth1199) {
                  return (
                    <SwiperSlide key={category?.id} noSwiping={true} noSwipingClass="swiper-no-swiping">
                      <Row
                        key={category?.id}
                        className={`category-item swiper-blog-list-theme2 ${
                          category?.id === categoryId ? "active" : ""
                        }`}
                        onClick={() => handleOnClickCategory(category?.id)}
                      >
                        <Typography.Text
                          ellipsis={{ rows: 1 }}
                          style={{
                            color:
                              category?.id === categoryId
                                ? colorGroupBlogHeader?.buttonTextColor
                                : colorGroupBlogHeader?.textColor,
                            border: `1px solid ${colorGroupBlogHeader?.buttonBorderColor ?? "#DB4D29"}`,
                            borderRadius: 12,
                            padding: 12,
                            backgroundColor: colorGroupBlogHeader?.buttonBackgroundColor ?? "#fff",
                          }}
                        >
                          {category?.name}
                        </Typography.Text>
                      </Row>
                    </SwiperSlide>
                  );
                } else {
                  return (
                    <Row
                      key={category?.id}
                      className={`category-item swiper-blog-list-theme2 ${category?.id === categoryId ? "active" : ""}`}
                      style={{
                        color:
                          category?.id === categoryId
                            ? colorGroupBlogHeader?.buttonTextColor
                            : colorGroupBlogHeader?.textColor,
                      }}
                      onClick={() => handleOnClickCategory(category?.id)}
                    >
                      <StyledCategoryName>
                        <Tooltip placement="topLeft" title={category.name} color={colorGroupBlogHeader?.textColor}>
                          {category?.name}
                        </Tooltip>
                      </StyledCategoryName>
                    </Row>
                  );
                }
              })
            ) : (
              <Row className="category-item">{translateData.noCategory}</Row>
            )}
          </Row>
        </Swiper>
      </Col>
    </Row>
  );
};

export default PostCategory;
