"""
Settings for the Images Gallery XBlock.
"""


def plugin_settings(settings):
    """
    Read / Update necessary common project settings.
    """
    settings.IMAGES_GALLERY_SITE_CONFIGURATION_BACKEND = "imagesgallery.edxapp_wrapper.backends.site_configuration_r_v1"
    settings.IMAGES_GALLERY_CONTENTSTORE_BACKEND = "imagesgallery.edxapp_wrapper.backends.contentstore_r_v1"
