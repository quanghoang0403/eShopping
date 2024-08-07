import { compose } from 'redux'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { withRouter } from 'react-router-dom'
import DetailCustomerPage from './detail-customer.page'
import customerDataService from 'data-services/customer/customer-data.service'

const mapDispatchToProps = () => {
  return {
    customerDataService
  }
}

export default compose(withTranslation('translations'), connect(null, mapDispatchToProps), withRouter)(DetailCustomerPage)
