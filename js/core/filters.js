import { getUniqueValues } from "./utils.js";

export function filterByDate(events = [], selectedDate = "all") {
  if (selectedDate === "all") return [...events];
  return events.filter((event) => event.date === selectedDate);
}

export function filterByCategories(events = [], activeCategories = new Set()) {
  if (!(activeCategories instanceof Set) || activeCategories.size === 0) {
    return [];
  }

  return events.filter((event) => activeCategories.has(event.category));
}

export function filterByQuery(events = [], query = "") {
  const normalizedQuery = String(query).trim().toLowerCase();

  if (!normalizedQuery) return [...events];

  return events.filter((event) => {
    const haystack = [
      event.title,
      event.venue,
      event.address,
      event.description,
      ...(event.tags || [])
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

export function applyFilters(events = [], filters = {}) {
  const {
    selectedDate = "all",
    activeCategories = new Set(),
    query = ""
  } = filters;

  const byDate = filterByDate(events, selectedDate);
  const byCategories = filterByCategories(byDate, activeCategories);
  const byQuery = filterByQuery(byCategories, query);

  return byQuery;
}

export function getAvailableDates(events = []) {
  const dates = getUniqueValues(events, (event) => event.date);

  return dates.sort((a, b) => a.localeCompare(b));
}

export function getAvailableDateOptions(events = []) {
  const uniqueMap = new Map();

  events.forEach((event) => {
    if (!uniqueMap.has(event.date)) {
      uniqueMap.set(event.date, {
        value: event.date,
        label: event.dateLabel || event.date
      });
    }
  });

  return [...uniqueMap.values()].sort((a, b) => a.value.localeCompare(b.value));
}

export function getAvailableCategories(events = []) {
  return getUniqueValues(events, (event) => event.category).sort((a, b) =>
    a.localeCompare(b, "ru")
  );
}