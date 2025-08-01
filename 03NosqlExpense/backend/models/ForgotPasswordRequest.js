const mongoose = require("mongoose");

const ForgotPasswordSchema = new mongoose.Schema(
  {
    isActive: { type: Boolean, required: true, default: false },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ForgotPasswordRequests = mongoose.model(
  "ForgotPasswordRequests",
  ForgotPasswordSchema
);

module.exports = ForgotPasswordRequests;
