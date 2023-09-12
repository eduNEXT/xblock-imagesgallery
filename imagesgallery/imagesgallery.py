"""TO-DO: Write a description of what this XBlock is."""

import re
import logging
import pkg_resources
from django.utils import translation
from xblock.core import XBlock
from xblock.fragment import Fragment
from xblockutils.resources import ResourceLoader

from django.conf import settings

from urllib.parse import urljoin
from http import HTTPStatus

from webob.response import Response

try:
    from openedx.core.djangoapps.site_configuration import helpers as configuration_helpers
    from xmodule.contentstore.content import StaticContent
    from cms.djangoapps.contentstore.views.assets import update_course_run_asset
    from xmodule.contentstore.django import contentstore
    from opaque_keys.edx.keys import AssetKey
except ImportError:
    configuration_helpers = None
    StaticContent = None
    update_course_run_asset = None
    contentstore = None
    AssetKey = None


log = logging.getLogger(__name__)


IMAGE_CONTENT_TYPE_FOR_MONGO = {
    '$or': [
        {'contentType':
            {'$in':
                [
                    'image/png',
                    'image/jpeg',
                    'image/jpg',
                    'image/gif',
                    'image/tiff',
                    'image/tif',
                    'image/x-icon',
                    'image/svg+xml',
                    'image/bmp',
                    'image/x-ms-bmp'
                ]
            }
        }
    ]
}


class ImagesGalleryXBlock(XBlock):
    """XBlock for displaying a gallery of images."""

    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")

    # TO-DO: change this view to display your data your own way.
    def student_view(self, context=None):
        """
        The primary view of the ImagesGalleryXBlock, shown to students
        when viewing courses.
        """
        if context:
            pass  # TO-DO: do something based on the context.

        # Remove the bundle default generated by webpack
        script_to_remove = r'<script defer="defer" src="bundle.js"></script>'

        html = self.resource_string("static/html/index.html")
        html_without_script = re.sub(script_to_remove, '', html)
        frag = Fragment(html_without_script.format(self=self))
        frag.add_css(self.resource_string("static/css/imagesgallery.css"))

        # Add i18n js
        statici18n_js_url = self._get_statici18n_js_url()
        if statici18n_js_url:
            frag.add_javascript_url(self.runtime.local_resource_url(self, statici18n_js_url))

        # Adding the correct route of the bundle
        frag.add_javascript(self.resource_string("static/html/bundle.js"))
        frag.initialize_js('ImagesGalleryXBlock')
        return frag

    @XBlock.handler
    def file_upload(self, request, suffix=''):
        """Handler for file upload to the course assets."""
        contents = []
        for _, file in request.params.items():
            try:
                content = update_course_run_asset(self.course_id, file.file)
                content.append(content)
            except Exception as e:  # pylint: disable=broad-except
                log.exception(e)
                return Response(status=HTTPStatus.INTERNAL_SERVER_ERROR)
        serialized_contents = [self.get_asset_json_from_content(content) for content in contents]
        return Response(
            status=HTTPStatus.OK,
            json_body=serialized_contents,
        )

    @XBlock.json_handler
    def get_files(self, data, suffix=''):
        """Handler for getting images from the course assets."""
        return self.get_paginated_contents(
            current_page=int(data.get("current_page", 0)),
            page_size=int(data.get("page_size", 10)),
        )

    @XBlock.json_handler
    def remove_files(self, data, suffix=''):
        """Handler for removing images from the course assets."""
        asset_key = AssetKey.from_string(data.get("asset_key"))
        try:
            from cms.djangoapps.contentstore.asset_storage_handler import delete_asset  # pylint: import-outside-toplevel
        except ImportError:
            from cms.djangoapps.contentstore.views.assets import delete_asset  # pylint: import-outside-toplevel
        delete_asset(self.course_id, asset_key)

    def get_asset_json_from_content(self, content):
        """Serialize the content object to a JSON serializable object. """
        asset_url = StaticContent.serialize_asset_key_with_slash(content.location)
        thumbnail_url = StaticContent.serialize_asset_key_with_slash(content.thumbnail_location)
        return {
            "id": str(content.get_id()),
            "asset_key": str(content.location),
            "display_name": content.name,
            "url": str(asset_url),
            "content_type": content.content_type,
            "file_size": content.length,
            "external_url": urljoin(configuration_helpers.get_value('LMS_ROOT_URL', settings.LMS_ROOT_URL), asset_url),
            "thumbnail": urljoin(configuration_helpers.get_value('LMS_ROOT_URL', settings.LMS_ROOT_URL), thumbnail_url),
        }

    def get_asset_json_from_dict(self, asset):
        """Transform the asset dictionary into a JSON serializable object."""
        asset_url = StaticContent.serialize_asset_key_with_slash(asset["asset_key"])
        thumbnail_url = self._get_thumbnail_asset_key(asset)
        return {
            "id": asset["_id"],
            "asset_key": str(asset["asset_key"]),
            "display_name": asset["displayname"],
            "url": str(asset_url),
            "content_type": asset["contentType"],
            "file_size": asset["length"],
            "external_url": urljoin(configuration_helpers.get_value('LMS_ROOT_URL', settings.LMS_ROOT_URL), asset_url),
            "thumbnail": urljoin(configuration_helpers.get_value('LMS_ROOT_URL', settings.LMS_ROOT_URL), thumbnail_url),
        }

    def _get_thumbnail_asset_key(self, asset):
        """Return the thumbnail asset key."""
        thumbnail_location = asset.get('thumbnail_location', None)
        thumbnail_asset_key = None

        if thumbnail_location:
            thumbnail_path = thumbnail_location[4]
            thumbnail_asset_key = self.course_id.make_asset_key('thumbnail', thumbnail_path)
        return str(thumbnail_asset_key)

    def get_paginated_contents(self, current_page=0, page_size=10):
        """Return the assets paginated list."""
        query_options = {
            "current_page": current_page,
            "page_size": page_size,
            "sort": {},
            "filter_params": IMAGE_CONTENT_TYPE_FOR_MONGO,
        }
        assets, total_count = self._get_assets_for_page(self.course_id, query_options)
        serialized_assets = []
        for asset in assets:
            serialized_assets.append(self.get_asset_json_from_dict(asset))
        return {
            "files": serialized_assets,
            "total_count": total_count,
        }

    def _get_assets_for_page(self, course_key, options):
        """Return course content for given course and options."""
        current_page = options["current_page"]
        page_size = options["page_size"]
        sort = options["sort"]
        filter_params = options["filter_params"] if options["filter_params"] else None
        start = current_page * page_size
        return contentstore().get_all_content_for_course(
            course_key, start=start, maxresults=page_size, sort=sort, filter_params=filter_params
        )


    # TO-DO: change this to create the scenarios you'd like to see in the
    # workbench while developing your XBlock.
    @staticmethod
    def workbench_scenarios():
        """A canned scenario for display in the workbench."""
        return [
            ("ImagesGalleryXBlock",
             """<imagesgallery/>
             """),
            ("Multiple ImagesGalleryXBlock",
             """<vertical_demo>
                <imagesgallery/>
                <imagesgallery/>
                <imagesgallery/>
                </vertical_demo>
             """),
        ]

    @staticmethod
    def _get_statici18n_js_url():
        """
        Returns the Javascript translation file for the currently selected language, if any.
        Defaults to English if available.
        """
        locale_code = translation.get_language()
        if locale_code is None:
            return None
        text_js = 'public/js/translations/{locale_code}/text.js'
        lang_code = locale_code.split('-')[0]
        for code in (locale_code, lang_code, 'en'):
            loader = ResourceLoader(__name__)
            if pkg_resources.resource_exists(
                    loader.module_name, text_js.format(locale_code=code)):
                return text_js.format(locale_code=code)
        return None

    @staticmethod
    def get_dummy():
        """
        Dummy method to generate initial i18n
        """
        return translation.gettext_noop('Dummy')
