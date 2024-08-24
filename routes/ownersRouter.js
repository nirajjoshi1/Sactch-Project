const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner-model");

// Only allow creation of a new owner in development environment
if (process.env.NODE_ENV === "development") {
  router.post("/create", async function (req, res) {
    try {
      let owners = await ownerModel.find();
      if (owners.length > 0) {
        return res
          .status(403)
          .send("You don't have permission to create a new owner.");
      }

      let { fullname, email, password } = req.body;
      let createdOwner = await ownerModel.create({
        fullname,
        email,
        password,
      });
      res.status(201).send("New owner created successfully.");
    } catch (error) {
      console.error("Error creating owner:", error);
      res.status(500).send("An error occurred while creating a new owner.");
    }
  });
}

// Admin page route
router.get("/admin", function (req, res) {
  let success = req.flash("success");
  res.render("createproducts", { success });
});

module.exports = router;
