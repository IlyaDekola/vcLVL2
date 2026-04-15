export const UI_CONFIG = {
  layoutMode: "split",
  theme: "light",

  showHeader: true,
  showToolbar: true,
  showFiltersPanel: true,
  showEventsList: true,
  showMap: true,
  showStatsBar: true,

  defaultViewMode: "map-list",
  defaultCardDensity: "comfortable",
  defaultPopupVariant: "detailed",

  filters: {
    dateMode: "chips",
    categoryMode: "chips",
    allowReset: true,
    allowSearch: true
  },

  map: {
    fitBoundsOnFilter: false,
    openPopupOnCardClick: true,
    highlightSelectedMarker: true
  },

  list: {
    showCategoryBadge: true,
    showVenue: true,
    showAddress: true,
    showDescriptionPreview: true,
    showExternalLink: true
  }
};