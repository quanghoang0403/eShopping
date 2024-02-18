import Index from "../../../index";
import { useState } from "react";
import { BlogListBannerComponent } from "./components/blog-list-banner.component";
import { BlogListContentComponent } from "./components/blog-list-content.component";
import { theme1ElementCustomize, theme1IdScrollView } from "../../../constants/store-web-page.constants";
export default function BlogListPage(props) {
  const { clickToFocusCustomize, isCustomize } = props;
  return (
    <Index
      {...props}
      contentPage={(props) => {
        return (
          <>
            <div
              id={"themeHeaderBlogList"}
              onClick={() => {
                if (clickToFocusCustomize) clickToFocusCustomize(theme1ElementCustomize.HeaderBlogList);
              }}
            >
              <BlogListBannerComponent {...props} />
            </div>
            <div
              id={"themeBlogListBlog"}
              onClick={() => {
                if (clickToFocusCustomize) clickToFocusCustomize(theme1ElementCustomize.BlogListBlog);
              }}
            >
              <BlogListContentComponent {...props} />
            </div>
          </>
        );
      }}
    />
  );
}
