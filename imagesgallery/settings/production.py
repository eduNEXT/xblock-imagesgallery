"""
Settings for the Images Gallery XBlock.
"""


def plugin_settings(settings):
    """
    Read / Update necessary common project settings.
    """
    settings.IMAGES_GALLERY_SITE_CONFIGURATION_BACKEND = getattr(settings, "ENV_TOKENS", {}).get(
        "IMAGES_GALLERY_SITE_CONFIGURATION_BACKEND",
        settings.IMAGES_GALLERY_SITE_CONFIGURATION_BACKEND,
    )
    settings.IMAGES_GALLERY_CONTENTSTORE_BACKEND = getattr(settings, "ENV_TOKENS", {}).get(
        "IMAGES_GALLERY_CONTENTSTORE_BACKEND",
        settings.IMAGES_GALLERY_CONTENTSTORE_BACKEND,
    )
