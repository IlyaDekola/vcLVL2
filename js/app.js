import { APP_CONFIG } from "./config/app.config.js";
import { EVENTS_SEED } from "./data/events.seed.js";
import { setEvents, getAllEvents, getEventsCount } from "./core/events-store.js";
import { getState, subscribe, updateState } from "./core/state.js";
import { normalizeEvents } from "./core/normalizers.js";
import { applyFilters, getAvailableDateOptions } from "./core/filters.js";

let mapInstance = null;
let markersLayer = null;

function initMap() {
  mapInstance = L.map("map").setView(
    APP_CONFIG.defaultCenter,
    APP_CONFIG.defaultZoom
  );

  L.tileLayer(APP_CONFIG.mapTileUrl, {
    attribution: APP_CONFIG.mapAttribution,
    maxZoom: APP_CONFIG.maxZoom
  }).addTo(mapInstance);

  markersLayer = L.layerGroup().addTo(mapInstance);

  updateState((draft) => {
    draft.ui.mapReady = true;
  });
}

function renderMarkers(events) {
  if (!markersLayer) return;

  markersLayer.clearLayers();

  events.forEach((event) => {
    if (typeof event.lat !== "number" || typeof event.lng !== "number") return;

    const marker = L.circleMarker([event.lat, event.lng], {
      radius: 8,
      color: "#ffffff",
      weight: 2,
      fillColor: "#2563eb",
      fillOpacity: 0.9
    });

    marker.bindPopup(`
      <strong>${event.title}</strong><br />
      ${event.dateLabel} · ${event.time}<br />
      ${event.venue}<br />
      ${event.address}
    `);

    marker.addTo(markersLayer);
  });
}

function renderStats(events) {
  const statsBar = document.getElementById("stats-bar");
  const totalCount = getEventsCount();
  const visibleCount = events.length;
  const selectedDate = getState().filters.selectedDate;

  statsBar.innerHTML = `
    <div class="stat-line">
      Всего событий: <strong>${totalCount}</strong><br />
      После фильтрации: <strong>${visibleCount}</strong><br />
      Дата: <strong>${selectedDate === "all" ? "Все даты" : selectedDate}</strong>
    </div>
  `;
}

function renderEventsList(events) {
  const container = document.getElementById("events-content");

  if (!events.length) {
    container.innerHTML = "<p>События не найдены.</p>";
    return;
  }

  container.innerHTML = events
    .map(
      (event) => `
        <article class="event-item" data-event-id="${event.id}">
          <h3 class="event-title">${event.title}</h3>
          <p class="event-meta">${event.dateLabel} · ${event.time}</p>
          <p class="event-meta">${event.venue}</p>
          <p class="event-meta">${event.category}</p>
        </article>
      `
    )
    .join("");
}

function renderFilters(events) {
  const container = document.getElementById("filters-content");
  const options = getAvailableDateOptions(events);
  const currentDate = getState().filters.selectedDate;

  const buttons = [
    `<button data-date="all">Все</button>`,
    ...options.map(
      (option) =>
        `<button data-date="${option.value}">${option.label}</button>`
    )
  ].join("");

  container.innerHTML = `
    <div>
      <p><strong>Дата</strong></p>
      <div>${buttons}</div>
    </div>
  `;

  container.querySelectorAll("[data-date]").forEach((button) => {
    const isActive = button.dataset.date === currentDate;
    if (isActive) {
      button.style.fontWeight = "700";
      button.style.color = "white";
      button.style.background = "#2563eb";
      button.style.border = "none";
      button.style.padding = "8px 12px";
      button.style.borderRadius = "8px";
      button.style.margin = "0 8px 8px 0";
    } else {
      button.style.padding = "8px 12px";
      button.style.borderRadius = "8px";
      button.style.border = "1px solid #d9dce3";
      button.style.margin = "0 8px 8px 0";
      button.style.background = "white";
    }

    button.addEventListener("click", () => {
      updateState((draft) => {
        draft.filters.selectedDate = button.dataset.date;
      });
    });
  });
}

function renderApp() {
  const allEvents = getAllEvents();
  const state = getState();
  const filteredEvents = applyFilters(allEvents, state.filters);

  renderStats(filteredEvents);
  renderEventsList(filteredEvents);
  renderFilters(allEvents);
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

  console.log("App started:", {
    app: APP_CONFIG.appName,
    eventsLoaded: normalizedEvents.length
  });
}

bootstrap();