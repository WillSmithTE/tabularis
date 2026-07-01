import { APP_VERSION } from "../version";

// The only place feedback leaves the app. The payload below is everything that is sent.
export const FEEDBACK_ENDPOINT = "https://usero.io/api/feedback";
export const FEEDBACK_CLIENT_ID = "client_0b6adb540093407b";

export interface FeedbackPayload {
  clientId: string;
  comment: string;
  metadata: {
    app: "tabularis";
    appVersion: string;
  };
}

export function buildFeedbackPayload(message: string): FeedbackPayload {
  return {
    clientId: FEEDBACK_CLIENT_ID,
    comment: message.trim(),
    metadata: {
      app: "tabularis",
      appVersion: APP_VERSION,
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
