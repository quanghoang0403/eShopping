import MyAccountPage from './my-account-page'

// Define the route
const route = [
  {
    key: 'app.myAccount',
    position: 0,
    path: '/my-account',
    name: 'MyAccount',
    isMenu: false,
    exact: false,
    auth: true,
    permission: 'public',
    component: MyAccountPage,
    child: []
  }
]
export default route
