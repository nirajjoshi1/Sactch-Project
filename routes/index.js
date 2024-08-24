const express = require("express");
const router = express.Router();
const isloggedin = require("../middlewares/isLoggedIn");
const upload = require('../config/multer-config'); // Adjust the path as needed
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");
const isLoggedIn = require("../middlewares/isLoggedIn");

router.get("/", function (req, res) {
  let error = req.flash("error");
  res.render("index", { error, loggedin: false });
});

router.get("/shop", isloggedin, async function (req, res) {
  let products = await productModel.find();
  let success = req.flash("success");
  res.render("shop", { products, success });
});



router.get("/cart", isloggedin, async function (req, res) {
  try {
    let user = await userModel
      .findOne({ email: req.user.email })
      .populate("cart"); // Assuming `cart` is an array of items.

    // Calculate the total bill
    let totalBill = 0;
    user.cart.forEach(item => {
      const itemTotal = Number(item.price) + 20 - Number(item.discount); // Calculate for each item
      totalBill += itemTotal; // Add to the total bill
    });

    // Render the cart view with the calculated total bill
    res.render("cart", { user, bill: totalBill.toFixed(2) });

  } catch (error) {
    console.error("Error retrieving cart:", error);
    res.status(500).send("An error occurred while retrieving your cart.");
  }
});




// Route to display user profile
router.get("/profile", isloggedin, async function (req, res) {
  try {
    let user = await userModel.findOne({ email: req.user.email });
    let update = req.flash("update");

    res.render("profile", { user, update });
  } catch (error) {
    console.error("Error retrieving profile:", error);
    res.status(500).send("An error occurred while retrieving the profile.");
  }
});

// Route to update user profile

router.post(
  "/update",
  isloggedin,
  upload.single("image"),
  async function (req, res) {
    try {
      const { fullname, contact } = req.body;
      const user = await userModel.findOne({ email: req.user.email });

      if (!user) {
        req.flash("error", "User not found.");
        return res.redirect("/profile");
      }

      // Update user profile information
      user.fullname = fullname || user.fullname;
      user.contact = contact || user.contact;

      // Handle profile image update
      if (req.file) {
        user.picture = req.file.buffer; // Save the buffer directly
      }

      await user.save();
      req.flash("update", "Profile updated successfully.");
      res.redirect("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).send("An error occurred while updating the profile.");
    }
  }
);

router.get("/addtocart/:productid", isloggedin, async function (req, res) {
  let user = await userModel.findOne({ email: req.user.email });
  user.cart.push(req.params.productid);
  await user.save();
  req.flash("success", "Added To Cart");
  res.redirect("/shop");
});

module.exports = router;
