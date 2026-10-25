"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Sparkles, AlertTriangle, AlertOctagon, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type FlashType = "notice" | "alert" | "error";

export interface FlashItem {
  id: string;
  type: FlashType;
  message: string;
  duration?: number;
}

interface FlashContextValue {
  flashes: FlashItem[];
  showFlash: (type: FlashType, message: string, duration?: number) => string;
  dismissFlash: (id: string) => void;
  clearAll: () => void;
  notice: (message: string, duration?: number) => string;
  alert: (message: string, duration?: number) => string;
  error: (message: string, duration?: number) => string;
}

const FlashContext = createContext<FlashContextValue | undefined>(undefined);

export function useFlash(): FlashContextValue {
  const context = useContext(FlashContext);
  if (!context) {
    throw new Error("useFlash must be used within a FlashProvider");
  }
  return context;
}

/**
 * Toast item with auto-dismiss and hover pause.
 */
function SingleFlashToast({
  item,
  onDismiss,
}: {
  item: FlashItem;
  onDismiss: (id: string) => void;
}) {
  const [isPaused, setIsPaused] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const remainingTimeRef = useRef(item.duration ?? 5000);
  const startTimeRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback(() => {
    if (remainingTimeRef.current <= 0) return;
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => onDismiss(item.id), 250);
    }, remainingTimeRef.current);
  }, [item.id, onDismiss]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      const elapsed = Date.now() - startTimeRef.current;
      remainingTimeRef.current = Math.max(
        0,
        remainingTimeRef.current - elapsed,
      );
    }
  }, []);

  useEffect(() => {
    startTimer();
    return () => clearTimer();
  }, [startTimer, clearTimer]);

  const handleMouseEnter = () => {
    setIsPaused(true);
    clearTimer();
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    startTimer();
  };

  const handleClose = () => {
    setIsFadingOut(true);
    setTimeout(() => onDismiss(item.id), 200);
  };

  const isNotice = item.type === "notice";
  const isAlert = item.type === "alert";
  const isError = item.type === "error";

  return (
    <div
      role={isNotice ? "status" : "alert"}
      aria-live={isNotice ? "polite" : "assertive"}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "pointer-events-auto relative w-full paper-sheet rounded-xs border border-crease shadow-md transition-all duration-200",
        "flex items-start gap-3 py-3 px-4 font-letter text-xs text-foreground bg-parchment",
        isNotice && "border-ink/40 bg-ink/5",
        (isAlert || isError) && "border-wax/40 bg-wax/5",
        isFadingOut
          ? "opacity-0 translate-y-[-6px]"
          : "opacity-100 translate-y-0 animate-fade-in",
      )}
    >
      <div className="shrink-0 mt-0.5">
        {isNotice && <Sparkles size={16} className="text-ink" />}
        {isAlert && <AlertTriangle size={16} className="text-wax" />}
        {isError && <AlertOctagon size={16} className="text-wax" />}
      </div>

      <div className="flex-1 min-w-0 pr-1">
        <span className="font-medium leading-relaxed block break-words">
          {item.message}
        </span>
      </div>

      <button
        type="button"
        onClick={handleClose}
        aria-label="Dismiss notification"
        className="shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center text-foreground-muted hover:text-foreground rounded-xs transition-colors cursor-pointer -mr-2 -my-2"
      >
        <X size={15} />
      </button>

      {/* Subtle indicator of timer */}
      {!isPaused && item.duration !== 0 && (
        <span
          className={cn(
            "absolute bottom-0 left-0 h-[2px] opacity-40 transition-all",
            isNotice ? "bg-ink" : "bg-wax",
          )}
          style={{
            animation: `shrinkWidth ${item.duration ?? 5000}ms linear forwards`,
          }}
        />
      )}
    </div>
  );
}

/**
 * Provider that manages global flash toasts.
 */
export function FlashProvider({ children }: { children: React.ReactNode }) {
  const [flashes, setFlashes] = useState<FlashItem[]>([]);

  const dismissFlash = useCallback((id: string) => {
    setFlashes((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setFlashes([]);
  }, []);

  const showFlash = useCallback(
    (type: FlashType, message: string, duration: number = 5000) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newItem: FlashItem = { id, type, message, duration };
      setFlashes((prev) => [...prev, newItem]);
      return id;
    },
    [],
  );

  const notice = useCallback(
    (message: string, duration?: number) =>
      showFlash("notice", message, duration),
    [showFlash],
  );
  const alert = useCallback(
    (message: string, duration?: number) =>
      showFlash("alert", message, duration),
    [showFlash],
  );
  const error = useCallback(
    (message: string, duration?: number) =>
      showFlash("error", message, duration),
    [showFlash],
  );

  return (
    <FlashContext.Provider
      value={{
        flashes,
        showFlash,
        dismissFlash,
        clearAll,
        notice,
        alert,
        error,
      }}
    >
      {children}
      <FlashBannerContainer flashes={flashes} onDismiss={dismissFlash} />
    </FlashContext.Provider>
  );
}

/**
 * Global floating container for flash banners.
 */
export function FlashBannerContainer({
  flashes,
  onDismiss,
}: {
  flashes: FlashItem[];
  onDismiss: (id: string) => void;
}) {
  if (flashes.length === 0) return null;

  return (
    <div
      id="flash-container"
      className="fixed top-6 right-6 z-50 flex flex-col gap-2.5 max-w-md w-full px-4 sm:px-0 pointer-events-none"
    >
      {flashes.map((item) => (
        <SingleFlashToast key={item.id} item={item} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

/**
 * Standalone static or controlled FlashBanner for inline page use.
 */
export function FlashBanner({
  type = "notice",
  message,
  onClose,
  className,
}: {
  type?: FlashType;
  message: React.ReactNode;
  onClose?: () => void;
  className?: string;
}) {
  const isNotice = type === "notice";
  const isAlert = type === "alert";
  const isError = type === "error";

  return (
    <div
      className={cn(
        "paper-sheet rounded-xs border border-crease shadow-xs flex items-center justify-between gap-3.5 py-3 px-5 mb-6 animate-fade-in max-w-5xl mx-auto w-full font-letter text-xs text-foreground bg-parchment",
        isNotice && "border-ink/40 bg-ink/5",
        (isAlert || isError) && "border-wax/40 bg-wax/5",
        className,
      )}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="shrink-0">
          {isNotice && <Sparkles size={16} className="text-ink" />}
          {isAlert && <AlertTriangle size={16} className="text-wax" />}
          {isError && <AlertOctagon size={16} className="text-wax" />}
        </div>
        <span className="font-medium leading-relaxed">{message}</span>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss notification"
          className="shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center text-foreground-muted hover:text-foreground rounded-xs transition-colors cursor-pointer -mr-2"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
