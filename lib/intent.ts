export function detectIntent(text: string) {
    const msg = text.toLowerCase();

    if (msg.includes("hi") || msg.includes("hello")) return "greeting";
    if (msg.includes("love") || msg.includes("jaan")) return "love";
    if (msg.includes("hot") || msg.includes("kiss")) return "flirty";
    if (msg.includes("sad") || msg.includes("alone")) return "sad";

    return "default";
}