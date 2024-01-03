const user = require('../model/user');
const bcrypt = require('bcrypt');
const session = require('express-session');

class checkAcc {
  async loginCheck(req, res) {
    try {
      const { username, password } = req.body;

      // Kiểm tra xem username có tồn tại trong database không
      const foundUser = await user.findOne({ username });

      if (!foundUser) {
        return res.status(200).render('login/login', { errorMessage: 'Tài khoản hoặc mật khẩu không chính xác', layout: 'mainGuess' });
    }

      // Kiểm tra xem password đã băm có khớp không
      const isPasswordValid = await bcrypt.compare(password, foundUser.password);

      if (!isPasswordValid) {
        return res.status(200).render('login/login', { errorMessage: 'Tài khoản hoặc mật khẩu không chính xác',layout:'mainGuess' });
    }
    req.session.user = foundUser;

      // Nếu username và password đều đúng, thực hiện chuyển hướng (redirect)
      res.redirect(`/loged-in/${foundUser._id}`);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }



  async registerAcc(req, res, next) {
    try {
      const { username } = req.body;
  
      // Check if the username already exists in the database
      const existingUser = await user.findOne({ username });
  
      if (existingUser) {
        // Username already exists, return an error response
        return res.render('login/dangky',{errorMessage: 'Tên đăng nhập đã tồn tại',layout:'mainGuess' })
      }
  
      // If username is unique, create a new user and save it
      const newUser = new user(req.body);
      await newUser.save();
  
      res.redirect('/login');
    } catch (error) {
      console.error(error);
  
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => err.message);
        res.status(400).json({ error: 'Validation Error', details: validationErrors });
      } else {
        console.error('Unhandled error:', error);
        next(error);
      }
    }
  }
  
  


}

module.exports = new checkAcc();
