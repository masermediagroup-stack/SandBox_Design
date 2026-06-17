export const PRELOADER_STORAGE_KEY = "tyler-portfolio-block-decay-loader-v1";
export const PRELOADER_COMPLETE_EVENT = "tyler-portfolio-preloader-complete";

let completedInMemory = false;

export function hasCompletedPreloader() {
  if (completedInMemory) return true;
  if (typeof window === "undefined") return false;

  try {
    return window.localStorage.getItem(PRELOADER_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function markPreloaderComplete() {
  if (typeof window === "undefined") return;

  completedInMemory = true;

  try {
    window.localStorage.setItem(PRELOADER_STORAGE_KEY, "1");
  } catch {
    // Storage can be unavailable in private or restricted browsing contexts.
  }

  document.documentElement.dataset.preloaderComplete = "true";
  window.dispatchEvent(new Event(PRELOADER_COMPLETE_EVENT));
}
