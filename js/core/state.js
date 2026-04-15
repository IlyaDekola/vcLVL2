import { CATEGORY_IDS } from "../config/categories.config.js";
import { UI_CONFIG } from "../config/ui.config.js";

const listeners = new Set();

const state = {
  data: {
    eventsLoaded: false,
    loadedCategories: new Set(CATEGORY_IDS),
    loadingByCategory: {}
  },

  filters: {
    selectedDate: "all",
    activeCategories: new Set(CATEGORY_IDS),
    query: ""
  },

  ui: {
    layoutMode: UI_CONFIG.layoutMode,
    theme: UI_CONFIG.theme,
    selectedEventId: null,
    sidebarOpen: true,
    mapReady: false
  }
};

export function getState() {
  return state;
}

export function subscribe(listener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function notifyStateChanged() {
  listeners.forEach((listener) => listener(state));
}

export function updateState(updater) {
  if (typeof updater === "function") {
    updater(state);
    notifyStateChanged();
  }
}

export function setSelectedDate(date) {
  updateState((draft) => {
    draft.filters.selectedDate = date;
  });
}

export function toggleCategory(categoryId) {
  updateState((draft) => {
    const next = new Set(draft.filters.activeCategories);

    if (next.has(categoryId)) {
      if (next.size > 1) {
        next.delete(categoryId);
      }
    } else {
      next.add(categoryId);
    }

    draft.filters.activeCategories = next;
  });
}

export function resetCategories(categoryIds = CATEGORY_IDS) {
  updateState((draft) => {
    draft.filters.activeCategories = new Set(categoryIds);
  });
}

export function setSearchQuery(query) {
  updateState((draft) => {
    draft.filters.query = query;
  });
}

export function setSelectedEventId(eventId) {
  updateState((draft) => {
    draft.ui.selectedEventId = eventId;
  });
}

export function setMapReady(value) {
  updateState((draft) => {
    draft.ui.mapReady = Boolean(value);
  });
}

export function resetFilters(categoryIds = CATEGORY_IDS) {
  updateState((draft) => {
    draft.filters.selectedDate = "all";
    draft.filters.activeCategories = new Set(categoryIds);
    draft.filters.query = "";
  });
}