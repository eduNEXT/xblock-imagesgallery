"""
Contentstore module generalized definitions.
"""

from importlib import import_module

from django.conf import settings


def get_static_content():
    """
    Wrapper for `xmodule.contentstore.content.StaticContent` in edx-platform.
    """
    backend_function = settings.IMAGES_GALLERY_CONTENTSTORE_BACKEND
    backend = import_module(backend_function)

    return backend.StaticContent


def contentstore(*args, **kwargs):
    """
    Wrapper method of `xmodule.contentstore.django.contentstore` in edx-platform.
    """
    backend_function = settings.IMAGES_GALLERY_CONTENTSTORE_BACKEND
    backend = import_module(backend_function)

    return backend.contentstore(*args, **kwargs)


def update_course_run_asset(*args, **kwargs):
    """
    Wrapper method of `cms.djangoapps.contentstore.views.assets.update_course_run_asset` in edx-platform.
    """
    backend_function = settings.IMAGES_GALLERY_CONTENTSTORE_BACKEND
    backend = import_module(backend_function)

    return backend.update_course_run_asset(*args, **kwargs)


StaticContent = get_static_content()
