const express = require("express");
const router = express.Router();
const isloggedin = require("../middlewares/isLoggedIn");
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
  let user = await userModel
    .findOne({ email: req.user.email })
    .populate("cart");
    let bill = Number(user.cart.price) + 20 - Number(user.cart.discount);
  res.render("cart", { user, bill});
});
router.get("/account", async function (req, res) {

  res.render("account");
});

router.get("/addtocart/:productid", isloggedin, async function (req, res) {
  let user = await userModel.findOne({ email: req.user.email });
  user.cart.push(req.params.productid);
  await user.save();
  req.flash("success", "Added To Cart");
  res.redirect("/shop");
});

module.exports = router;
