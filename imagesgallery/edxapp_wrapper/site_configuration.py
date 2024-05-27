"""
Site Configuration module generalized definitions.
"""

from importlib import import_module

from django.conf import settings


def get_configuration_helpers():
    """
    Wrapper for `openedx.core.djangoapps.site_configuration.helpers` function in edx-platform.
    """
    backend_function = settings.IMAGES_GALLERY_SITE_CONFIGURATION_BACKEND
    backend = import_module(backend_function)

    return backend.helpers


configuration_helpers = get_configuration_helpers()
