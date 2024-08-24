const mongoose = require("mongoose");

const ownerSchema = mongoose.Schema({
  fullname: {
    type: String,
    required: true, // Ensures the fullname is provided
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures the email is unique across owners
    lowercase: true, // Convert email to lowercase before saving
    trim: true, // Trim whitespace from email
  },
  password: {
    type: String,
    required: true, // Ensures the password is provided
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Assuming you have a Product model
    },
  ],
  picture: {
    type: String,
    default: "", // Default to an empty string if no picture is provided
  },
  gstin: {
    type: String,
    default: "", // Default to an empty string if no GSTIN is provided
  },
});

module.exports = mongoose.model("Owner", ownerSchema);
