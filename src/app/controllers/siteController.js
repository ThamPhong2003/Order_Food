const food = require('../model/food');
const user = require('../model/user');
const cart = require ('../model/cart')
const billHistory = require('../model/billHistory')
const bcrypt = require('bcrypt');

class siteController {



  /// -----> đổi passs
  async actionChangePass(req, res) {
    try {
        const userId = req.params.id;
        const { password, newPassword, confirmPassword } = req.body;

        // Lấy thông tin người dùng từ cơ sở dữ liệu
        const currentUser = await user.findOne({ _id: userId });

        // Kiểm tra mật khẩu hiện tại
        const isPasswordMatch = await bcrypt.compare(password, currentUser.password);
        if (!isPasswordMatch) {
          // Mật khẩu hiện tại không đúng
          req.session.passwordError = 'Incorrect current password';
          return res.redirect(`/loged-in/:id/infor/changePass`);
      }

        if (newPassword !== confirmPassword) {
            // Mật khẩu mới và xác nhận mật khẩu mới không khớp
            const errorMessage = 'New password and confirm password do not match';
            return res.status(400).render('user/', { errorMessage });
        }

        // Băm mật khẩu mới
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Cập nhật mật khẩu mới trong cơ sở dữ liệu
        await user.updateOne({ _id: userId }, { password: hashedNewPassword });

        // Lấy thông tin người dùng sau khi cập nhật
        const updatedUser = await user.findOne({ _id: userId });

        // Cập nhật session với thông tin mới
        req.session.user = updatedUser;

        // Chuyển hướng người dùng đến trang thông tin cá nhân
        res.redirect(`/loged-in/:id/infor`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}







  //PUT ____> đổi thông tin
  async actionChangeInfor(req, res) {
    try {
      // Thực hiện cập nhật thông tin người dùng
      await user.updateOne({ _id: req.params.id }, req.body);
  
      // Lấy thông tin người dùng sau khi cập nhật
      const updatedUser = await user.findOne({ _id: req.params.id });
  
      // Cập nhật session với thông tin mới
      req.session.user = updatedUser;
  
      // Chuyển hướng người dùng đến trang thông tin cá nhân
      res.redirect(`/loged-in/:id/infor`);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }



  async changePass(req, res) {
    try {
      // Sử dụng Promise.all để chờ cả hai truy vấn hoàn tất
      const [ users, allBillHistories] = await Promise.all([
        user.find({}),
        billHistory.find({})
      ]);
  
      // Lọc những hóa đơn có buyerName trùng với user.fullname
      const userBillHistories = allBillHistories.filter(history => history.buyerName === req.session.user.fullname);
  
      // Lưu dữ liệu vào session
      req.session.users = users;
      req.session.billHistories = userBillHistories;
  
      // Render view và truyền cả dữ liệu từ foods và users, cũng như thông tin người dùng
      res.render('user/changePass', {  users, currentUser: req.session.user, billHistories: userBillHistories });
    } catch (err) {
      // Xử lý lỗi nếu có
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }
  
  async changeInfor(req, res) {
    try {
      // Sử dụng Promise.all để chờ cả hai truy vấn hoàn tất
      const [ users, allBillHistories] = await Promise.all([
        user.find({}),
        billHistory.find({})
      ]);
  
      // Lọc những hóa đơn có buyerName trùng với user.fullname
      const userBillHistories = allBillHistories.filter(history => history.buyerName === req.session.user.fullname);
  
      // Lưu dữ liệu vào session
      req.session.users = users;
      req.session.billHistories = userBillHistories;
  
      // Render view và truyền cả dữ liệu từ foods và users, cũng như thông tin người dùng
      res.render('user/changeInfor', {  users, currentUser: req.session.user, billHistories: userBillHistories });
    } catch (err) {
      // Xử lý lỗi nếu có
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }
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

        // Lưu thông tin người dùng vào session
        req.session.currentUser = req.session.user;

        // Log để kiểm tra giá trị của currentUser
        console.log('currentUser:', req.session.currentUser);

        // Render view và truyền cả dữ liệu từ foods và users, cũng như thông tin người dùng
        res.render('user/homeLogin', { foods, users, currentUser: req.session.currentUser });
    
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
      if (!req.session.user || !req.session.user._id) {
        console.error('User information not available');
        res.status(500).send('Internal Server Error');
        return;
      }
  
      const userId = req.session.user._id;
      const userCart = await cart.findOne({ userId: userId }).populate('items.food').catch(err => console.error(err));
  
      if (!userCart) {
        const newCart = await cart.create({ userId: userId, items: [] });
        console.log('New Cart:', newCart); // Log here
        return res.render('user/cart', { userCart: newCart, currentUser: req.session.user });
      }
  
      console.log('User Cart:', userCart.items); // Log here
  
      res.render('user/cart', { userCart, currentUser: req.session.user });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }
  
  async infor(req, res) {
    try {
      // Sử dụng Promise.all để chờ cả hai truy vấn hoàn tất
      const [ users, allBillHistories] = await Promise.all([
        user.find({}),
        billHistory.find({})
      ]);
  
      // Lọc những hóa đơn có buyerName trùng với user.fullname
      const userBillHistories = allBillHistories.filter(history => history.userId === req.session.user._id);
  
      // Lưu dữ liệu vào session
      req.session.users = users;
      req.session.billHistories = userBillHistories;
  
      // Render view và truyền cả dữ liệu từ foods và users, cũng như thông tin người dùng
      res.render('user/infor', {  users, currentUser: req.session.user, billHistories: userBillHistories });
    } catch (err) {
      // Xử lý lỗi nếu có
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }
  
  
  async historybill(req, res) {
    try {
      // Sử dụng Promise.all để chờ cả hai truy vấn hoàn tất
      const [users,billHistories] = await Promise.all([
        user.find({}),
        billHistory.find({slug: req.params.slug})
      ]);
      // Lưu dữ liệu vào session
      req.session.users = users;
      req.session.billHistories = billHistories;

      // Render view và truyền cả dữ liệu từ foods và users, cũng như thông tin người dùng
      res.render('user/userHistoryBill', {users, currentUser: req.session.user,billHistories});
    } catch (err) {
      // Xử lý lỗi nếu có
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }
  
}

module.exports = new siteController();
