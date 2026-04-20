import mongoose from "mongoose";

const ChatSessionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  characterName: { type: String, required: true },

  startTime: { type: Date, required: true },
  lastActiveAt: { type: Date, required: true },

  messagesUsed: { type: Number, default: 0 },

  isActive: { type: Boolean, default: true },
  endedAt: { type: Date },
  endedReason: { type: String },
});

ChatSessionSchema.index({ userId: 1, characterName: 1, isActive: 1 });

if (mongoose.models.ChatSession) {
  delete mongoose.models.ChatSession;
}

export default mongoose.models.ChatSession ||
  mongoose.model("ChatSession", ChatSessionSchema);