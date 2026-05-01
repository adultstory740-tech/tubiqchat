import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import ChatSession from "@/models/ChatSession";
import ChatMessage from "@/models/ChatMessage";
import User from "@/models/User";
import { getCharacterSystemPrompt } from "@/lib/characters";
import mongoose from "mongoose";

async function generateAndSaveSummary(sessionId: string) {
  try {
    const messages = await ChatMessage.find({ sessionId })
      .sort({ createdAt: 1 })
      .lean();

    if (messages.length < 12) return;

    // Summarize everything except the last 10 messages
    const oldMessages = messages.slice(0, -10);
    const oldText = oldMessages
      .map((m: any) => `${m.role === "user" ? "User" : "Girl"}: ${m.text}`)
      .join("\n");

    const summaryRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3",
        messages: [
          {
            role: "system",
            content: "Summarize the following chat conversation in 2-4 short sentences. Focus on main topics, user's mood, key events, and the tone between them. Keep it neutral and useful for future context."
          },
          { role: "user", content: oldText }
        ],
        max_tokens: 120,
      }),
    });

    const data = await summaryRes.json();
    const newSummary = data?.choices?.[0]?.message?.content?.trim() || "";
    console.log(newSummary);

    await ChatSession.updateOne(
      { _id: sessionId },
      {
        $set: {
          summary: newSummary,
          lastSummaryAt: new Date()
        }
      }
    );
  } catch (err) {
    console.error("Summary generation failed:", err);
    // Non-blocking - don't crash the main flow
  }
}

export async function POST(req: Request) {
  let mongoSession: any = null;

  try {
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text, model } = await req.json();
    if (!text?.trim() || !model?.name) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    await connectDB();
    const now = new Date();
    const characterName = model.name.toLowerCase();

    // Start MongoDB transaction
    mongoSession = await mongoose.startSession();
    mongoSession.startTransaction();

    // STEP 1: Get or validate active session
    let session = await ChatSession.findOne(
      { userId, characterName, isActive: true },
      null,
      { session: mongoSession }
    );

    if (!session) {
      await mongoSession.abortTransaction();
      return NextResponse.json({ error: "SESSION_EXPIRED" }, { status: 403 });
    }

    // STEP 2: Deduct credits + save user message (atomic)
    const user = await User.findOneAndUpdate(
      { guestId: userId, messageCredits: { $gte: 1 } },
      { $inc: { messageCredits: -1 } },
      { new: true, session: mongoSession }
    );

    if (!user) {
      await mongoSession.abortTransaction();
      throw new Error("NO_CREDITS");
    }

    // Save user message
    await ChatMessage.create([{
      sessionId: session._id,
      userId,
      characterName,
      role: "user",
      text: text.trim(),
      createdAt: now,
    }], { session: mongoSession });

    // === IMPROVED ADULT MODE DETECTION ===
    const lowerText = text.toLowerCase().trim();

    const adultTriggers = [
      "sex", "fuck", "chudai", "chod", "chodna", "sex chat", "adult mode",
      "horny", "nude", "dirty talk", "69", "blowjob", "handjob",
      "garam", "garam ho", "wet ho", "wet gayi", "moan", "moaning",
      "touch kar", "touch karo", "kiss kar", "andar daal", "daal do",
      "hard hai", "kitna hard", "pel do", "thok do", "lund", "chut", "bur",
      "intimate", "erotic", "naughty mode", "seductive", "dirty chat",
      "body dikha", "nangi", "strip", "boobs", "gaand", "tera lund", "meri chut"
    ];

    const normalTriggers = ["normal mode", "bas", "normal baat", "ruk ja", "band kar", "clean mode", "normal chat"];

    const shouldActivateAdult = adultTriggers.some(trigger => lowerText.includes(trigger));
    const shouldDeactivateAdult = normalTriggers.some(trigger => lowerText.includes(trigger));

    let isAdultMode = session.isAdultMode || false;

    // Activate Adult Mode
    if (shouldActivateAdult && !isAdultMode) {
      isAdultMode = true;
      await ChatSession.updateOne(
        { _id: session._id },
        {
          $set: {
            isAdultMode: true,
            adultTriggeredAt: now
          }
        },
        { session: mongoSession }
      );
    }

    // Deactivate Adult Mode if user wants normal chat
    if (shouldDeactivateAdult && isAdultMode) {
      isAdultMode = false;
      await ChatSession.updateOne(
        { _id: session._id },
        { $set: { isAdultMode: false } },
        { session: mongoSession }
      );
    }
    // Update session analytics
    await ChatSession.updateOne(
      { _id: session._id },
      {
        $inc: { messagesUsed: 1, totalMessages: 1 },
        $set: { lastActiveAt: now }
      },
      { session: mongoSession }
    );

    // Commit transaction
    await mongoSession.commitTransaction();

    // STEP 3: Build context for AI
    const characterPrompt = getCharacterSystemPrompt(model.name);

    // Get last 8 messages (chronological)
    const history = await ChatMessage.find({ sessionId: session._id })
      .sort({ createdAt: 1 })
      .limit(8)
      .lean();

    const messagesForAI: any[] = [
      { role: "system", content: characterPrompt },
    ];

    // Add rolling summary if exists
    if (session.summary) {
      messagesForAI.push({
        role: "system",
        content: `Previous conversation summary: ${session.summary}`
      });
    }

    // Add history
    messagesForAI.push(
      ...history.map((msg: any) => ({
        role: msg.role === "ai" ? "assistant" : "user",
        content: msg.text,
      }))
    );

    // Add current user message (no duplication)
    messagesForAI.push({ role: "user", content: text.trim() });

    // STEP 4: Call AI
    let reply = "Sorry, something went wrong. Try again.";
    try {
      const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Chat App",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat-v3",   // You can change to a better roleplay model later
          messages: messagesForAI,
          max_tokens: 150,
          temperature: 0.90,
        }),
      });

      const data = await aiRes.json();
      reply = data?.choices?.[0]?.message?.content?.trim() || reply;
    } catch (error) {
      console.error("AI call error:", error);
    }

    // STEP 5: Save AI message (outside transaction for speed)
    await ChatMessage.create({
      sessionId: session._id,
      userId,
      characterName,
      role: "ai",
      text: reply,
      createdAt: new Date(),
    });

    // Update totalMessages for AI message
    await ChatSession.updateOne(
      { _id: session._id },
      { $inc: { totalMessages: 1 } }
    );

    // STEP 6: Trigger summary asynchronously (every 10 total messages)
    if ((session.totalMessages + 2) % 10 === 0) {
      generateAndSaveSummary(session._id).catch(console.error);   // Fire and forget - non-blocking
    }

    return NextResponse.json({
      reply,
      messageCredits: user.messageCredits,
      isAdultMode,
    });

  } catch (err: any) {
    if (mongoSession) {
      try {
        await mongoSession.abortTransaction();
      } catch { }
    }

    const statusMap: any = {
      NO_CREDITS: 403,
      SESSION_EXPIRED: 403,
    };

    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: statusMap[err.message] || 500 }
    );
  } finally {
    if (mongoSession) {
      mongoSession.endSession();
    }
  }
}