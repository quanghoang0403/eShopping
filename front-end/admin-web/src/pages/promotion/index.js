import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PromotionPage from "./promotion.page";

const mapStateToProps = (state) => {
  return {
  };
};

const mapDispatchToProps = () => {
  return {
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter
)(PromotionPage);
