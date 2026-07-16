import mongoose from "mongoose";

const savingsGoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Goal title is required"],
      trim: true,
    },
    targetAmount: {
      type: Number,
      required: [true, "Target amount is required"],
      min: 0,
    },
    savedAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    deadline: {
      type: Date,
      required: true,
    },
    icon: {
      type: String,
      default: "🎯",
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

savingsGoalSchema.virtual("progress").get(function () {
  if (!this.targetAmount) return 0;
  return Math.min(100, Math.round((this.savedAmount / this.targetAmount) * 100));
});

savingsGoalSchema.set("toJSON", { virtuals: true });
savingsGoalSchema.set("toObject", { virtuals: true });

export default mongoose.model("SavingsGoal", savingsGoalSchema);
