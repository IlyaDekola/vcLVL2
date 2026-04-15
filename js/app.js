import { APP_CONFIG } from "./config/app.config.js";
import { EVENTS_SEED } from "./data/events.seed.js";
import { setEvents, getAllEvents } from "./core/events-store.js";
import { getState, subscribe, updateState } from "./core/state.js";
import { normalizeEvents } from "./core/normalizers.js";
import { applyFilters, getAvailableDateOptions } from "./core/filters.js";

let mapInstance = null;
let markersLayer = null;

const CATEGORY_META = {
  theatre: {
    label: "Театр",
    color: "#ef4444"
  },
  cinema: {
    label: "Кино",
    color: "#3b82f6"
  },
  exhibition: {
    label: "Выставка",
    color: "#8b5cf6"
  },
  festival: {
    label: "Фестиваль",
    color: "#f97316"
  },
  livemusic: {
    label: "Живая музыка",
    color: "#10b981"
  }
};

function getCategoryMeta(categoryId) {
  return (
    CATEGORY_META[categoryId] || {
      label: categoryId,
      color: "#64748b"
    }
  );
}

function initMap() {
  mapInstance = L.map("map", {
    zoomControl: true
  }).setView(APP_CONFIG.defaultCenter, APP_CONFIG.defaultZoom);

  L.tileLayer(APP_CONFIG.mapTileUrl, {
    attribution: APP_CONFIG.mapAttribution,
    maxZoom: APP_CONFIG.maxZoom
  }).addTo(mapInstance);

  markersLayer = L.layerGroup().addTo(mapInstance);

  updateState((draft) => {
    draft.ui.mapReady = true;
  });
}

function buildPopupContent(event) {
  const meta = getCategoryMeta(event.category);

  const sourcesLabel =
    event.sources && event.sources.length
      ? event.sources.join(", ")
      : null;

  return `
    <div class="popup-card">
      <div class="popup-toprow">
        <span class="popup-pill" style="background:${meta.color}">
          ${meta.label}
        </span>
        <span class="popup-date">${event.dateLabel}</span>
      </div>

      <h3 class="popup-title">${event.title}</h3>

      <p class="popup-venue">
        <span class="popup-icon">📍</span>${event.venue}
      </p>
      <p class="popup-time">
        <span class="popup-icon">⏰</span>${event.time}
      </p>

      ${
        event.description
          ? `<p class="popup-description">${event.description}</p>`
          : ""
      }

      ${
        sourcesLabel
          ? `<p class="popup-sources">
               <span class="popup-icon success">✔</span>
               Подтверждено: ${sourcesLabel}
             </p>`
          : ""
      }

      ${
        event.url
          ? `<a class="popup-link" href="${event.url}" target="_blank" rel="noopener noreferrer">
               Подробнее и билеты
             </a>`
          : ""
      }
    </div>
  `;
}

function renderMarkers(events) {
  if (!markersLayer) return;

  markersLayer.clearLayers();

  events.forEach((event) => {
    if (typeof event.lat !== "number" || typeof event.lng !== "number") return;

    const meta = getCategoryMeta(event.category);

    const marker = L.circleMarker([event.lat, event.lng], {
      radius: 11,
      color: "#ffffff",
      weight: 3,
      fillColor: meta.color,
      fillOpacity: 0.95
    });

    marker.bindPopup(buildPopupContent(event));
    marker.addTo(markersLayer);
  });
}

function renderTopStats(events) {
  const countNode = document.getElementById("found-count");
  countNode.textContent = `Найдено: ${events.length} событий`;
}

function renderDateFilters(allEvents) {
  const container = document.getElementById("date-filters");
  const options = getAvailableDateOptions(allEvents);
  const currentDate = getState().filters.selectedDate;

  const dateButtons = [
    { value: "all", label: "Все дни" },
    ...options.map((option) => ({
      value: option.value,
      label: option.label
    }))
  ];

  container.innerHTML = dateButtons
    .map((item) => {
      const activeClass = item.value === currentDate ? "is-active" : "";

      return `
        <button class="chip chip-date ${activeClass}" data-date="${item.value}">
          ${item.label}
        </button>
      `;
    })
    .join("");

  container.querySelectorAll("[data-date]").forEach((button) => {
    button.addEventListener("click", () => {
      updateState((draft) => {
        draft.filters.selectedDate = button.dataset.date;
      });
    });
  });
}

function renderCategoryFilters(allEvents) {
  const container = document.getElementById("category-filters");
  const activeCategories = getState().filters.activeCategories;

  const categoryIds = Array.from(new Set(allEvents.map((event) => event.category)));

  container.innerHTML = categoryIds
    .map((categoryId) => {
      const meta = getCategoryMeta(categoryId);
      const isActive = activeCategories.has(categoryId);
      const className = `chip chip-category ${isActive ? "" : "is-off"}`.trim();

      return `
        <button
          class="${className}"
          data-category="${categoryId}"
          style="background:${meta.color}"
        >
          ${meta.label}
        </button>
      `;
    })
    .join("");

  container.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      const categoryId = button.dataset.category;

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
    });
  });
}

function renderLegend(allEvents) {
  const container = document.getElementById("legend-content");
  const categoryIds = Array.from(new Set(allEvents.map((event) => event.category)));

  container.innerHTML = categoryIds
    .map((categoryId) => {
      const meta = getCategoryMeta(categoryId);

      return `
        <div class="legend-item">
          <span class="legend-dot" style="background:${meta.color}"></span>
          <span>${meta.label}</span>
        </div>
      `;
    })
    .join("");
}

function renderApp() {
  const allEvents = getAllEvents();
  const state = getState();
  const filteredEvents = applyFilters(allEvents, state.filters);

  renderTopStats(filteredEvents);
  renderDateFilters(allEvents);
  renderCategoryFilters(allEvents);
  renderLegend(allEvents);
  renderMarkers(filteredEvents);
}

function bootstrap() {
  const normalizedEvents = normalizeEvents(EVENTS_SEED);
  setEvents(normalizedEvents);

  initMap();
  renderApp();

  subscribe(() => {
    renderApp();
  });

  console.log("Map UI started", {
    eventsLoaded: normalizedEvents.length
  });
}

bootstrap();