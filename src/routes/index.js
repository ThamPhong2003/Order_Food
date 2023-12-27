const siteRouter = require('./site');
const admin1Router = require('./admin1');



function route(app) {
    //admin
    app.use('/admin', admin1Router);

    //user
    app.use('/', siteRouter);

  }

  module.exports = route;