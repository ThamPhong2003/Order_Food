const food = require('../model/food');
const user = require('../model/user');

class siteController {
  async home(req, res) {
    try {
      // Sử dụng Promise.all để chờ cả hai truy vấn hoàn tất
      const [foods, users] = await Promise.all([
        food.find({}),
        user.find({})
      ]);
      
      // Lưu dữ liệu vào session
      req.session.foods = foods;
      req.session.users = users;
      
      // Render view và truyền cả dữ liệu từ foods và users, cũng như thông tin người dùng
      res.render('user/homeLogin', { foods, users, currentUser: req.session.user });
      
    } catch (err) {
      // Xử lý lỗi nếu có
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }

  async product(req, res) {
    try {
      // Sử dụng Promise.all để chờ cả hai truy vấn hoàn tất
      const [foods, users] = await Promise.all([
        food.find({slug: req.params.slug}),
        user.find({})
      ]);
      
      // Lưu dữ liệu vào session
      req.session.foods = foods;
      req.session.users = users;
      
      // Render view và truyền cả dữ liệu từ foods và users, cũng như thông tin người dùng
      res.render('user/productLogin', { foods, users, currentUser: req.session.user });
      
    } catch (err) {
      // Xử lý lỗi nếu có
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }



  async cart(req, res) {
    try {
     // Sử dụng Promise.all để chờ cả hai truy vấn hoàn tất
     const [foods, users] = await Promise.all([
      food.find({}),
      user.find({})
    ]);
    
    // Lưu dữ liệu vào session
    req.session.foods = foods;
    req.session.users = users;
    
    // Render view và truyền cả dữ liệu từ foods và users, cũng như thông tin người dùng
    res.render('cart', { foods, users, currentUser: req.session.user });
      
    } catch (err) {
      // Xử lý lỗi nếu có
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }
}
module.exports = new siteController();
