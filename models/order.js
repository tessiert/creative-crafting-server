const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    username: { type: String, required: true },
    order: { type: Schema.Types.Mixed, required: true },
    // payer: {
    //   firstName: { type: String, required: true},
    //   lastName: { type: String, required: true },
    //   address: {
    //     addressLine1: { type: String, required: true },
    //     adminArea1: { type: String },
    //     adminArea2: { type: String },
    //     postalCode: { type: String, required: true },
    //     email: { type: String, required: true },
    //     phone: { type: String }
    //   }
    // },
    // purchaseUnits: {
    //   shipping: { type: String, required: true },
    //   shippingDiscount: { type: String },
    // }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;