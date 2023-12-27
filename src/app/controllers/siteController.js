const food = require('../model/food');

class siteController {
  home(req, res) {
    food.find({})
      .then(foods => {
        // Render the 'home' view and pass the 'foods' data
        res.render('home', { foods });
      })
      .catch(err => {
        // Handle error if any
        console.error(err);
        res.status(500).send('Internal Server Error');
      });
  }

  
  
}

module.exports = new siteController();
