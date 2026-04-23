import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  planName: { type: String, required: true },
  paymentId: { type: String, unique: true }, // 🔥 prevents duplicate
  coinsIncluded: { type: Number, default: 0 },
  messagesIncluded: { type: Number, default: 0 },
  price: { type: Number, required: true },
  status: { type: String, },
  timestamp: { type: Date, default: Date.now },
  credited: { type: Boolean, default: false }, // 🔥 anti-duplicate
});


export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);