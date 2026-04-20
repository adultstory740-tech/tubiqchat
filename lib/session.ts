import ChatSession from "@/models/ChatSession";
import AdminSettings from "@/models/AdminSettings";
import User from "@/models/User";

/**
 * Validates session inactivity and closes it if necessary, refunding minutes to user.
 * @returns {Promise<boolean>} true if session is still valid, false if it was closed due to inactivity.
 */
export async function validateInactivity(session: any, userId: string) {
  const nowMs = Date.now();
  
  let settings = await AdminSettings.findOne({});
  if (!settings) {
    settings = await AdminSettings.create({});
  }

  const inactivityTimeoutMs = settings.inactivityTimeout * 1000;
  
  if (session.lastMessageAt) {
    const lastMsgMs = new Date(session.lastMessageAt).getTime();
    const elapsedMs = nowMs - lastMsgMs;

    if (elapsedMs > inactivityTimeoutMs) {
      // Session timed out - Close it
      session.isActive = false;
      session.endedAt = new Date();
      session.endedReason = "Inactivity Timeout";
      await session.save();

      // Refund logic: Remaining time based on last interaction
      const endTimeMs = new Date(session.endTime).getTime();
      const remainingMs = endTimeMs - lastMsgMs;
      const remainingMins = Math.round(remainingMs / 60000);

      if (remainingMins > 0) {
        const userObj = await User.findOne({ guestId: userId });
        if (userObj) {
          userObj.remainingMinutes = (userObj.remainingMinutes || 0) + remainingMins;
          await userObj.save();
        }
      }

      return false;
    }
  }

  return true;
}
