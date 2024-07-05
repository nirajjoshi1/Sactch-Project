const express = require("express");
const router = express.Router();
const productModel = require("../models/product-model");
const upload = require("../config/multer-config");

router.post("/create", upload.single("image"), async function (req, res) {
  try {
    let { name, price, discount, panelcolor, bgcolor, textcolor } = req.body;
    let product = await productModel.create({
      image: req.file.buffer,
      name,
      price,
      discount,
      panelcolor,
      bgcolor,
      textcolor,
    });
    req.flash("success", "Product Uploaded Sucessfully");
    res.redirect("/owners/admin");
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
