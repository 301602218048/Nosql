const express = require("express");
const db = require("./utils/db-connection");
const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const PremiumRoutes = require("./routes/premiumRoutes");
const passwordRoutes = require("./routes/passwordRoutes");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
db();

//models
require("./models");

const app = express();

app.use(express.static(path.join(__dirname, "..", "frontend")));

app.use(cors());
app.use(express.json());
app.use("/user", userRoutes);
app.use("/premium", PremiumRoutes);
app.use("/pay", paymentRoutes);
app.use("/expenses", expenseRoutes);
app.use("/password", passwordRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`);
});
