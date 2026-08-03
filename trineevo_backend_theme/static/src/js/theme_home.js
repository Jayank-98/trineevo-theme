/** @odoo-module **/

import { browser } from "@web/core/browser/browser";
import { router } from "@web/core/browser/router";
import { registry } from "@web/core/registry";
import { patch } from "@web/core/utils/patch";
import { useService } from "@web/core/utils/hooks";
import { computeAppsAndMenuItems } from "@web/webclient/menus/menu_helpers";
import { standardActionServiceProps } from "@web/webclient/actions/action_service";
import { WebClient } from "@web/webclient/webclient";
import { Component, useState } from "@odoo/owl";

export const TRINEEVO_HOME_ACTION = "trineevo_backend_theme.home";

const CATEGORY_DEFINITIONS = [
    { id: "all", label: "All", terms: [] },
    { id: "sales", label: "Sales", terms: ["sales", "sale", "crm", "invoice", "invoicing", "pos"] },
    { id: "finance", label: "Finance", terms: ["account", "finance", "billing", "expense"] },
    { id: "operations", label: "Operations", terms: ["inventory", "stock", "purchase", "manufacturing", "fleet"] },
    { id: "services", label: "Services", terms: ["project", "helpdesk", "field", "planning", "timesheet"] },
    { id: "people", label: "People", terms: ["employee", "hr", "recruit", "attendance", "time off", "appraisal"] },
    { id: "website", label: "Website", terms: ["website", "ecommerce", "event", "survey", "marketing"] },
    { id: "settings", label: "Settings", terms: ["settings", "apps", "custom"] },
];

function normalize(value) {
    return String(value || "").toLowerCase();
}

function appHaystack(app) {
    return normalize(`${app.name} ${app.xmlid || ""} ${app.actionPath || ""}`);
}

function menuEntryHaystack(entry) {
    return normalize(`${entry.label} ${entry.parents || ""} ${entry.xmlid || ""} ${entry.href || ""}`);
}

function searchTerms(query) {
    return normalize(query).trim().split(/\s+/).filter(Boolean);
}

function matchesMenuEntry(entry, terms) {
    const haystack = menuEntryHaystack(entry);
    return terms.every((term) => haystack.includes(term));
}

function getAppCategory(app) {
    const haystack = appHaystack(app);
    return CATEGORY_DEFINITIONS.find(
        (category) => category.id !== "all" && category.terms.some((term) => haystack.includes(term))
    )?.id || "all";
}

function getAppHref(app) {
    return `/odoo/${app.actionPath || `action-${app.actionID}`}`;
}

function getInitials(value) {
    return String(value || "?")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
}

function isBareBackendRoute() {
    const pathname = browser.location.pathname.replace(/\/+$/, "") || "/odoo";
    const route = router.current || {};
    return (
        pathname === "/odoo" &&
        !route.action &&
        !route.model &&
        !route.menu_id &&
        !route.resId &&
        !route.actionStack?.length
    );
}

export class TrineEvoHomeAction extends Component {
    static template = "trineevo_backend_theme.HomeAction";
    static props = { ...standardActionServiceProps };
    static path = "apps";
    static displayName = "Apps";

    setup() {
        this.menuService = useService("menu");
        this.state = useState({
            query: "",
            category: "all",
        });
        this.env.config.setDisplayName("Apps");
    }

    get apps() {
        return this.menuService.getApps();
    }

    get allMenuEntries() {
        const { apps, menuItems } = computeAppsAndMenuItems(this.menuService.getMenuAsTree("root"));
        const appEntries = apps.map((app) => ({
            ...app,
            type: "app",
            label: app.label || app.name,
            menu: this.menuService.getMenu(app.id),
            sublabel: "Application",
        }));
        const menuEntries = menuItems.map((menuItem) => {
            const menu = this.menuService.getMenu(menuItem.id);
            const app = this.menuService.getMenu(menuItem.appID);
            return {
                ...menuItem,
                type: "menu",
                menu,
                app,
                webIconData: app?.webIconData,
                label: menuItem.label || menu?.name,
                sublabel: menuItem.parents || app?.name || "Menu",
            };
        });
        return [...appEntries, ...menuEntries];
    }

    get categories() {
        return CATEGORY_DEFINITIONS;
    }

    get activeCategoryLabel() {
        return this.categories.find((category) => category.id === this.state.category)?.label || "All";
    }

    get searchResults() {
        const terms = searchTerms(this.state.query);
        if (!terms.length) {
            return [];
        }
        return this.allMenuEntries.filter((entry) => matchesMenuEntry(entry, terms));
    }

    get displayedCards() {
        if (searchTerms(this.state.query).length) {
            return this.searchResults.slice(0, 48);
        }
        return this.apps.filter((app) => {
            const categoryMatches = this.state.category === "all" || getAppCategory(app) === this.state.category;
            return categoryMatches;
        }).map((app) => ({
            type: "app",
            menu: app,
            label: app.name,
            sublabel: "",
            webIconData: app.webIconData,
            href: getAppHref(app),
            id: app.id,
            xmlid: app.xmlid,
        }));
    }

    get emptyMessage() {
        return this.state.query ? "No menu matches this search." : "No apps match this category.";
    }

    get resultSummary() {
        const query = this.state.query.trim();
        if (!query) {
            return "";
        }
        const count = this.searchResults.length;
        if (count > 48) {
            return `Showing 48 of ${count} menu results`;
        }
        return `${count} menu ${count === 1 ? "result" : "results"}`;
    }

    getCardHref(card) {
        if (card.href) {
            return card.href;
        }
        const menu = card.menu || this.menuService.getMenu(card.id);
        return menu ? getAppHref(menu) : "/odoo";
    }

    getCardIconData(card) {
        return card.webIconData || card.menu?.webIconData || card.app?.webIconData;
    }

    getCardName(card) {
        return card.label || card.name || card.menu?.name || "";
    }

    getCardMeta(card) {
        return card.sublabel || card.parents || "";
    }

    isMenuCard(card) {
        return card.type === "menu";
    }

    getCardInitials(card) {
        return getInitials(this.getCardName(card));
    }

    onCardClick(card, ev) {
        if (ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.altKey || ev.button) {
            return;
        }
        const menu = card.menu || this.menuService.getMenu(card.id);
        if (!menu) {
            return;
        }
        ev.preventDefault();
        this.menuService.selectMenu(menu);
    }

    getAppHref(app) {
        return getAppHref(app);
    }

    getAppInitials(app) {
        return getInitials(app.name);
    }

    setCategory(category) {
        this.state.category = category;
    }

    clearFilters() {
        this.state.category = "all";
    }

    onSearchInput(ev) {
        this.state.query = ev.target.value;
    }

    onAppClick(app, ev) {
        if (ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.altKey || ev.button) {
            return;
        }
        ev.preventDefault();
        this.menuService.selectMenu(app);
    }
}

const actionRegistry = registry.category("actions");
if (!actionRegistry.contains(TRINEEVO_HOME_ACTION)) {
    actionRegistry.add(TRINEEVO_HOME_ACTION, TrineEvoHomeAction);
}

patch(WebClient.prototype, {
    async loadRouterState() {
        if (isBareBackendRoute()) {
            await this.actionService.doAction(TRINEEVO_HOME_ACTION, {
                clearBreadcrumbs: true,
                noEmptyTransition: true,
            });
            return;
        }
        return super.loadRouterState(...arguments);
    },

    async _loadDefaultApp() {
        return this.actionService.doAction(TRINEEVO_HOME_ACTION, {
            clearBreadcrumbs: true,
            noEmptyTransition: true,
        });
    },
});
