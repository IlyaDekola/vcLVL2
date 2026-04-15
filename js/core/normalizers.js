import { isNonEmptyString, isNumber } from "./utils.js";

export function normalizeText(value, fallback = "") {
  return isNonEmptyString(value) ? value.trim() : fallback;
}

export function normalizeArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

export function normalizeBoolean(value, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

export function normalizeNullable(value, fallback = null) {
  return value ?? fallback;
}

export function normalizeCoordinates(lat, lng) {
  return {
    lat: isNumber(lat) ? lat : null,
    lng: isNumber(lng) ? lng : null
  };
}

export function normalizeSeedEvent(raw = {}) {
  const coords = normalizeCoordinates(raw.lat, raw.lng);

  return {
    id: normalizeText(raw.id),
    title: normalizeText(raw.title),
    category: normalizeText(raw.category),
    subcategory: normalizeNullable(raw.subcategory, null),
    date: normalizeText(raw.date),
    dateLabel: normalizeText(raw.dateLabel),
    time: normalizeText(raw.time),
    venue: normalizeText(raw.venue),
    address: normalizeText(raw.address),
    lat: coords.lat,
    lng: coords.lng,
    description: normalizeText(raw.description),
    url: normalizeText(raw.url),
    sources: normalizeArray(raw.sources),
    sourceType: normalizeText(raw.sourceType, "manual"),
    city: normalizeText(raw.city, "Минск"),
    district: normalizeNullable(raw.district, null),
    tags: normalizeArray(raw.tags),
    isFree: normalizeBoolean(raw.isFree, false),
    priceLabel: normalizeNullable(raw.priceLabel, null),
    updatedAt: normalizeNullable(raw.updatedAt, null)
  };
}

export function validateEvent(event = {}) {
  const errors = [];

  if (!isNonEmptyString(event.id)) errors.push("Missing event id");
  if (!isNonEmptyString(event.title)) errors.push("Missing event title");
  if (!isNonEmptyString(event.category)) errors.push("Missing event category");
  if (!isNonEmptyString(event.date)) errors.push("Missing event date");
  if (!isNonEmptyString(event.dateLabel)) errors.push("Missing event dateLabel");
  if (!isNumber(event.lat)) errors.push("Invalid latitude");
  if (!isNumber(event.lng)) errors.push("Invalid longitude");

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function normalizeEvents(rawEvents = []) {
  return rawEvents
    .map(normalizeSeedEvent)
    .filter((event) => validateEvent(event).isValid);
}