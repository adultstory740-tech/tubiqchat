import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },

  planName: { type: String, required: true },
  price: { type: Number, required: true },

  paymentId: { type: String, unique: true },
  paymentRequestId: { type: String, index: true }, // ✅ ADD THIS

  coinsIncluded: { type: Number, default: 0 },
  messagesIncluded: { type: Number, default: 0 },

  status: { type: String, default: "pending" },
  timestamp: { type: Date, default: Date.now },

  credited: { type: Boolean, default: false }
});


export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);