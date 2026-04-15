import { groupBy, cloneArray } from "./utils.js";

const store = {
  events: [],
  eventsByCategory: {}
};

export function clearEvents() {
  store.events = [];
  store.eventsByCategory = {};
}

export function setEvents(events = []) {
  store.events = cloneArray(events);
  store.eventsByCategory = groupBy(store.events, (event) => event.category);
}

export function addEvents(events = []) {
  const nextEvents = [...store.events, ...events];
  store.events = nextEvents;
  store.eventsByCategory = groupBy(store.events, (event) => event.category);
}

export function replaceCategoryEvents(categoryId, events = []) {
  const otherEvents = store.events.filter((event) => event.category !== categoryId);
  store.events = [...otherEvents, ...events];
  store.eventsByCategory = groupBy(store.events, (event) => event.category);
}

export function getAllEvents() {
  return cloneArray(store.events);
}

export function getEventsByCategory(categoryId) {
  return cloneArray(store.eventsByCategory[categoryId] || []);
}

export function getEventsCount() {
  return store.events.length;
}

export function hasEvents() {
  return store.events.length > 0;
}