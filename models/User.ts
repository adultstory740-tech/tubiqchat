import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  guestId: { type: String, required: true, unique: true, index: true }, // 🔥 REQUIRED

  coins: { type: Number, default: 0 },
  messageCredits: { type: Number, default: 0 },
  planName: { type: String, default: "Free" },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
