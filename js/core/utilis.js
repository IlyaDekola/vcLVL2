export function unique(values = []) {
  return [...new Set(values)];
}

export function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function isNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

export function cloneArray(arr = []) {
  return Array.isArray(arr) ? [...arr] : [];
}

export function cloneObject(obj = {}) {
  return obj && typeof obj === "object" ? { ...obj } : {};
}

export function sortByString(items = [], getter) {
  return [...items].sort((a, b) => {
    const aValue = getter(a) ?? "";
    const bValue = getter(b) ?? "";
    return String(aValue).localeCompare(String(bValue), "ru");
  });
}

export function sortByNumber(items = [], getter) {
  return [...items].sort((a, b) => {
    const aValue = Number(getter(a) ?? 0);
    const bValue = Number(getter(b) ?? 0);
    return aValue - bValue;
  });
}

export function groupBy(items = [], getKey) {
  return items.reduce((acc, item) => {
    const key = getKey(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

export function getUniqueValues(items = [], getKey) {
  return unique(items.map(getKey).filter(Boolean));
}