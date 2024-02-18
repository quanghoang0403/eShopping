import { Spin } from "antd";
const ProductListCategoryLoadingComponent = ({ isLoading = false }) => {
  if (!isLoading) return null;
  return (
    <div style={{ position: "absolute", left: 50, display: "flex", justifyContent: "center" }}>
      <Spin size={"small"} />
      <span style={{ marginLeft: 10, fontSize: 14 }}>Loading...</span>
    </div>
  );
};
export default ProductListCategoryLoadingComponent;
