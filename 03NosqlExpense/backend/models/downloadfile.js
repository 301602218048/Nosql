const mongoose = require("mongoose");

const downloadfileSchema = new mongoose.Schema({
  fileUrl: { type: String, required: true },
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Downloadfile = mongoose.model("Downloadfile", downloadfileSchema);

module.exports = Downloadfile;
