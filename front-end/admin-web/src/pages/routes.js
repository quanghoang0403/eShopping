import PageNotFound from './page-not-found/page-not-found.component'

// Loop through all the folder in pages and collect all the route.js files
// and add them to the routes array.
let routes = []
const context = require.context('./', true, /route.js$/)
context.keys().forEach((path) => {
  const objRoutes = context(`${path}`).default
  if (objRoutes && objRoutes.length > 0) {
    objRoutes.forEach((route) => {
      routes.push(route)
    })
  } else {
    routes.push(objRoutes)
  }
})

routes = routes.sort((a, b) => a.position - b.position)
const uniqueRoutes = [...new Set(routes)]
routes = uniqueRoutes

const pageNotFoundRoute = {
  key: 'app.pageNoteFound',
  position: 0,
  path: '',
  name: 'Page not found',
  isMenu: false,
  exact: true,
  auth: false,
  permission: 'public',
  component: PageNotFound,
  child: []
}

routes.push(pageNotFoundRoute)

export default routes
