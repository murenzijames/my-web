const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.json({
    message: "Hello, World!",
    status: "success",
  });
});

app.get("/about", (req, res) => {
  res
    .status(200)
    .type("text")
    .send("About Page\nMy name is Shumbusho Irumva\n");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    timestamp: new Date().toISOString(),
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
