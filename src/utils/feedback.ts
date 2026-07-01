import { APP_VERSION } from "../version";

/**
 * In-app feedback submission (Usero).
 *
 * This file is the ONLY place feedback leaves the app, and the payload below
 * is EVERYTHING that is sent: the message the user typed, an optional
 * category they picked, and a static app identifier + version. No connection
 * names, no database names, no queries, no window title, no URLs, no user or
 * machine identifiers. If a future change adds a field here, it shows up in
 * this diff.
 */

export const FEEDBACK_ENDPOINT = "https://usero.io/api/feedback";
export const FEEDBACK_CLIENT_ID = "client_0b6adb540093407b";

export const FEEDBACK_CATEGORIES = ["bug", "idea", "other"] as const;
export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number];

export interface FeedbackPayload {
  clientId: string;
  comment: string;
  metadata: {
    app: "tabularis";
    appVersion: string;
    category: FeedbackCategory;
  };
}

export function buildFeedbackPayload(
  message: string,
  category: FeedbackCategory,
): FeedbackPayload {
  return {
    clientId: FEEDBACK_CLIENT_ID,
    comment: message.trim(),
    metadata: {
      app: "tabularis",
      appVersion: APP_VERSION,
      category,
    },
  };
}

export async function submitFeedback(payload: FeedbackPayload): Promise<void> {
  const response = await fetch(FEEDBACK_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Feedback submission failed (HTTP ${response.status})`);
  }
}
