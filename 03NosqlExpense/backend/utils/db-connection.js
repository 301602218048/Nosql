const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose.connect(`mongodb://localhost:27017/expenseTrackerApp`).then(() => {
    console.log(`Database connected `);
  });
};

module.exports = connectDB;
