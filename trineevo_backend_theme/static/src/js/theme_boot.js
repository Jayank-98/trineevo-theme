/** @odoo-module **/

const MODULE_CLASS = "o_trineevo_backend_theme";
const MODE_KEY = "trineevo_backend_theme_mode";
const DENSITY_KEY = "trineevo_backend_theme_density";
const VALID_MODES = new Set(["light", "dark"]);
const VALID_DENSITIES = new Set(["comfortable", "compact"]);

function readPreference(key, fallback, validValues) {
    try {
        const value = window.localStorage.getItem(key);
        return validValues.has(value) ? value : fallback;
    } catch {
        return fallback;
    }
}

function applyRootState() {
    const root = document.documentElement;
    const mode = readPreference(MODE_KEY, "light", VALID_MODES);
    const density = readPreference(DENSITY_KEY, "comfortable", VALID_DENSITIES);

    root.classList.add(MODULE_CLASS);
    root.dataset.teTheme = mode;
    root.dataset.teDensity = density;

    if (document.body) {
        document.body.classList.add(MODULE_CLASS);
    }
}

applyRootState();

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyRootState, { once: true });
}

