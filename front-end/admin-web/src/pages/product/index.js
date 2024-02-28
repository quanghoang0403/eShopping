import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ProductPage from './product.page'

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = () => {
  return {
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter
)(ProductPage)
