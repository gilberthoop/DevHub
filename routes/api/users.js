const express = require("express");
const router = express.Router();

// @route   GET api/users/test
// @dec     Test users route
// @access  Public
router.get("/test", (req, res) =>
  res.json({ message: "Hello world from USers API" })
);

module.exports = router;
