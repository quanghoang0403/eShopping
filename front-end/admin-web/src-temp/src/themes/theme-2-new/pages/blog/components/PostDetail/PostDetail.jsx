import React, { memo, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import blogDataService from "../../../../../data-services/blog-data.service";
import { getStorage, localStorageKeys } from "../../../../../utils/localStorage.helpers";
import { ArrowLeftMemberOffer } from "../../../../assets/icons.constants";
import { mockupPostDetail } from "../MockupData/MockupData";
import PostContent from "../PostContent/PostContent";
import "./styles.scss";
import { Button } from "antd";
import { useTranslation } from "react-i18next";
import { EnumBlogName } from "../../../../constants/enum";

const PostDetail = (props) => {
  const params = useParams();
  const [t] = useTranslation();
  const translateData = {
    postBefore: t("blog.blogDetail.postBefore", "Bài sau"),
    postNext: t("blog.blogDetail.postNext", "Bài trước"),
  };
  const { isCustomize, colorGroupBlogHeader, fontFamily } = props;
  const jsonConfig = getStorage(localStorageKeys.STORE_CONFIG);
  const storeConfig = JSON.parse(jsonConfig);
  const storeId = storeConfig.storeId;
  const [postDetailData, setPostDetailData] = useState(null);
  const [disablePre, setDisablePre] = useState(false);
  const [disableNext, setDisableNext] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [postAfterBlog, setPostAfterBlog] = useState(null);
  const [postBeforeBlog, setPostBeforeBlog] = useState(null);

  const history = useHistory();

  const TYPE = {
    PRE: "pre",
    NEXT: "next",
  };

  useEffect(() => {
    if (isCustomize || !storeId || !params?.urlEncode) return;
    (async () => {
      try {
        setIsLoading(true);
        const response = await blogDataService.getBlogByIdAsync(params?.urlEncode);
        if (response?.data?.isSuccess) {
          setPostDetailData(response?.data?.blog);
          setPostAfterBlog(response?.data?.afterBlog);
          setPostBeforeBlog(response?.data?.beforeBlog);
        }
      } catch (error) {}
    })();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isCustomize || !storeId || !postDetailData?.id) return;
    (async () => {
      try {
        const response = await blogDataService.putCountBlogAsync({
          storeId,
          blogId: postDetailData?.id,
        });
      } catch (error) {}
    })();
  }, [postDetailData?.id]);

  const handleClickPost = (type) => {
    if (!type || isCustomize || isLoading) return;
    if (type === TYPE.NEXT) {
      if (!postAfterBlog?.urlEncode) return;
      history.replace("");
      history.push(`blog/${postAfterBlog?.urlEncode}`);
    }
    if (type === TYPE.PRE) {
      if (!postBeforeBlog?.urlEncode) return;
      history.replace("");
      history.push(`blog/${postBeforeBlog?.urlEncode}`);
    }
  };

  return (
    <div className="post-detail-theme2">
      {isCustomize ? (
        <>
          <PostContent
            data={mockupPostDetail}
            type={EnumBlogName.DETAIL_PAGE}
            colorGroupBlogHeader={colorGroupBlogHeader}
            isCustomize={isCustomize}
            fontFamily={fontFamily}
          />
          <div className="tag-list-theme2">
            <div className="tag-title">Tags:</div>
            {mockupPostDetail.blogTags.map((tag) => (
              <div key={tag.id} className="tag-blog-them2">
                {tag?.name}
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <PostContent
            data={postDetailData}
            type={EnumBlogName.DETAIL_PAGE}
            colorGroupBlogHeader={colorGroupBlogHeader}
            isCustomize={isCustomize}
            fontFamily={fontFamily}
          />
          <div className="tag-list-theme2">
            <div className="tag-title">Tags:</div>
            {postDetailData?.blogTags?.map((tag) => (
              <div key={tag.id} className="tag-blog-them2">
                {tag?.name}
              </div>
            ))}
          </div>
        </>
      )}
      <div className="btn">
        <Button disabled={disablePre} className="btn-blog-pre" onClick={() => handleClickPost(TYPE.PRE)}>
          <ArrowLeftMemberOffer />
          {translateData.postBefore}
        </Button>
        <Button disabled={disableNext} className="btn-blog-next" onClick={() => handleClickPost(TYPE.NEXT)}>
          {translateData.postNext}
          <ArrowLeftMemberOffer />
        </Button>
      </div>
    </div>
  );
};

export default memo(PostDetail);
