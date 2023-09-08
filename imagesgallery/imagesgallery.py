"""TO-DO: Write a description of what this XBlock is."""
import logging
import pkg_resources
from django.utils import translation
from xblock.core import XBlock
from xblock.fields import Integer, Scope
from xblock.fragment import Fragment
from xblockutils.resources import ResourceLoader

from http import HTTPStatus

from webob.response import Response

log = logging.getLogger(__name__)

class ImagesGalleryXBlock(XBlock):
    """
    TO-DO: document what your XBlock does.
    """

    # Fields are defined on the class.  You can access them in your code as
    # self.<fieldname>.

    # TO-DO: delete count, and define your own fields.
    count = Integer(
        default=0, scope=Scope.user_state,
        help="A simple counter, to show something happening",
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
        html = self.resource_string("static/html/imagesgallery.html")
        frag = Fragment(html.format(self=self))
        frag.add_css(self.resource_string("static/css/imagesgallery.css"))

        # Add i18n js
        statici18n_js_url = self._get_statici18n_js_url()
        if statici18n_js_url:
            frag.add_javascript_url(self.runtime.local_resource_url(self, statici18n_js_url))

        frag.add_javascript(self.resource_string("static/js/src/imagesgallery.js"))
        frag.initialize_js('ImagesGalleryXBlock')
        return frag

    @XBlock.handler
    def file_upload(self, request, suffix=''):
        """Handler for file upload to the course assets."""
        # Importing here to avoid circular imports
        from cms.djangoapps.contentstore.views.assets import update_course_run_asset

        for _, file in request.params.items():
            try:
                update_course_run_asset(self.course_id, file.file)
            except Exception as e:
                log.exception(e)
                return Response(status=HTTPStatus.INTERNAL_SERVER_ERROR)

        return Response(status=HTTPStatus.OK)

    @XBlock.json_handler
    def get_files(self, data, suffix=''):
        """Handler for getting images from the course assets."""
        from cms.djangoapps.contentstore.asset_storage_handlers import _get_assets_for_page, _get_content_type_filter_for_mongo, _get_assets_in_json_format
        query_options = {
            "current_page": int(data.get("current_page")),
            "page_size": int(data.get("page_size")),
            "sort": {},
            "filter_params": _get_content_type_filter_for_mongo("Images"),
        }
        assets, total_count = _get_assets_for_page(self.course_id, query_options)
        return {
            "files": _get_assets_in_json_format(assets, self.course_id),
            "total_count": total_count,
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
