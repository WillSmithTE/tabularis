import { describe, it, expect } from "vitest";
import {
  buildFeedbackPayload,
  FEEDBACK_CLIENT_ID,
  FEEDBACK_ENDPOINT,
} from "../../src/utils/feedback";
import { APP_VERSION } from "../../src/version";

describe("feedback", () => {
  describe("buildFeedbackPayload", () => {
    it("should contain exactly the documented fields and nothing else", () => {
      // Pins the payload shape. A new field here is a privacy change, review it as one.
      const payload = buildFeedbackPayload("hello");
      expect(Object.keys(payload).sort()).toEqual(["clientId", "comment", "metadata"]);
      expect(Object.keys(payload.metadata).sort()).toEqual(["app", "appVersion"]);
    });

    it("should carry the user message trimmed", () => {
      const payload = buildFeedbackPayload("  the filter panel resets  ");
      expect(payload.comment).toBe("the filter panel resets");
    });

    it("should use the static app identifier and current version", () => {
      const payload = buildFeedbackPayload("x");
      expect(payload.clientId).toBe(FEEDBACK_CLIENT_ID);
      expect(payload.metadata.app).toBe("tabularis");
      expect(payload.metadata.appVersion).toBe(APP_VERSION);
    });

    it("should never include page or window context", () => {
      const serialized = JSON.stringify(buildFeedbackPayload("x"));
      expect(serialized).not.toContain("pageUrl");
      expect(serialized).not.toContain("pageTitle");
      expect(serialized).not.toContain("referrer");
      expect(serialized).not.toContain("userEmail");
    });
  });

  describe("constants", () => {
    it("should target the public feedback endpoint", () => {
      expect(FEEDBACK_ENDPOINT).toBe("https://usero.io/api/feedback");
    });
  });
});
