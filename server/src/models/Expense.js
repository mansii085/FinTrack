import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Expense title is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "Food",
        "Travel",
        "Shopping",
        "Entertainment",
        "Education",
        "Medical",
        "Subscriptions",
        "Bills",
        "Others",
      ],
      default: "Others",
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be positive"],
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    merchant: {
      type: String,
      trim: true,
      default: "",
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    icon: {
      type: String,
      default: "🧾",
    },
  },
  { timestamps: true }
);

expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ user: 1, category: 1 });

export default mongoose.model("Expense", expenseSchema);
