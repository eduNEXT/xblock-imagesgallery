Change Log
##########

..
   All enhancements and patches to imagesgallery will be documented
   in this file.  It adheres to the structure of https://keepachangelog.com/ ,
   but in reStructuredText instead of Markdown (for ease of incorporation into
   Sphinx documentation and the PyPI description).

   This project adheres to Semantic Versioning (https://semver.org/).

.. There should always be an "Unreleased" section for changes pending release.

Unreleased
**********

*

1.2.0 - 2025-10-14
**********************************************

Changed
=======

* **Ulmo Support**: Upgrade requirements base on edx-platform Ulmo release, update GitHub Workflows with new actions version.

1.1.0 - 2025-06-22
**********************************************

Changed
=======

* **Teak Support**: Upgrade requirements based on edx-platform Teak release, update GitHub Actions workflows to use the `ubuntu-22.04` runner image.


1.0.0 - 2025-02-05
**********************************************

Changed
=======

* Removed support for Python 3.8 and Django 3.2
* Replaced deprecated `pkg_resources` with `importlib.resources` for better compatibility with newer Django and Python versions.
* Starting with this version, this package is no longer compatible with releases older than Redwood.

0.6.0 - 2025-01-17
**********************************************

Added
=====

* Support for Python 3.11

0.5.2 - 2024-09-02
**********************************************

Fixed
=====

* Move ``StaticContent`` import into the specific method
  to avoid runtime errors due to circular imports.

0.5.1 - 2024-05-27
**********************************************

Changed
=======

* Add backends for edx-platform imports
* Add compatibility notes

0.5.0 - 2024-01-29
**********************************************

Changed
=======

* Use urllib constraint as in edx-platform

0.4.3 - 2023-11-27
**********************************************

Changed
=======

* Add using images gallery component section to the documentation

0.4.2 - 2023-11-16
**********************************************

Changed
=======

* Update documentation
* Correct image deletion functionality

0.4.1 - 2023-10-24
**********************************************

Changed
=======

* Remove header name from xblock display.

0.4.0 - 2023-10-18
**********************************************

Changed
=======

* Add support for images with same name.
* Make backend calls synchronous from the UI.

0.3.0 - 2023-09-26
**********************************************

Changed
=======

* Link assets to course for easy access.

0.2.0 - 2023-09-06
**********************************************

Added
=====

* Introduced the `react-dropzone` library for drag-and-drop image file uploads.
* Added the `react-images-gallery` library for image carousel functionality.
* Course assets management Xblock handlers for images.

Changed
=======

* Modified the XBlock to allow users to select and preview images in the dropzone.
* Enhanced the XBlock to enable users to view the images gallery.

0.1.0 – 2023-08-31
**********************************************

Added
=====

* First release on PyPI.

