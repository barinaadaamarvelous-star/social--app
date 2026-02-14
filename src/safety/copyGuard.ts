import { BANNED_LANGUAGE } from "./banned-language";

export function assertCopyIsSafe(text: string) {
  for (const phrase of BANNED_LANGUAGE) {
    if (text.toLowerCase().includes(phrase.toLowerCase())) {
      throw new Error(
        `Rejected unsafe language: "${phrase}". Avoid pressure, comparison, or urgency framing.`
      );
    }
  }
}
