import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X, MessageSquarePlus, Loader2, Check, ShieldCheck } from "lucide-react";
import { Modal } from "../ui/Modal";
import { useKeybindings } from "../../hooks/useKeybindings";
import {
  FEEDBACK_CATEGORIES,
  buildFeedbackPayload,
  submitFeedback,
  type FeedbackCategory,
} from "../../utils/feedback";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SubmitStatus = "idle" | "sending" | "sent" | "error";

export const FeedbackModal = ({ isOpen, onClose }: FeedbackModalProps) => {
  const { t } = useTranslation();
  const { isMac } = useKeybindings();
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<FeedbackCategory>("idea");
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const canSubmit = message.trim().length > 0 && status !== "sending";

  const handleClose = () => {
    if (status === "sent") {
      setMessage("");
      setCategory("idea");
    }
    if (status !== "sending") {
      setStatus("idle");
    }
    onClose();
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!canSubmit) return;
    setStatus("sending");
    try {
      await submitFeedback(buildFeedbackPayload(message, category));
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      void handleSubmit();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="bg-elevated border border-strong rounded-xl shadow-2xl w-[480px] max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-default bg-base">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-900/30 rounded-lg">
              <MessageSquarePlus size={20} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-primary">{t("feedback.title")}</h2>
              <p className="text-xs text-secondary">{t("feedback.subtitle")}</p>
            </div>
          </div>
          <button onClick={handleClose} className="text-secondary hover:text-primary transition-colors">
            <X size={20} />
          </button>
        </div>

        {status === "sent" ? (
          <>
            {/* Success state */}
            <div className="p-6 flex flex-col items-center text-center gap-3">
              <div className="p-3 bg-green-900/30 rounded-full">
                <Check size={24} className="text-green-400" />
              </div>
              <div className="text-sm font-medium text-primary">{t("feedback.sentTitle")}</div>
              <p className="text-xs text-secondary leading-relaxed max-w-[320px]">
                {t("feedback.sentDesc")}
              </p>
            </div>
            <div className="p-4 border-t border-default bg-base/50 flex justify-end">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {t("feedback.done")}
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
            {/* Content */}
            <div className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="text-xs uppercase font-bold text-muted mb-1 block">
                  {t("feedback.categoryLabel")}
                </label>
                <div className="flex gap-2">
                  {FEEDBACK_CATEGORIES.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setCategory(option)}
                      className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                        category === option
                          ? "border-blue-500 bg-blue-900/20 text-blue-400"
                          : "border-default bg-base text-secondary hover:text-primary hover:border-strong"
                      }`}
                    >
                      {t(`feedback.category.${option}`)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="feedback-message" className="text-xs uppercase font-bold text-muted mb-1 block">
                  {t("feedback.messageLabel")}
                </label>
                <textarea
                  id="feedback-message"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  onKeyDown={handleTextareaKeyDown}
                  rows={5}
                  className="w-full px-3 py-2 bg-base border border-strong rounded-lg text-primary focus:border-blue-500 focus:outline-none resize-none text-sm"
                  placeholder={t("feedback.messagePlaceholder")}
                  autoFocus
                />
              </div>

              <div className="flex items-start gap-2 bg-surface-secondary/50 p-3 rounded-lg border border-default">
                <ShieldCheck size={16} className="text-green-400 mt-0.5 shrink-0" />
                <p className="text-xs text-secondary leading-relaxed">
                  {t("feedback.privacyNote")}
                </p>
              </div>

              {status === "error" && (
                <div className="text-xs text-red-400 bg-red-900/20 border border-red-900/50 rounded-lg px-3 py-2">
                  {t("feedback.error")}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-default bg-base/50 flex items-center justify-between gap-3">
              <span className="text-xs text-muted">
                {t("feedback.shortcutHint", { shortcut: isMac ? "⌘↵" : "Ctrl+Enter" })}
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-secondary hover:text-primary transition-colors text-sm"
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  {status === "sending" && <Loader2 size={16} className="animate-spin" />}
                  {t("feedback.send")}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
