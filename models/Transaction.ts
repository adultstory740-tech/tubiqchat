import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  planName: { type: String, required: true },
  coinsIncluded: { type: Number, default: 0 },
  messagesIncluded: { type: Number, default: 0 },
  price: { type: Number, required: true },
  status: { type: String, default: "completed" },
  timestamp: { type: Date, default: Date.now },
});

if (mongoose.models.Transaction) {
  delete mongoose.models.Transaction;
}

export default mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);
