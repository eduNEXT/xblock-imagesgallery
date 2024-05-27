"""
Images Gallery Django application initialization.
"""

from django.apps import AppConfig


class ImagesGalleryConfig(AppConfig):
    """
    Configuration for the Images Gallery Django application.
    """

    name = "imagesgallery"

    plugin_app = {
        "settings_config": {
            "lms.djangoapp": {
                "common": {"relative_path": "settings.common"},
                "test": {"relative_path": "settings.test"},
                "production": {"relative_path": "settings.production"},
            },
            "cms.djangoapp": {
                "common": {"relative_path": "settings.common"},
                "test": {"relative_path": "settings.test"},
                "production": {"relative_path": "settings.production"},
            },
        },
    }
