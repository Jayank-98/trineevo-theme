# TrineEvo Backend Theme

Modern responsive backend UI theme for Odoo 19.0 Community Edition.

## Purpose

`trineevo_backend_theme` improves the visual experience of the standard Odoo backend without changing business behavior. It is a frontend-only theme for the web client.

## Supported Odoo Version

- Odoo 19.0 Community Edition

## Dependency Rule

This module depends only on `web`.

It does not depend on mail, sale, crm, account, stock, purchase, project, hr, enterprise modules, OCA modules, or custom modules.

## Features

- Modern light SaaS-style backend surfaces
- Improved app launcher styling for the standard Apps screen
- Cleaner top navigation and app menu sidebar visuals
- Refined control panel, breadcrumbs, search, filter, group by, favorites, view switcher, and pager styling
- Improved list, form, kanban, pivot, and graph view appearance
- Better dialog, popup, wizard, and button styling
- Responsive layout improvements for desktop, laptop, tablet, and mobile
- Accessible focus-visible states and reduced-motion support
- Optional frontend-only theme and density attributes using browser `localStorage`

## Installation

1. Copy the module into an Odoo addons path.
2. Restart the Odoo server.
3. Update the Apps list.
4. Install `TrineEvo Backend Theme`.

## Upgrade

1. Pull or copy the updated module files.
2. Restart the Odoo server.
3. Upgrade the module from Apps or with `-u trineevo_backend_theme`.
4. Clear browser assets if old styles are cached.

## What This Module Does Not Change

- No models
- No controllers
- No access rights
- No security groups
- No record rules
- No menu records
- No backend actions
- No business dashboards
- No ORM logic
- No create, write, unlink, or workflow logic
- No search domains, filters, or grouping behavior
- No RPC calls for business data
- No external libraries or CDN assets

The Home button remains the standard Odoo Apps/App Launcher screen only.

## Optional Local Preferences

The JavaScript reads these browser-only keys:

- `trineevo_backend_theme_mode`: `light` or `dark`
- `trineevo_backend_theme_density`: `comfortable` or `compact`

These values are stored only in the user's browser. The module does not create backend settings or database-stored preferences.

## Testing Checklist

- Module installs successfully
- Module upgrades successfully
- Backend assets compile successfully
- No browser console errors
- No server errors
- Apps screen remains an app launcher only
- List, form, kanban, pivot, graph, dialogs, pagination, view switcher, and search/filter menus work normally
- Create, edit, save, discard, delete, import/export, search, filter, group by, favorites, pagination, and view switching behave like standard Odoo
- Layout remains usable at desktop, laptop, tablet, and mobile widths
- Access rights and business logic remain unchanged

