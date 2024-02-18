import Index from "../../index";
import PageDetailComponent from "./components/page-detail.component";

export default function ProductDetailPage(props) {
  const { isCustomize } = props;
  return (
    <Index
      {...props}
      contentPage={(props) => {
        return (
          <>
            <PageDetailComponent {...props} isCustomize={isCustomize} />
          </>
        );
      }}
    />
  );
}
