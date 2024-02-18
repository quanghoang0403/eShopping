import { Tooltip } from "antd";
import "./styles.scss";
import {useHistory} from "react-router-dom";

export function BlogHyperlinkContainerComponent(props) {
	const { blogDetail, isCustomize, t, colorGroupBlogHeader, fontFamily } = props;
	const history = useHistory();
	const translatedData = {
		home: t("menu.home", "Trang chủ"),
		blog: t("blogDetail.blog", "Bài viết"),
	};

	const hyperlinkTypeConstant = {
		HOME: 1,
		BLOG: 2,
	};

	const handleRedirectHyperlink = (hyperlink) => {
		switch (hyperlink) {
			case hyperlinkTypeConstant.HOME:
				history.push(`/`);
				break;
			case hyperlinkTypeConstant.BLOG:
				history.push(`/blog`);
				break;
			default:
				break;
		}
	};

	return (
		<div className="hyperlink-container">
			<span className="cursor-pointer" onClick={() => handleRedirectHyperlink(hyperlinkTypeConstant.HOME)}>
        {translatedData.home}
      </span>
			<span className="ml-8">{">"}</span>
			<span className="ml-8 cursor-pointer" onClick={() => handleRedirectHyperlink(hyperlinkTypeConstant.BLOG)}>
        {translatedData.blog}
      </span>
			<span className="ml-8">{">"}</span>
			<Tooltip overlayInnerStyle={{ fontFamily }} placement="topRight" title={isCustomize ? "Lorem Ipsum" : blogDetail?.title}>
				<span className="ml-8 title-text" style={{ color: colorGroupBlogHeader?.titleColor }}>{isCustomize ? "Lorem Ipsum" : blogDetail?.title}</span>
			</Tooltip>
		</div>
	);
}
