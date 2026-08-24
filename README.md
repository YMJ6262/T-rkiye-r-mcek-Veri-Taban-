# World Spider Guide

An interactive, multilingual spider encyclopedia, species map, and emergency symptom diagnostic portal.

## 🚀 Features
- **Dynamic Search & Filter:** Filter species by continent, toxicity levels, and search strings.
- **Interactive Habitat Map:** Built using Leaflet.js to visualize global distributions.
- **Step-by-Step Diagnostic Wizard:** Diagnostic flow for identifying spider bites and viewing first-aid instructions.
- **Multilingual Support:** Instant toggle between English and Turkish.

## 📂 Project Structure
- `index.html` — Application entry point.
- `css/app.css` — Custom layout and theme styles.
- `js/app.js` — Application logic, dynamic rendering, and event handlers.
- `data/species.json` — Species database.

## 🐞 Bugs found and fixed in this pass

1. **Missing data file (site was broken on load).** `app.js` fetches `data/species.json`, but that file did not exist anywhere in the project — the species data only existed as a loose `.txt` upload. The grid, map, and search were all empty. → Added `data/species.json` with the real dataset.
2. **Wrong folder structure.** `index.html` references `css/app.css` and `js/app.js`, but the uploaded files sat in the project root with no `css/`/`js/` folders. → Reorganized into `css/`, `js/`, `data/`.
3. **~80% of the UI text was never translated.** The `translations` object only covered a handful of strings (page title, subtitle, search placeholder, a couple of section titles). Every diagnostic wizard label, all four filter dropdown options, the checkboxes, the "Back"/"Next"/"Restart" buttons, and the medical disclaimer were hardcoded in English and stayed in English even after switching to Turkish. → Extended `translations` to cover every visible string and wired each one up in `renderApp()`.
4. **Diagnosis results ignored the language toggle.** `evaluateDiagnosis()` built its risk title, species guess, and first-aid steps from hardcoded English strings, so a Turkish-speaking user who finished the wizard still got an English result. It also didn't re-render if you switched language after finishing. → Localized every result string and added a re-render on language switch.
5. **Broken map markers.** Leaflet's default marker icon resolves image paths relative to the page URL rather than the CDN, which reliably produces broken/missing marker icons when `leaflet.js` is pulled from a CDN like this project does. → Explicitly set `L.Icon.Default` image URLs.
6. **Silent empty search results.** Filtering to zero matches (e.g. searching Australian species with the North America filter active) left a blank grid with no explanation. → Added an empty-state message.
7. **Search only matched the active language.** Typing a Turkish species name while the UI was in English (or vice versa) returned no results. → Search now checks both `name.en` and `name.tr`.
8. **Modal could only be closed via the × button.** Clicking the dark overlay or pressing Escape did nothing. → Both now close the modal.
9. **`<html lang>` and the SEO `<title>`/meta description never updated** when switching languages, despite being tagged with ids that implied they should. → Now synced in `renderApp()`.
10. **Accessibility:** added visible keyboard-focus outlines to buttons, inputs, and checkboxes.
11. **Map mixed dozens of languages/scripts.** The standard OSM tile layer renders every place name in that region's own local script — 北京市, موريتانيا, Magyarország — so a single world view showed labels in whatever language each area's OSM data happens to use.
    → First attempt (reverted): Wikimedia's `osm-intl` tile layer. This turned out to be a dead end — Wikimedia blocks tile requests from any site that isn't Wikimedia's own, returning `403 Forbidden: Map tiles are restricted to Wikimedia & affiliated sites only`, so the map failed to load entirely.
    → Actual fix: switched to **Esri's "Dark Gray Canvas"** basemap (`World_Dark_Gray_Base` + `World_Dark_Gray_Reference`), a free, no-API-key basemap designed as a muted dark background for data markers — a better visual fit for this site's theme than plain OSM, and it labels places in English rather than local scripts at the world/country zoom levels this app uses. *Disclosed caveat:* Esri's own docs note a few densely-mapped regions (mainly Europe at street-level zoom) can show a local-language label alongside the English one — not relevant at the zoom levels this map actually uses, but worth knowing about.
    → Also added: an automatic fallback. If the primary basemap's tiles ever fail to load — whatever the reason — the map now switches itself to the standard OpenStreetMap layer instead of silently showing a blank/broken grid, so a future provider change can't break the map the way the Wikimedia one did.

The visual design itself was left as-is — the dark, high-contrast theme was already coherent and intentional, so this pass focused purely on functional correctness.
