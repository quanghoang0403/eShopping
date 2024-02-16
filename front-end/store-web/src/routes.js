// Loop through all the folder in pages and collect all the route.js files
// and add them to the routes array.
let routes = [];
const context = require.context("./", true, /route.js$/);
context.keys().forEach((path) => {
  let objRoutes = context(`${path}`).default;
  if (objRoutes && objRoutes.length > 0) {
    objRoutes.forEach((route) => {
      routes.push(route);
    });
  } else {
    routes.push(objRoutes);
  }
});

routes = routes.sort((a, b) => a.position - b.position);
var uniqueRoutes = [...new Set(routes)];
routes = uniqueRoutes;

export default routes;
