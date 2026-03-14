import { writable, derived } from "svelte/store";
import { ONBOARDING_STEPS } from "$lib/onboarding/steps";
import { browser } from "$app/environment";

const LS_KEY = "flyangt_onboarding_done";

export const onboardingActive = writable(false);
export const currentStepIndex = writable(0);

export const currentStep = derived(
  currentStepIndex,
  ($idx) => ONBOARDING_STEPS[$idx] ?? null,
);

export const totalSteps = ONBOARDING_STEPS.length;

export function startOnboarding() {
  currentStepIndex.set(0);
  onboardingActive.set(true);
}

export function nextStep() {
  currentStepIndex.update((i) => {
    if (i >= ONBOARDING_STEPS.length - 1) {
      completeOnboarding();
      return i;
    }
    return i + 1;
  });
}

export function prevStep() {
  currentStepIndex.update((i) => Math.max(0, i - 1));
}

export function skipOnboarding() {
  completeOnboarding();
}

async function completeOnboarding() {
  onboardingActive.set(false);
  currentStepIndex.set(0);

  if (browser) {
    localStorage.setItem(LS_KEY, "1");
  }

  try {
    await fetch("/api/user/onboarding", { method: "PATCH" });
  } catch {
    // localStorage already saved
  }
}

export function shouldShowOnboarding(serverOnboardingDone: boolean): boolean {
  if (serverOnboardingDone) return false;
  if (browser && localStorage.getItem(LS_KEY) === "1") return false;
  return true;
}
