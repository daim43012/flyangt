import { writable, derived, get } from "svelte/store";
import { browser } from "$app/environment";
import {
  PAGE_TOURS,
  type PageTourStep,
  type PageTourDef,
} from "$lib/onboarding/pageTours";
import { onboardingActive } from "./onboarding";

const LS_PREFIX = "flyangt_tour_";

export const pageTourActive = writable(false);
export const pageTourSteps = writable<PageTourStep[]>([]);
export const pageTourIndex = writable(0);
export const pageTourPageId = writable("");

export const currentPageTourStep = derived(
  [pageTourSteps, pageTourIndex],
  ([$steps, $idx]) => $steps[$idx] ?? null,
);

export const totalPageTourSteps = derived(pageTourSteps, ($s) => $s.length);

export function findTourForRoute(pathname: string): PageTourDef | null {
  return (
    PAGE_TOURS.find(
      (t) =>
        pathname === t.routeMatch || pathname.startsWith(t.routeMatch + "/"),
    ) ?? null
  );
}

export function isPageTourDone(pageId: string): boolean {
  if (!browser) return true;
  return localStorage.getItem(LS_PREFIX + pageId) === "1";
}

export function startPageTour(pageId: string) {
  if (get(onboardingActive)) return;
  const tour = PAGE_TOURS.find((t) => t.pageId === pageId);
  if (!tour || tour.steps.length === 0) return;

  pageTourPageId.set(pageId);
  pageTourSteps.set(tour.steps);
  pageTourIndex.set(0);
  pageTourActive.set(true);
}

export function nextPageTourStep() {
  const steps = get(pageTourSteps);
  const idx = get(pageTourIndex);

  if (idx >= steps.length - 1) {
    completePageTour();
  } else {
    pageTourIndex.set(idx + 1);
  }
}

export function prevPageTourStep() {
  pageTourIndex.update((i) => Math.max(0, i - 1));
}

export function skipPageTour() {
  completePageTour();
}

function completePageTour() {
  const pageId = get(pageTourPageId);
  pageTourActive.set(false);
  pageTourIndex.set(0);
  pageTourSteps.set([]);

  if (browser && pageId) {
    localStorage.setItem(LS_PREFIX + pageId, "1");
  }
}
