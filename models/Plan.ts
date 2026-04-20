import mongoose from "mongoose";

const PlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  coins: { type: Number, required: true },
  durationMinutes: { type: Number, required: true },
  messageLimit: { type: Number, required: true },
});

export default mongoose.models.Plan || mongoose.model("Plan", PlanSchema);
