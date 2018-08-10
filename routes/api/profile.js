const express = require("express");
const router = express.Router();

router.get("/test", (req, res) =>
  res.json({ message: "Hello world from Profile API" })
);

module.exports = router;
