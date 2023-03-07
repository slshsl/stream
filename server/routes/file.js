const router = require("express").Router();
const path = require("path");

router.get("/:filename", (req, res) => {
  const filePath = path.resolve(__dirname, "../files", req.params.filename);
  res.sendFile(filePath, {
    headers: {
      "Content-Type": "application/octet-stream",
    },
  });
});

module.exports = router;
