const food = require('../model/food');
const bill = require('../model/bill')
const billHistory = require('../model/billHistory'); // Đường dẫn đến model của bảng billHistory

class admin1Controller {
  home(req,res){
    bill.find({})
    .then(bills => {
        res.render('admin/adminCartNow', { layout: 'admin-layout', bills });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
  }
  ///chi tiết đơn
  detailBill(req, res) {
    bill.find({ slug: req.params.slug })
    .then(bills => {
      res.render('admin/detailBill', { layout:'admin-layout',bills });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
  }

  detailBillHistory(req, res) {
    billHistory.find({ slug: req.params.slug })
    .then(billhstrs => {
      res.render('admin/detaillBillHistory', { layout:'admin-layout',billhstrs });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
  }

  // GET HOME ( Danh sach don hang dang dat)
   //[GET] danh sach thuc don
  
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

  deletedBillHistory(req,res,next){
    billHistory.deleteOne({_id: req.params.id})
    .then(() => res.redirect('back'))
    .catch(err => {
      console.error(err);
      next(err); // Chuyển lỗi đến middleware xử lý lỗi tiếp theo (nếu có)
    });
  }

  //[DELETE]  ------> Done bill
  async doneBill(req, res, next) {
    try {
      // Lấy thông tin đơn hàng cần xóa từ bảng bill
      const deletedBill = await bill.findOneAndDelete({ _id: req.params.id });
  
      // Nếu đơn hàng được xóa thành công, tạo một bản ghi mới trong bảng billHistory
      if (deletedBill) {
        const billHistoryData = {
          buyerName: deletedBill.buyerName,
          buyerPhone: deletedBill.buyerPhone,
          totalAmount: deletedBill.totalAmount,
          orderDate: deletedBill.orderDate,
          orderItems: deletedBill.orderItems, 
          userId: deletedBill.userId
          // Thêm thông tin orderItems
          // Các trường khác nếu có
        };
  
        // Tạo bản ghi mới trong bảng billHistory
        const newBillHistory = new billHistory(billHistoryData);
        await newBillHistory.save();
  
        // Chuyển hướng về trang trước đó hoặc trang khác
        res.redirect('back');
      } else {
        // Xử lý trường hợp đơn hàng không tồn tại hoặc không thể xóa
        res.status(404).send('Không tìm thấy đơn hàng để xóa.');
      }
    } catch (err) {
      console.error(err);
      next(err); // Chuyển lỗi đến middleware xử lý lỗi tiếp theo (nếu có)
    }
  }
  



  loginForm(req,res){
    res.render('admin/login', { layout: 'layoutlogin' });
  }
  loginCheck(req, res) {
    console.log('OK')
    const { username, password } = req.body;
  
    // Kiểm tra tên đăng nhập và mật khẩu
    if (username === "admin" && password === "admin") {
      bill.find({})
      .then(bills => {
          res.render('admin/adminCartNow', { layout: 'admin-layout', bills });
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Internal Server Error');
      });
    }
       else {
      // Nếu sai, trả về thông báo lỗi
          res.json('email')
    }
  } 
  historyBill(req,res){
    billHistory.find({})
    .then(billhstrs => {
       res.render('admin/adminHistoryBills', { layout: 'admin-layout', billhstrs });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
  }
 
}
  


module.exports = new admin1Controller();
