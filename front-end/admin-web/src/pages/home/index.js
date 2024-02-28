import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import HomePage from './home.page'

const mapStateToProps = (state) => {
  return {
    getPrepareRegisterNewStoreDataAsync: null
  }
}

const mapDispatchToProps = () => {
  return {
    orderDataService: null
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter
)(HomePage)
