"""Images Gallery XBlock."""
from __future__ import annotations

import logging
import os
from http import HTTPStatus
from urllib.parse import urljoin

from importlib.resources import files as importlib_files
from django.conf import settings
from django.utils import translation
from opaque_keys.edx.keys import AssetKey
from web_fragments.fragment import Fragment
from webob.response import Response
from xblock.core import XBlock
from xblock.fields import List, Scope
from xblock.reference.user_service import XBlockUser

from imagesgallery.edxapp_wrapper.contentstore import get_static_content, contentstore, update_course_run_asset
from imagesgallery.edxapp_wrapper.site_configuration import configuration_helpers

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
ATTR_KEY_ANONYMOUS_USER_ID = 'edx-platform.anonymous_user_id'


@XBlock.wants("user")
class ImagesGalleryXBlock(XBlock):
    """XBlock for displaying a gallery of images."""

    contents = List(
        display_name="Static contents uploaded by the instructor.",
        default=[],
        scope=Scope.settings,
    )

    content_names = List(
        display_name="Content ids of the static contents uploaded by the instructor.",
        default=[],
        scope=Scope.settings,
    )

    def get_current_user(self) -> XBlockUser:
        """
        Get the current user.
        """
        return self.runtime.service(self, "user").get_current_user()

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
        return importlib_files(__package__).joinpath(path).read_text(encoding="utf-8")

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
            "is_edit_view": False
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
           "is_edit_view": True,
        }

        frag.add_javascript(js_content_parsed)
        frag.initialize_js(js_main_function, json_args=js_context)
        return frag

    @XBlock.handler
    def file_upload(self, request, suffix=''):  # pylint: disable=unused-argument
        """Handler for file upload to the course assets."""
        uploaded_content = []
        for _, file in request.params.items():
            try:
                file.file._set_name(self.generate_file_name(file.file.name))  # pylint: disable=protected-access
                content = update_course_run_asset(self.course_id, file.file)
                uploaded_content.append(self.get_asset_json_from_content(content))
                self.update_contents(content)
            except Exception as e:  # pylint: disable=broad-except
                log.exception(e)
                return Response(status=HTTPStatus.INTERNAL_SERVER_ERROR)
        return Response(
            status=HTTPStatus.OK,
            json_body=uploaded_content,
        )

    def generate_file_name(self, file_name):
        """Generate a new file name if the file name already exists.

        Args:
            file_name (str): The file name to check.

        Returns:
            str: The new file name.
        """
        if file_name in self.content_names:
            file_name = f"{file_name} ({len(self.content_names)})"
        return file_name

    def update_contents(self, content):
        """
        Serializes the content object to a dictionary and appends it to the
        contents list.
        """
        self.contents.append(self.get_asset_json_from_content(content))
        self.content_names.append(content.name)

    @XBlock.json_handler
    def get_files(self, data, suffix=''):  # pylint: disable=unused-argument
        """Handler for getting images from the course assets."""
        # When inside the component edit view where there is no anonymous user ID, synchronize the assets.
        if not self.get_current_user().opt_attrs.get(ATTR_KEY_ANONYMOUS_USER_ID):
            self.sync_course_assets()

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
        assets = data.get("assets")

        for asset_key_id in assets:
            asset_key = AssetKey.from_string(asset_key_id)

            for content in self.contents:
                if content["asset_key"] == str(asset_key):
                    self.contents.remove(content)
                    self.content_names.remove(content["display_name"])
                    break

    def get_asset_json_from_content(self, content):
        """Serialize the content object to a JSON serializable object. """
        StaticContent = get_static_content() # This is done here to avoid circular import
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

    def sync_course_assets(self) -> None:
        """
        Synchronize images according to the course assets.

        This method does the following:
        - Get all course assets id.
        - Remove the images that are not in the course assets.
        """
        course_assets_id = self.get_all_course_assets_id()

        for content in self.contents:
            if content["id"] not in course_assets_id:
                self.contents.remove(content)
                self.content_names.remove(content["display_name"])

    def get_all_course_assets_id(self) -> list[str]:
        """Return all course assets id.

        Returns:
            list[str]: List of all course assets id.
        """
        course_assets, _ = contentstore().get_all_content_for_course(self.course_id)
        return [asset["_id"] for asset in course_assets]

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
            if importlib_files(__package__).joinpath(text_js.format(locale_code=code)).exists():
                return text_js.format(locale_code=code)
        return None

    @staticmethod
    def get_dummy():
        """
        Dummy method to generate initial i18n
        """
        return translation.gettext_noop('Dummy')
