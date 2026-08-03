/** @odoo-module **/

const MODE_KEY = "trineevo_backend_theme_mode";
const DENSITY_KEY = "trineevo_backend_theme_density";
const VALID_MODES = new Set(["light", "dark"]);
const VALID_DENSITIES = new Set(["comfortable", "compact"]);

function getStoredValue(key, fallback, validValues) {
    try {
        const value = window.localStorage.getItem(key);
        return validValues.has(value) ? value : fallback;
    } catch {
        return fallback;
    }
}

function applyPreferences() {
    document.documentElement.dataset.teTheme = getStoredValue(MODE_KEY, "light", VALID_MODES);
    document.documentElement.dataset.teDensity = getStoredValue(DENSITY_KEY, "comfortable", VALID_DENSITIES);
}

window.addEventListener("storage", (event) => {
    if (event.key === MODE_KEY || event.key === DENSITY_KEY) {
        applyPreferences();
    }
});

window.addEventListener("trineevo_backend_theme:preferences-changed", applyPreferences);

applyPreferences();

