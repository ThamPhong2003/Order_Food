const food = require('../model/food');
const user = require('../model/user')
const { moongooseToObject } = require('../../util/mongose');

class siteGuessController {

  //UI cho Khách
  home(req, res) {
    food.find({})
      .then(foods => {
        // Render the 'home' view and pass the 'foods' data
        res.render('home',{layout:'mainGuess' ,foods });
      })
      .catch(err => {
        // Handle error if any
        console.error(err);
        res.status(500).send('Internal Server Error');
      });
  }
  
  //login site ----> UI đăng nhập
  loginSite(req,res) {
    res.render('login/login',{layout:'mainGuess'});
  }

////UI-------- Đăng ký tài khoản
  register(req,res){
    res.render('login/dangky',{layout:'mainGuess'});

  }


   product(req, res) {
  food.find({ slug: req.params.slug })
    .then(foods => {
      res.render('product', { layout:'mainGuess',foods });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
}

}
module.exports = new siteGuessController();
