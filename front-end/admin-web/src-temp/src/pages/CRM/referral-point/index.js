import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import customerDataService from "data-services/customer/customer-data.service";
import ReferralPointConfiguration from "./referral-point-configuration.page";

const mapDispatchToProps = () => {
  return {
    customerDataService: customerDataService,
  };
};

export default compose(
  withTranslation("translations"),
  connect(null, mapDispatchToProps),
  withRouter
)(ReferralPointConfiguration);
