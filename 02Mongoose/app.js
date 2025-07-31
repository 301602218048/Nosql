const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./utils/db-connect");
const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");
const cartRouter = require("./routes/cartRoutes");
const Product = require("./models/product");

connectDB();

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/product", productRouter);
app.use("/user", userRouter);
app.use("/cart", cartRouter);

app.listen(PORT, () => {
  console.log(`server is running on PORT ${PORT}`);
});
