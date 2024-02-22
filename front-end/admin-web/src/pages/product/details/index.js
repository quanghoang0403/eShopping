import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ProductDetailPage from "./details-product.page";
// import productDataService from "data-services/product/product-data.service";

const mapDispatchToProps = () => {
  return {
    productDataService: null
  };
};

export default compose(
  connect(null, mapDispatchToProps),
  withRouter
)(ProductDetailPage);
