import { writable, get } from "svelte/store";

export const advisorOpen = writable(false);

/** Pending error message for the advisor to auto-send */
export const advisorPendingError = writable<string | null>(null);

export function toggleAdvisor() {
  advisorOpen.update((v) => !v);
}

export function openAdvisor() {
  advisorOpen.set(true);
}

export function closeAdvisor() {
  advisorOpen.set(false);
}

/**
 * Push an error to show a toast near the advisor FAB.
 * When user clicks "Ask Advisor", the error is sent as a message.
 */
export function pushAdvisorError(error: string) {
  advisorPendingError.set(error);
}

/** Open advisor and auto-send the pending error */
export function openAdvisorWithError() {
  advisorOpen.set(true);
  // advisorPendingError stays set — AssistantChat picks it up on mount/open
}

export function clearAdvisorError() {
  advisorPendingError.set(null);
}
