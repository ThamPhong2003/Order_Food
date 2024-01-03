const food = require('../model/food');

class admin1Controller {

  // GET HOME ( Danh sach don hang dang dat)
  home(req, res) {
    res.render('admin/adminCartNow', { layout: 'admin-layout' });
  }

  //[GET] danh sach thuc don
  listFood(req, res) {
    food.find({})
      .then(foods => {
        res.render('admin/adminListFood', { layout: 'admin-layout', foods });
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Internal Server Error');
      });
  }

  
  //[GET] /admin/update ---> UI list thực đơn
  creatFood(req, res) {
    res.render('admin/adminCreat', { layout: 'admin-layout' });
  }


  //[GET] /admin/:id/editFood ---> UI sửa thực đơn
  editFood(req, res, next) {
    food.findById(req.params.id)
        .then(food => res.render('admin/adminEditFood', { layout: 'admin-layout', food }))  // Thay vì foods, sử dụng food
        .catch(next);
}

  //[POST] /admin/addFood --> tạo thực đơn
  async addFood(req, res, next) {
    try {
      const newFood = new food(req.body);
      await newFood.save();
      res.redirect('/admin/ListFood');
    } catch (error) {
      console.error(error);
  
      if (error.name === 'ValidationError') {
        // Nếu là lỗi Validation, trả về JSON chứa danh sách lỗi chi tiết
        const validationErrors = Object.values(error.errors).map(err => err.message);
        res.status(400).json({ error: 'Validation Error', details: validationErrors });
      } else {
        // Nếu là lỗi khác, log lỗi và chuyển tiếp cho middleware xử lý lỗi tiếp theo
        console.error('Unhandled error:', error);
        next(error);
      }
    }
  }
  //[PUT] ----> update food
  updateFood(req, res, next) {
    food.updateOne({ _id: req.params.id }, req.body )
      .then(() => res.redirect('/admin/listFood'))
      .catch(err => {
        console.error(err);
        next(err); // Chuyển lỗi đến middleware xử lý lỗi tiếp theo (nếu có)
      });
  }

  //[DELETE]  ------> xóa food
  deleteFood(req,res,next){
    food.deleteOne({_id: req.params.id})
    .then(() => res.redirect('back'))
    .catch(err => {
      console.error(err);
      next(err); // Chuyển lỗi đến middleware xử lý lỗi tiếp theo (nếu có)
    });
  }
  
  
}

module.exports = new admin1Controller();
