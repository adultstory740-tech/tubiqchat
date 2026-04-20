import mongoose from "mongoose";

const ChatMessageSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "ChatSession" },
  userId: { type: String, required: true, index: true },
  characterName: { type: String, required: true },

  role: { type: String, enum: ["user", "ai"], required: true },
  text: { type: String, required: true },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.ChatMessage || mongoose.model("ChatMessage", ChatMessageSchema);