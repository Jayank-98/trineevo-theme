# -*- coding: utf-8 -*-

{
    "name": "TrineEvo Backend Theme",
    "summary": "Modern responsive backend theme for Odoo 19.0 Community",
    "description": """
Modern backend UI theme for Odoo 19.0 Community.
Improves backend layout, app launcher, forms, lists, kanban,
search, pivot, graph, dialogs, buttons, responsiveness, and accessibility.
Does not change business features, workflows, security, or models.
""",
    "version": "19.0.1.0.0",
    "category": "Themes/Backend",
    "author": "TrineEvo Info Tech",
    "website": "https://trineevo.com",
    "license": "LGPL-3",
    "depends": ["web"],
    "data": [],
    "assets": {
        "web.assets_backend": [
            "trineevo_backend_theme/static/src/scss/**/*.scss",
            "trineevo_backend_theme/static/src/js/**/*.js",
            "trineevo_backend_theme/static/src/xml/**/*.xml",
        ],
    },
    "installable": True,
    "application": False,
    "auto_install": False,
}

