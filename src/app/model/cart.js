const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carts = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  items: [
    {
      food: { type: Schema.Types.ObjectId, ref: 'foods' },
      quantity: { type: Number, default: 1 }
    }
  ]
});


module.exports = mongoose.model('cart', carts);

