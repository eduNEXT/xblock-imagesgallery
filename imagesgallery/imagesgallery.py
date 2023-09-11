"""TO-DO: Write a description of what this XBlock is."""

import re
import logging
import pkg_resources
from django.utils import translation
from xblock.core import XBlock
from xblock.fields import List, Integer, Scope
from xblock.fragment import Fragment
from xblockutils.resources import ResourceLoader

from django.conf import settings

from urllib.parse import urljoin
from http import HTTPStatus

from webob.response import Response

from openedx.core.djangoapps.site_configuration import helpers as configuration_helpers

log = logging.getLogger(__name__)

class ImagesGalleryXBlock(XBlock):
    """
    TO-DO: document what your XBlock does.
    """

    # Fields are defined on the class.  You can access them in your code as
    # self.<fieldname>.

    # TO-DO: delete count, and define your own fields.
    contents = List(
        display_name="Static contents uploaded by the instructor.",
        default=[],
        scope=Scope.user_state,
    )

    current_page = Integer(
        display_name="Current page",
        default=0,
        scope=Scope.user_state,
    )

    page_size = Integer(
        display_name="Page size",
        default=10,
        scope=Scope.settings,
    )

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
        # Importing here to avoid circular imports
        from cms.djangoapps.contentstore.views.assets import update_course_run_asset

        for _, file in request.params.items():
            try:
                content = update_course_run_asset(self.course_id, file.file)
                self.serialize_contents(content)
            except Exception as e:
                log.exception(e)
                return Response(status=HTTPStatus.INTERNAL_SERVER_ERROR)
        return Response(status=HTTPStatus.OK, json_body=self.get_paginated_contents())

    def serialize_contents(self, content):
        """
        Serializes the content object to a dictionary and appends it to the
        contents list.
        """
        from xmodule.contentstore.content import StaticContent

        asset_url = StaticContent.serialize_asset_key_with_slash(content.location)
        thumbnail_url = StaticContent.serialize_asset_key_with_slash(content.thumbnail_location)
        self.contents.append({
            "id": str(content.get_id()),
            "display_name": content.name,
            "url": str(asset_url),
            "content_type": content.content_type,
            "file_size": content.length,
            "external_url": urljoin(configuration_helpers.get_value('LMS_ROOT_URL', settings.LMS_ROOT_URL), asset_url),
            "thumbnail": urljoin(configuration_helpers.get_value('LMS_ROOT_URL', settings.LMS_ROOT_URL), thumbnail_url),
        })

    def get_paginated_contents(self):
        """
        Returns the contents list.
        """
        return self.contents[self.current_page * self.page_size: (self.current_page + 1) * self.page_size]

    @XBlock.json_handler
    def get_files(self, data, suffix=''):
        """Handler for getting images from the course assets."""
        self.current_page = int(data.get("current_page", self.current_page))
        return {
            "files": self.get_paginated_contents(),
            "total_count": len(self.contents),
        }

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
