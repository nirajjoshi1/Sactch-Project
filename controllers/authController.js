const { generateToken } = require("../utils/generateToken");
const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.registerUser = async function (req, res) {
  try {
    let { email, fullname, password } = req.body;
    let user = await userModel.findOne({ email: email });
    if (user) {
      req.flash("error", "User Already Exists, Please Login");
      return res.redirect("/");
    }
    else {
      res.redirect("/shop");
    }

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        if (err) return res.send(err.message);
        else {
          let user = await userModel.create({
            email,
            fullname,
            password: hash,
          });

          let token = generateToken(user);
          res.cookie("token", token);
        }
      });
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports.loginUser = async function (req, res) {
  let { email, password } = req.body;
  let user = await userModel.findOne({ email });
  if (!user) {
    req.flash("error", "Email Or Password Incorrect");
    return res.redirect("/");
  }
  bcrypt.compare(password, user.password, function (err, result) {
    if (result) {
      let token = generateToken(user);
      res.cookie("token", token);
      res.redirect("/shop");
    } else {
      req.flash("error", "Email Or Password Incorrect");
      return res.redirect("/");
    }
  });
};

module.exports.logout = function (req, res) {
  res.cookie("token", "");
  res.redirect("/");
};
