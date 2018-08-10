const express = require("express");
const router = express.Router();

// @route   GET api/posts/test
// @dec     Test posts route
// @access  Public
router.get("/test", (req, res) =>
  res.json({ message: "Hello world from Posts API" })
);

module.exports = router;
