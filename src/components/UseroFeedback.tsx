import { UseroFeedbackWidget } from "@usero/sdk/react";
import { useTheme } from "../hooks/useTheme";
import { APP_VERSION } from "../version";

/** Usero project for Tabularis (https://usero.io). Feedback submitted
 * through the widget lands in that project's inbox. */
const USERO_CLIENT_ID = "client_0b6adb540093407b";

/** App version helps triage bug reports; it contains no user data. */
const metadata = { appVersion: APP_VERSION };

/**
 * Mounts the Usero feedback widget: a collapsed tab on the right edge
 * that expands into a small form (rating, comment, optional email,
 * optional screenshot attachment).
 *
 * Privacy posture, all deliberate choices:
 * - No session replay plugin and no user identification. The widget
 *   only contacts usero.io when the user opens it (a bare ping) and
 *   when they press submit.
 * - `disablePageContext` (SDK 1.4.0+) omits pageUrl, pageTitle and
 *   referrer from the submission entirely, so connection and database
 *   names (which desktop clients put in window/document titles) never
 *   leave the machine.
 * - Email and screenshots are opt-in per submission: nothing is sent
 *   unless the user types an address or attaches a file themselves.
 */
export function UseroFeedback() {
  const { currentTheme } = useTheme();
  const colors = currentTheme?.colors;

  return (
    <UseroFeedbackWidget
      clientId={USERO_CLIENT_ID}
      position="right"
      disablePageContext
      metadata={metadata}
      theme={
        colors
          ? {
              primary: colors.accent.primary,
              background: colors.bg.elevated,
              text: colors.text.primary,
              border: colors.border.default,
            }
          : undefined
      }
    />
  );
}
