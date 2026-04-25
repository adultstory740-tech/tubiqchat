const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  userId: String,
  planName: String,
  price: Number,
  paymentId: String,
  paymentRequestId: String,
  coinsIncluded: Number,
  messagesIncluded: Number,
  status: String,
  credited: Boolean,
  packId: String,
});

const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);

async function check() {
  await mongoose.connect("mongodb://StoryDb:StoryDb9580%40@ac-sylrhyq-shard-00-00.2ed297k.mongodb.net:27017,ac-sylrhyq-shard-00-01.2ed297k.mongodb.net:27017,ac-sylrhyq-shard-00-02.2ed297k.mongodb.net:27017/storydb?ssl=true&replicaSet=atlas-14xxlv-shard-0&authSource=admin&retryWrites=true&w=majority");
  console.log("Connected to MongoDB.");
  const txns = await Transaction.find().sort({ _id: -1 }).limit(5);
  console.log("Latest Transactions:");
  console.dir(txns.map(t => t.toObject()), { depth: null });

  const UserSchema = new mongoose.Schema({
    guestId: String,
    coins: Number,
    messageCredits: Number,
    planName: String,
  });
  const User = mongoose.models.User || mongoose.model("User", UserSchema);
  const users = await User.find().sort({ _id: -1 }).limit(2);
  console.log("Latest Users:");
  console.dir(users.map(u => u.toObject()), { depth: null });
  process.exit(0);
}

check().catch(console.error);
