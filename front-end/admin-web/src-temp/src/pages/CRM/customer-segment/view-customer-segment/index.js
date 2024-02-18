import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import customerSegmentDataService from "data-services/customer-segment/customer-segment-data.service";
import ViewCustomerSegment from "./view-customer-segment.page";

const mapDispatchToProps = () => {
  return {
    customerSegmentDataService: customerSegmentDataService,
  };
};

export default compose(withTranslation("translations"), connect(null, mapDispatchToProps), withRouter)(ViewCustomerSegment);
