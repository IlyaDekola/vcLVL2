## Цель - cобрать масштабируемую карту событий Минска на стеке HTML + CSS + JavaScript + Leaflet.
Для первой рабочей версии копируем 1в1 существующий прототип – https://minsk-pulse-live.base44.app/

Проект с самого начала проектируется так, чтобы:
- можно было добавлять новые категории событий;
- можно было подключать отдельный метод поиска и сбора данных под каждую категорию;
- можно было менять интерфейс и UX без переписывания ядра приложения.



## MVP
Первая версия приложения должна уметь:
- отображать карту Минска;
- показывать события на карте в виде маркеров;
- хранить события в едином формате;
- хранить категории в отдельном конфиге;
- фильтровать события по дате;
- фильтровать события по категориям;
- открывать popup с информацией о событии;
- показывать список событий рядом с картой;
- работать на ручных seed-данных;
- быть подготовленной к будущему подключению source-модулей.



## Архитектурные принципы
Проект строится по принципу разделения ответственности:
- данные событий и категорий хранятся отдельно;
- логика фильтрации не зависит от UI;
- карта не зависит от способа получения данных;
- UI не должен знать, откуда пришли данные;
- новые категории должны добавляться через конфиг;
- новые источники данных должны подключаться через отдельные source-модули;
- смена UI/UX не должна ломать core-логику приложения.



## Структура проекта
vcLVL2/
├── index.html
├── README.md
├── css/
│   ├── tokens.css
│   ├── layout.css
│   ├── components.css
│   └── themes.css
├── js/
│   ├── app.js
│   ├── config/
│   │   ├── app.config.js
│   │   ├── categories.config.js
│   │   └── ui.config.js
│   ├── core/
│   │   ├── state.js
│   │   ├── events-store.js
│   │   ├── filters.js
│   │   ├── normalizers.js
│   │   └── utils.js
│   ├── data/
│   │   ├── categories.seed.js
│   │   └── events.seed.js
│   ├── sources/
│   │   ├── registry.js
│   │   ├── base-source.js
│   │   └── manual.source.js
│   ├── map/
│   │   ├── map.js
│   │   ├── markers.js
│   │   └── popups.js
│   └── ui/
│       ├── renderer.js
│       ├── filters-panel.js
│       ├── events-list.js
│       ├── event-card.js
│       └── toolbar.js
└── assets/


## Формат событий
{
  id: "festival-2026-04-18-001",
  title: "Япония.Фест",
  category: "festival",
  subcategory: null,
  date: "2026-04-18",
  dateLabel: "18 апреля",
  time: "10:00–21:00",
  venue: "ТЦ Океан",
  address: "пр. Дзержинского, 3Б",
  lat: 53.8715,
  lng: 27.4897,
  description: "Масштабный фестиваль японской культуры...",
  url: "https://japanfest.by/",
  sources: ["japanfest.by", "bycard.by"],
  sourceType: "manual",
  city: "Минск",
  district: null,
  tags: [],
  isFree: false,
  priceLabel: null,
  updatedAt: null
}



## Формат категории

Каждая категория описывается отдельным конфиг-объектом:
```js
{
  id: "cinema",
  label: "Кино",
  color: "#3B82F6",
  icon: "film",
  enabled: true,
  sortOrder: 20,
  sourceStrategy: "manual",
  searchProfile: "curated",
  ui: {
    markerStyle: "circle",
    cardVariant: "default"
  }
}
```