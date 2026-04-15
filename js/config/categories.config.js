export const CATEGORIES = {
  theatre: {
    id: "theatre",
    label: "Театр",
    color: "#E53E3E",
    icon: "masks",
    enabled: true,
    sortOrder: 10,
    sourceStrategy: "manual",
    searchProfile: "curated",
    ui: {
      markerStyle: "circle",
      cardVariant: "default",
      showTimeFirst: true
    }
  },

  cinema: {
    id: "cinema",
    label: "Кино",
    color: "#3B82F6",
    icon: "film",
    enabled: true,
    sortOrder: 20,
    sourceStrategy: "manual",
    searchProfile: "multi-session",
    ui: {
      markerStyle: "circle",
      cardVariant: "compact",
      showTimeFirst: false
    }
  },

  exhibition: {
    id: "exhibition",
    label: "Выставка",
    color: "#8B5CF6",
    icon: "image",
    enabled: true,
    sortOrder: 30,
    sourceStrategy: "manual",
    searchProfile: "curated",
    ui: {
      markerStyle: "circle",
      cardVariant: "default",
      showTimeFirst: false
    }
  },

  festival: {
    id: "festival",
    label: "Фестиваль",
    color: "#F97316",
    icon: "tickets",
    enabled: true,
    sortOrder: 40,
    sourceStrategy: "manual",
    searchProfile: "curated",
    ui: {
      markerStyle: "circle",
      cardVariant: "default",
      showTimeFirst: true
    }
  },

  livemusic: {
    id: "livemusic",
    label: "Живая музыка",
    color: "#10B981",
    icon: "music",
    enabled: true,
    sortOrder: 50,
    sourceStrategy: "manual",
    searchProfile: "curated",
    ui: {
      markerStyle: "circle",
      cardVariant: "default",
      showTimeFirst: true
    }
  }
};

export const CATEGORY_ORDER = Object.values(CATEGORIES)
  .filter(category => category.enabled)
  .sort((a, b) => a.sortOrder - b.sortOrder)
  .map(category => category.id);

export const CATEGORY_IDS = Object.keys(CATEGORIES);