import Index from "../../../index";
import { BlogDetailContentComponent } from "./components/blog-detail-content.component";

export default function BlogDetailPage(props) {
  const { isCustomize } = props;
  return (
    <Index
      {...props}
      contentPage={(props) => {
        return (
          <>
            <BlogDetailContentComponent {...props} isCustomize={isCustomize} />
          </>
        );
      }}
    />
  );
}
