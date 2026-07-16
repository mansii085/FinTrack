import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    source: {
      type: String,
      required: [true, "Income source is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["Salary", "Freelancing", "Investments", "Business", "Gift", "Other"],
      default: "Other",
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
    notes: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    icon: {
      type: String,
      default: "💰",
    },
  },
  { timestamps: true }
);

incomeSchema.index({ user: 1, date: -1 });

export default mongoose.model("Income", incomeSchema);
