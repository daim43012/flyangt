export type OnboardingStep = {
  id: string;
  selector: string;
  title: string;
  description: string;
  route: string;
  tooltipPosition: "top" | "bottom" | "left" | "right";
  icon: string;
};

// Global onboarding removed — page-level tours now handle all blocks
export const ONBOARDING_STEPS: OnboardingStep[] = [];
