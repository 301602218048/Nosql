const express = require("express");
const dotenv = require("dotenv");
const { mongoConnect } = require("./utils/db-connect");
const User = require("./models/user");
const Product = require("./models/product");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
dotenv.config();

const app = express();

app.use(express.json());

app.use("/user", userRoutes);
app.use("/product", productRoutes);

const port = process.env.PORT || 3000;
(async () => {
  try {
    await mongoConnect();
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to start server due to DB connection error.");
    process.exit(1);
  }
})();
