/** @odoo-module **/

import { registry } from "@web/core/registry";
import { user, userBus } from "@web/core/user";
import { useBus, useService } from "@web/core/utils/hooks";
import { Component, onMounted, onWillDestroy, useState } from "@odoo/owl";
import { TRINEEVO_HOME_ACTION } from "./theme_home";

const COLLAPSED_KEY = "trineevo_backend_theme_sidebar_collapsed";

function getAppHref(app) {
    return `/odoo/${app.actionPath || `action-${app.actionID}`}`;
}

function getAppInitials(app) {
    return String(app.name || "?")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
}

function getFirstWord(value, fallback = "Odoo") {
    return String(value || fallback).trim().split(/\s+/).filter(Boolean)[0] || fallback;
}

function getFirstLetter(value, fallback = "O") {
    return getFirstWord(value, fallback).charAt(0).toUpperCase() || fallback;
}

function readCollapsedPreference() {
    try {
        return window.localStorage.getItem(COLLAPSED_KEY) === "1";
    } catch {
        return false;
    }
}

function writeCollapsedPreference(value) {
    try {
        window.localStorage.setItem(COLLAPSED_KEY, value ? "1" : "0");
    } catch {
        return;
    }
}

export class TrineEvoSidebar extends Component {
    static template = "trineevo_backend_theme.Sidebar";
    static props = {};

    setup() {
        this.actionService = useService("action");
        this.menuService = useService("menu");
        this.state = useState({
            collapsed: readCollapsedPreference(),
            fullscreen: false,
            homeActive: true,
        });

        useBus(this.env.bus, "ACTION_MANAGER:UI-UPDATED", ({ detail: mode }) => {
            this.state.fullscreen = mode === "fullscreen";
            this.syncActiveState();
            this.syncLayoutClasses();
        });
        useBus(this.env.bus, "MENUS:APP-CHANGED", () => this.render());
        useBus(userBus, "ACTIVE_COMPANIES_CHANGED", () => this.render());

        onMounted(() => {
            this.syncActiveState();
            this.syncLayoutClasses();
        });
        onWillDestroy(() => {
            document.documentElement.classList.remove("o_te_has_sidebar", "o_te_sidebar_collapsed");
        });
    }

    get apps() {
        return this.menuService.getApps();
    }

    get activeCompanyName() {
        return user.activeCompany?.name || "Odoo";
    }

    get companyBrandName() {
        return getFirstWord(this.activeCompanyName);
    }

    get companyBrandInitial() {
        return getFirstLetter(this.activeCompanyName);
    }

    getAppHref(app) {
        return getAppHref(app);
    }

    getAppInitials(app) {
        return getAppInitials(app);
    }

    isActiveApp(app) {
        return !this.state.homeActive && this.menuService.getCurrentApp()?.id === app.id;
    }

    syncActiveState() {
        const action = this.actionService.currentController?.action;
        this.state.homeActive = action?.tag === TRINEEVO_HOME_ACTION || action?.path === "apps";
    }

    syncLayoutClasses() {
        const root = document.documentElement;
        root.classList.toggle("o_te_has_sidebar", !this.state.fullscreen);
        root.classList.toggle("o_te_sidebar_collapsed", !this.state.fullscreen && this.state.collapsed);
    }

    toggleCollapsed() {
        this.state.collapsed = !this.state.collapsed;
        writeCollapsedPreference(this.state.collapsed);
        this.syncLayoutClasses();
    }

    onHomeClick(ev) {
        if (ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.altKey || ev.button) {
            return;
        }
        ev.preventDefault();
        this.actionService.doAction(TRINEEVO_HOME_ACTION, {
            clearBreadcrumbs: true,
            noEmptyTransition: true,
        });
    }

    onAppClick(app, ev) {
        if (ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.altKey || ev.button) {
            return;
        }
        ev.preventDefault();
        this.menuService.selectMenu(app);
    }
}

const mainComponentsRegistry = registry.category("main_components");
if (!mainComponentsRegistry.contains("trineevo_backend_theme.Sidebar")) {
    mainComponentsRegistry.add("trineevo_backend_theme.Sidebar", {
        Component: TrineEvoSidebar,
    });
}
