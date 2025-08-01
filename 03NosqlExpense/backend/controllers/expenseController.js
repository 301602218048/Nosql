const Expense = require("../models/expense");
const User = require("../models/user");
const DownloadFile = require("../models/downloadfile");
const mongoose = require("mongoose");
const s3Service = require("../services/s3Service");

const addExpense = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { amount, category, desc, note } = req.body;

    const expense = await Expense.create(
      [
        {
          amount: parseInt(amount),
          description: desc,
          category,
          userId: req.user._id,
          note,
        },
      ],
      { session }
    );

    const user = await User.findById(req.user._id).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ msg: "User not found", success: false });
    }

    if (category !== "salary") {
      user.totalExpense += parseInt(amount);
      await user.save({ session });
    }

    await session.commitTransaction();
    res.status(201).json({
      msg: `Amount for ${category} successfully added`,
      success: true,
      data: expense[0],
    });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    res.status(500).json({ msg: error.message, success: false });
  } finally {
    session.endSession();
  }
};

const getAllExpense = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id });

    if (!expenses.length) {
      return res
        .status(404)
        .json({ msg: "No expense in database", success: false });
    }

    res.status(200).json({
      msg: "Here is the list of all expenses",
      success: true,
      data: expenses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message, success: false });
  }
};

const getPageExpense = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1;

    const totalCounts = await Expense.countDocuments({ userId: req.user._id });

    if (totalCounts === 0) {
      return res.status(404).json({ msg: "No expense found" });
    }

    const expenses = await Expense.find({ userId: req.user._id })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      CURRENT_PAGE: page,
      HAS_NEXT_PAGE: limit * page < totalCounts,
      NEXT_PAGE: page + 1,
      HAS_PREVIOUS_PAGE: page > 1,
      PREVIOUS_PAGE: page - 1,
      LAST_PAGE: Math.ceil(totalCounts / limit),
      data: expenses,
      msg: "Here is your paged expenses",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message, success: false });
  }
};

const deleteExpense = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const expenseId = req.params.id;
    const expense = await Expense.findOne({
      _id: expenseId,
      userId: req.user._id,
    }).session(session);
    const user = await User.findById(req.user._id).session(session);

    if (!expense || !user) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ msg: "Expense or user not found", success: false });
    }

    await Expense.deleteOne({ _id: expenseId }).session(session);

    if (expense.category !== "salary") {
      user.totalExpense -= expense.amount;
      await user.save({ session });
    }

    await session.commitTransaction();
    res.status(200).json({
      msg: `Expense with id ${expenseId} has been deleted`,
      success: true,
    });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    res.status(500).json({ msg: error.message, success: false });
  } finally {
    session.endSession();
  }
};

const fileDownload = async (req, res) => {
  try {
    if (!req.user.isPremiumUser) {
      return res.status(401).json({ msg: "Unauthorised", success: false });
    }

    const expenses = await Expense.find({ userId: req.user._id });
    const stringifyExpense = JSON.stringify(expenses);
    const filename = `Expense-${req.user._id}-${new Date().toISOString()}.txt`;

    const fileUrl = await s3Service.UploadToS3(stringifyExpense, filename);

    await DownloadFile.create({
      fileUrl,
      userId: req.user._id,
    });

    res.status(201).json({
      fileUrl,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error", success: false });
  }
};

const downloadTable = async (req, res) => {
  try {
    if (!req.user.isPremiumUser) {
      return res.status(401).json({ msg: "Unauthorised", success: false });
    }

    const files = await DownloadFile.find({ userId: req.user._id });

    res.status(200).json({
      success: true,
      data: files,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internal server error",
      success: false,
    });
  }
};

module.exports = {
  addExpense,
  getAllExpense,
  deleteExpense,
  getPageExpense,
  fileDownload,
  downloadTable,
};
