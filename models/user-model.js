const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  fullname: String,
  email: String,
  password: String,
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
  ],
  orders: {
    type: Array,
    default: [],
  },
  contact: Number,
  picture: {
    type:Buffer,
    default:"",
  },
});

module.exports = mongoose.model('user', userSchema);