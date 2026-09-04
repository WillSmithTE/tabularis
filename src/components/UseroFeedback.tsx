import { UseroFeedbackWidget } from "@usero/sdk/react";
import { useTheme } from "../hooks/useTheme";
import { APP_VERSION } from "../version";

const USERO_CLIENT_ID = "client_0b6adb540093407b";

const metadata = { appVersion: APP_VERSION };

// disablePageContext keeps window title / URL (connection + db names) off the payload.
// No replay, no identify.
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
