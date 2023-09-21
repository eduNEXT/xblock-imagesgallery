"""TO-DO: Write a description of what this XBlock is."""

import logging
import os
from http import HTTPStatus
from urllib.parse import urljoin

import pkg_resources
from django.conf import settings
from django.utils import translation
from webob.response import Response
from xblock.core import XBlock
from xblock.fields import Scope, List
from xblock.fragment import Fragment
from xblockutils.resources import ResourceLoader


try:
    from opaque_keys.edx.keys import AssetKey
    from openedx.core.djangoapps.site_configuration import helpers as configuration_helpers
    from xmodule.contentstore.content import StaticContent
    from xmodule.contentstore.django import contentstore
except ImportError:
    configuration_helpers = None
    StaticContent = None
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

    contents = List(
        display_name="Static contents uploaded by the instructor.",
        default=[],
        scope=Scope.settings,
    )

    @property
    def block_id(self):
        """
        Return the usage_id of the block.
        """
        return str(self.scope_ids.usage_id)

    @property
    def block_id_parsed(self):
        """
        Return the usage_id of the block parsed which means all after '@' symbol.
        """
        return str(self.scope_ids.usage_id.block_id)

    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")

    def read_file(self, path: str):
        """Helper for reading a file using a relative path"""
        file_content = ''
        BASE_DIR = os.path.abspath(os.path.dirname(__file__))
        file_path = os.path.join(BASE_DIR, path)

        try:
            with open(file_path, 'r') as file_data:
                file_content = file_data.read()

        except FileNotFoundError as e:
            log.exception(e)

        return file_content

    # TO-DO: change this view to display your data your own way.
    def student_view(self, context=None):
        """
        The primary view of the ImagesGalleryXBlock, shown to students
        when viewing courses.
        """
        if context:
            pass  # TO-DO: do something based on the context.

        # Main function name for the XBlock
        js_xblock_function = f"XBlockMain{self.block_id_parsed}"
        react_app_root_id = f"images-gallery-app-root-{self.block_id_parsed}"

        # Read the JavaScript content from the bundle file
        js_content = self.read_file("static/html/bundle.js")
        if js_content:
            # Replace the default React app root with the new one and update the main function name
            new_content = js_content.replace('images-gallery-app-root', react_app_root_id)
            js_content = new_content.replace('ImagesGalleryXBlock', js_xblock_function)

        # Create the HTML fragment with the React app and JavaScript
        html = f"<div id='{react_app_root_id}'></div><script defer='defer'>{js_content}</script>"
        frag = Fragment(html)
        frag.add_css(self.resource_string("static/css/imagesgallery.css"))

        # Define the main function for the XBlock
        js_main_function = f"Main_{js_xblock_function}"

        # Define the parsed JavaScript content
        js_content_parsed = (
           f"function {js_main_function}(runtime, element, context) {{"
           f"{js_xblock_function}(runtime, element, context);"
           "}")

        # Handle the case where there's an error getting the bundle file
        if not js_content:
            js_content_parsed = (
                f"function {js_main_function}(runtime, element, context) {{"
                "console.error('Something went wrong with XBlock rendering');"
                "}")

        # Add i18n js
        statici18n_js_url = self._get_statici18n_js_url()
        if statici18n_js_url:
           frag.add_javascript_url(self.runtime.local_resource_url(self, statici18n_js_url))

        js_context  = {
           "xblock_id": self.block_id,
        }

        frag.add_javascript(js_content_parsed)
        frag.initialize_js(js_main_function, json_args=js_context)
        return frag

    def studio_view(self, context=None) -> Fragment:
        """
        The studio view of the ImagesGalleryXBlock, shown to instructors.

        Args:
            context (dict, optional): Context for the template. Defaults to None.

        Returns:
            Fragment: The fragment to render
        """
        if context:
            pass  # TO-DO: do something based on the context.

        # Main function name for the XBlock
        js_xblock_function = f"XBlockMain{self.block_id_parsed}"
        react_app_root_id = f"images-gallery-app-root-{self.block_id_parsed}-edit"

        # Read the JavaScript content from the bundle file
        js_content = self.read_file("static/html/bundle.js")
        if js_content:
            # Replace the default React app root with the new one and update the main function name
            new_content = js_content.replace('images-gallery-app-root', react_app_root_id)
            js_content = new_content.replace('ImagesGalleryXBlock', js_xblock_function)

        # Create the HTML fragment with the React app and JavaScript
        html = f"<div id='{react_app_root_id}'></div><script defer='defer'>{js_content}</script>"
        frag = Fragment(html)
        frag.add_css(self.resource_string("static/css/imagesgallery.css"))

        # Define the main function for the XBlock
        js_main_function = f"Main_{js_xblock_function}"

        # Define the parsed JavaScript content
        js_content_parsed = (
           f"function {js_main_function}(runtime, element, context) {{"
           f"{js_xblock_function}(runtime, element, context);"
           "}")

        # Handle the case where there's an error getting the bundle file
        if not js_content:
            js_content_parsed = (
                f"function {js_main_function}(runtime, element, context) {{"
                "console.error('Something went wrong with XBlock rendering');"
                "}")

        # Add i18n js
        statici18n_js_url = self._get_statici18n_js_url()
        if statici18n_js_url:
           frag.add_javascript_url(self.runtime.local_resource_url(self, statici18n_js_url))

        js_context  = {
           "xblock_id": self.block_id,
        }

        frag.add_javascript(js_content_parsed)
        frag.initialize_js(js_main_function, json_args=js_context)
        return frag

    @XBlock.handler
    def file_upload(self, request, suffix=''):  # pylint: disable=unused-argument
        """Handler for file upload to the course assets."""
        try:
            from cms.djangoapps.contentstore.views.assets import update_course_run_asset  # pylint: disable=import-outside-toplevel
        except ImportError:
            from cms.djangoapps.contentstore.asset_storage_handler import update_course_run_asset  # pylint: disable=import-outside-toplevel
        for _, file in request.params.items():
            try:
                content = update_course_run_asset(self.course_id, file.file)
                self.update_contents(content)
            except Exception as e:  # pylint: disable=broad-except
                log.exception(e)
                return Response(status=HTTPStatus.INTERNAL_SERVER_ERROR)
        return Response(
            status=HTTPStatus.OK,
            json_body=self.contents,
        )

    def update_contents(self, content):
        """
        Serializes the content object to a dictionary and appends it to the
        contents list.
        """
        self.contents.append(self.get_asset_json_from_content(content))

    @XBlock.json_handler
    def get_files(self, data, suffix=''):  # pylint: disable=unused-argument
        """Handler for getting images from the course assets."""
        paginated_contents = self.get_paginated_contents(
            current_page=int(data.get("current_page", 0)),
            page_size=int(data.get("page_size", 10)),
        )
        return {
            "files": paginated_contents,
            "total_count": len(paginated_contents),
        }

    @XBlock.json_handler
    def remove_files(self, data, suffix=''):  # pylint: disable=unused-argument
        """Handler for removing images from the course assets."""
        asset_key = AssetKey.from_string(data.get("asset_key"))
        # Temporary fix for supporting both contentstore assets management versions (master / Palm)
        try:
            from cms.djangoapps.contentstore.asset_storage_handler import delete_asset  # pylint: disable=import-outside-toplevel
        except ImportError:
            from cms.djangoapps.contentstore.views.assets import delete_asset  # pylint: disable=import-outside-toplevel
        delete_asset(self.course_id, asset_key)

        for content in self.contents:
            if content["asset_key"] == str(asset_key):
                self.contents.remove(content)
                break

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
        """
        Returns the contents list.
        """
        return self.contents[current_page * page_size: (current_page + 1) * page_size]

    # def get_paginated_contents(self, current_page=0, page_size=10):
    #     """Return the assets paginated list."""
    #     query_options = {
    #         "current_page": current_page,
    #         "page_size": page_size,
    #         "sort": {},
    #         "filter_params": IMAGE_CONTENT_TYPE_FOR_MONGO,
    #     }
    #     assets, total_count = self._get_assets_for_page(self.course_id, query_options)
    #     serialized_assets = []
    #     for asset in assets:
    #         serialized_assets.append(self.get_asset_json_from_dict(asset))
    #     return {
    #         "files": serialized_assets,
    #         "total_count": total_count,
    #     }

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
