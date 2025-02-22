const mongoose = require("mongoose");

// const OrderSchema = mongoose.model(
//   "order",
//   new mongoose.Schema({
//     orderid: String,
//     selected: Object,
//   })
// );

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    selected: {
        type: Object,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'completed' // Default to completed since we're skipping payment
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);

// Save an order in progress throught RazorPay
module.exports.saveOrder = async function (orderid, selected) {
  await orderSchema.create({ orderid: orderid, selected: selected });
};

// Get a saved order to update the user after successful payment
module.exports.getOrder = async function (orderid) {
  const orderObj = await OrderSchema.findOne({ orderid: orderid });
  return orderObj;
};
