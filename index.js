const express = require("express");
const app = express();
const cors = require("cors")
const router = require('./routes/index')
const port = process.env.PORT || 5000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
app.use("/api/v1", router)
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.listen(port, () => {
  console.log(`server started at port ${port}`);
});
