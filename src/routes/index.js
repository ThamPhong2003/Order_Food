const siteRouter = require('./site');
const siteGuessRouter = require('./siteGuess');
const admin1Router = require('./admin1');
const loginCheckController = require('./loginCheck')
const register = require('./register')
const addToCart = require('./api')
function route(app) {
    
    /// router admin
    app.use('/admin', admin1Router);

    //user đăng nhập rồi
    app.use('/loged-in', siteRouter);

    ////đăng ký acc
    app.use('/register' ,register)

    /// check login
    app.use('/login-check',loginCheckController)

    //user khách
    app.use('/', siteGuessRouter);

    //add to cart
    app.use('/api', addToCart);

    
}
module.exports = route;
