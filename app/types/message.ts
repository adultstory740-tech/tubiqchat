export interface Message {
    role: "user" | "ai";
    text: string;
    sessionInfo?: {
      remainingTimeMs?: number;
      messagesUsed?: number;
      maxMessages?: number;
    };
}