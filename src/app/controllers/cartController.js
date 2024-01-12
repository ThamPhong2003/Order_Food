const cart = require('../model/cart');
const food = require('../model/food')
const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;
const Bill = require('../model/bill');

class cartController {

  //
   clearCart(req, res) {
    const userId = req.params.id;
  
    console.log('Clearing cart for user:', userId);
  
    cart.findOneAndDelete({ userId: userId })
      .then(() => {
        console.log('Cart cleared successfully');
        res.status(200).json({ message: 'Giỏ hàng đã được xóa thành công', userId: userId });
      })
      .catch((error) => {
        console.error('Lỗi xóa giỏ hàng:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi xóa giỏ hàng' });
      });
  }
  

  async addCart(req, res) {
    try {
      // Trong controller khi thêm món ăn vào giỏ
      const { userId, foodId, quantity } = req.body;
  
      // Kiểm tra giỏ hàng đã tồn tại cho người dùng hay chưa
      let carts = await cart.findOne({ userId });
  
      // Nếu giỏ hàng không tồn tại, tạo mới
      if (!carts) {
        console.log('Creating a new cart for user:', userId);
        carts = await cart.create({ userId, items: [] });
      }
  
      // Kiểm tra món ăn đã có trong giỏ hàng hay chưa
      const existingItemIndex = carts.items.findIndex(item => item.food.equals(foodId));
  
      // Nếu món ăn đã có trong giỏ hàng, cập nhật số lượng
      if (existingItemIndex !== -1) {
        carts.items[existingItemIndex].quantity += quantity || 1;
      } else {
        // Nếu món ăn chưa có trong giỏ hàng, thêm mới
        const foodItem = await food.findById(foodId);
        if (foodItem) {
          carts.items.push({ food: foodItem, quantity });
        }
      }
  
      // Lưu giỏ hàng
      await carts.save();
  
      res.json({ success: true, message: 'Item added to cart' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
 
  async deleteFood(req, res) {
    try {
      const foodId = req.params.id;
      console.log(foodId)
      // Kiểm tra xem foodId có hợp lệ không
      if (!ObjectId.isValid(foodId)) {
        console.log('Invalid foodId');
        return res.status(400).json({ success: false, message: 'Invalid foodId' });
      }
  
      // Chuyển foodId thành đối tượng ObjectId
      const objectId = new ObjectId(foodId);
  
      // Thực hiện xóa món ăn từ giỏ hàng
      const result = await cart.updateOne({ 'items.food': objectId }, { $pull: { items: { food: objectId } } });
  
      // Kiểm tra xem món ăn đã được xóa thành công hay không
     res.redirect('back')
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }



  async  order(req, res) {
    try {
      const { orderItems, buyerName, buyerPhone, totalAmount,userId} = req.body;

      // Tạo một đơn hàng mới từ dữ liệu nhận được
      const newBill = new Bill({
        orderItems,
        buyerName,
        buyerPhone,
        totalAmount,
        userId
      });
  
      // Lưu đơn hàng vào cơ sở dữ liệu
      const savedOrder = await newBill.save();
  
      res.status(201).json(savedOrder);
    } catch (error) {
      console.error('Lỗi khi lưu đơn hàng:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  

}
module.exports = new cartController();
