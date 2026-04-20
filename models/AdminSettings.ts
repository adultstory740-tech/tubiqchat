import mongoose from "mongoose";

const AdminSettingsSchema = new mongoose.Schema({
  defaultSessionDuration: { type: Number, default: 10, required: true }, // in minutes
  defaultMaxMessages: { type: Number, default: 50, required: true },
  inactivityTimeout: { type: Number, default: 20, required: true }, // in seconds
  costPerMinute: { type: Number, default: 10, required: true },
});

if (mongoose.models.AdminSettings) {
  delete mongoose.models.AdminSettings;
}

export default mongoose.models.AdminSettings || mongoose.model("AdminSettings", AdminSettingsSchema);
