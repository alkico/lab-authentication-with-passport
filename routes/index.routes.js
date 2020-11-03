const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  if (req.user) {
    req.logout()
  }
  res.render("index");
});

module.exports = router;
