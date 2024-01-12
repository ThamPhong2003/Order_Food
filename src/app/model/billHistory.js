const mongoose = require('mongoose');
const slugify = require('slugify');
const moment = require('moment');

const orderItemSchema = new mongoose.Schema({
  foodName: String,
  foodQuantity: Number,
  price: Number,
});

const billHisory = new mongoose.Schema({
  orderDate: {
    type: Date,
    default: Date.now,
    get: (value) => moment(value).format("HH:mm:ss       /      DD-MM-YYYY"), // Định dạng ngày giờ khi lấy dữ liệu
  },
  orderItems: [orderItemSchema],
  buyerName: String,
  buyerPhone: String,
  totalAmount: {
    type: Number,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  userId:String

});

// Middleware để tạo slug trước khi lưu vào cơ sở dữ liệu
billHisory.pre('save', function (next) {
  this.slug = slugify(moment(this.orderDate).format("HH:mm:ss       /      DD-MM-YYYY") + '-' + this.buyerName, { lower: true });
  next();
});

module.exports = mongoose.model('billHisory', billHisory);
