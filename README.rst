ImagesGallery XBlock
###################################

|status-badge| |license-badge| |ci-badge|

Purpose
*******

Images Gallery XBlock allows uploading and displaying a carousel of images
using the `react-image-gallery`_ component.

Once the XBlock is added to a course, the instructor can upload images into a
course unit, and the students can view the images in a carousel. The images are
stored in the course's assets.

This XBlock has been created as an open source contribution to the Open edX
platform and has been funded by Unidigital project from the Spanish Government
- 2023.

.. _`react-image-gallery`: https://github.com/xiaolin/react-image-gallery

Compatibility Notes
===================

+------------------+--------------+
| Open edX Release | Version      |
+==================+==============+
| Palm             | >= 0.5.0     |
+------------------+--------------+
| Quince           | >= 0.5.0 <1.0|
+------------------+--------------+
| Redwood          | >= 0.5.0     |
+------------------+--------------+
| Sumac            | >= 0.6.0     |
+------------------+--------------+

The settings can be changed in ``imagesgallery/settings/common.py`` or, for example, in tutor configurations.

**NOTE**: the current ``common.py`` works with Open edX Palm, Quince, Redwood and Sumac versions.

Enabling the XBlock in a course
*******************************

When the XBlock has been installed, you can enable it in a course from Studio
through the **Advanced Settings**.

1. Go to Studio and open the course you want to add the XBlock to.
2. Go to **Settings** > **Advanced Settings** from the top menu.
3. Search for **Advanced Module List** and add ``"imagesgallery"`` to the list.
4. Click **Save Changes** button.

.. image:: https://github.com/eduNEXT/xblock-imagesgallery/assets/64033729/3427e9f7-4cbe-4267-96a8-7653351957d0
   :alt: Enable XBlock in a course


Adding a Images Gallery Component to a course unit
**************************************************

From Studio, you can add the Images Gallery Component to a course unit.

1. Click on the **Advanced** button in **Add New Component**.
2. Select **imagesgallery** from the list.

.. image:: https://github.com/eduNEXT/xblock-imagesgallery/assets/64033729/23e76373-e55c-4fb2-b596-905164f63d4b
   :alt: Add Images Gallery Component to a course unit

.. image:: https://github.com/eduNEXT/xblock-imagesgallery/assets/64033729/d1e6857d-c597-4af7-ac89-f4b54b5e6bdc
   :alt: Add Images Gallery Component to a course unit

In the **Edit** modal you can upload images, and delete them. The allowed image
formats are: ``.jpg``, ``.jpeg``, ``.png``, ``.gif``, ``.webp``, ``.heic`` and
``.jfif``.

.. image:: https://github.com/eduNEXT/xblock-imagesgallery/assets/64033729/4aab40bf-6a04-4b39-86f6-d3ea0647ce48
   :alt: Add Images Gallery Component to a course unit

The instructors can preview the images before publishing the changes in the
course.

Using the Images Gallery Component
**********************************

Upload images
=============
1. Go to edit section of the component from Studio.
2. Upload files by clicking on the dotted area or by dragging and dropping the
   images and save the changes.

   .. image:: https://github.com/eduNEXT/xblock-imagesgallery/assets/64033729/d336b6cd-0723-4574-860b-f313874c40c4
      :alt: Upload images

   .. image:: https://github.com/eduNEXT/xblock-imagesgallery/assets/64033729/6acf3bd0-4f06-4677-951c-23a2b40cf977
      :alt: Upload images
3. The uploaded files are added to the course assets, and they can be viewed
   from **Content** > **Files** in Studio.

   .. image:: https://github.com/eduNEXT/xblock-imagesgallery/assets/64033729/ebbd5c65-84fa-40d8-9c3e-0a77b81b1ec9
      :alt: Files in Course Assets

Delete images
=============
To delete a image, the following must be taken into account:

1. Delete an image from the Images Gallery component won't delete the image
   from the course assets, only from the component, but, the image won't
   be visible from the student view.

   .. image:: https://github.com/eduNEXT/xblock-imagesgallery/assets/64033729/0e41d49b-b5c4-4f7e-bc94-fe86b1abc005
      :alt: Delete image from the component

2. Delete an image from course assets will delete the image from the Images
   Gallery component, and therefore, the image won't be visible from the
   student view.

   .. image:: https://github.com/eduNEXT/xblock-imagesgallery/assets/64033729/748dd903-0dd6-49fa-9a7d-2fafb909815c
      :alt: Delete image from course assets


View from the Learning Management System (LMS)
**********************************************

The students can view the images in a carousel. The carousel has a navigation
arrow to move between the images, a full-screen and automatic slideshow button.

.. image:: https://github.com/eduNEXT/xblock-imagesgallery/assets/64033729/53557af8-08da-414d-8dc5-249d7b17ac30
   :alt: View from the LMS


Setting up React
****************

Use Node.js v18.x

You can use `nvm use`_ to switch the Node.js version.

.. _nvm use: https://github.com/nvm-sh/nvm#automatically-call-nvm-use

There are three scripts to run our React app:

1. **Running the React App in Isolation**:

   This script runs the React app in isolation, which means you do not need the
   XBlock running. It starts a development server with a hot reload mechanism.

   .. code-block:: shell

      yarn install

2. **Running React with the XBlock**:

   This script runs React with the XBlock running, allowing you to reload the
   page with any changes.

   .. code-block:: shell

      yarn start

3. **Generating Static Files for Production**:

   This script generates all the necessary static files for the production
   environment.

   .. code-block:: shell

      yarn build

We also recommend using `yarn`_. You can install it with the following command:

.. code-block:: shell

   npm install --global yarn

.. _yarn: https://classic.yarnpkg.com/lang/en/docs/install


Experimenting with this Xblock in the Workbench
************************************************

`XBlock`_ is the Open edX component architecture for building custom learning
interactive components.

.. _XBlock: https://openedx.org/r/xblock

You can see the Images Gallery component in action in the XBlock Workbench.
Running the Workbench requires having docker running.

.. code:: bash

    git clone git@github.com:eduNEXT/xblock-imagesgallery
    virtualenv venv/
    source venv/bin/activate
    cd xblock-imagesgallery
    make upgrade
    make install
    make dev.run

Once the process is done, you can interact with the Images Gallery XBlock in
the Workbench by navigating to http://localhost:8000

For details regarding how to deploy this or any other XBlock in the Open edX
platform, see the `installing-the-xblock`_ documentation.

.. _installing-the-xblock: https://edx.readthedocs.io/projects/xblock-tutorial/en/latest/edx_platform/devstack.html#installing-the-xblock


Getting Help
*************

If you're having trouble, the Open edX community has active discussion forums
available at https://discuss.openedx.org where you can connect with others in
the community.

Also, real-time conversations are always happening on the Open edX community
Slack channel. You can request a `Slack invitation`_, then join the
`community Slack workspace`_.

For anything non-trivial, the best path is to open an `issue`_ in this
repository with as many details about the issue you are facing as you can
provide.

For more information about these options, see the `Getting Help`_ page.

.. _Slack invitation: https://openedx.org/slack
.. _community Slack workspace: https://openedx.slack.com/
.. _issue: https://github.com/eduNEXT/xblock-imagesgallery/issues
.. _Getting Help: https://openedx.org/getting-help


License
*******

The code in this repository is licensed under the AGPL-3.0 unless otherwise
noted.

Please see `LICENSE.txt <LICENSE.txt>`_ for details.


Contributing
************

Contributions are very welcome.

This project is currently accepting all types of contributions, bug fixes,
security fixes, maintenance work, or new features.  However, please make sure
to have a discussion about your new feature idea with the maintainers prior to
beginning development to maximize the chances of your change being accepted.
You can start a conversation by creating a new issue on this repo summarizing
your idea.


Translations
============
This Xblock is initially available in English and Spanish. You can help by
translating this component to other languages. Follow the steps below:

1. Create a folder for the translations in ``locale/``, eg:
   ``locale/fr_FR/LC_MESSAGES/``, and create your ``text.po`` file with all the
   translations.
2. Run ``make compile_translations``, this will generate the ``.mo`` file.
3. Create a pull request with your changes!


Reporting Security Issues
*************************

Please do not report a potential security issue in public. Please email
security@edunext.co.


.. |ci-badge| image:: https://github.com/eduNEXT/xblock-imagesgallery/workflows/Python%20CI/badge.svg?branch=main
    :target: https://github.com/eduNEXT/xblock-imagesgallery/actions
    :alt: CI

.. |license-badge| image:: https://img.shields.io/github/license/eduNEXT/xblock-imagesgallery.svg
    :target: https://github.com/eduNEXT/xblock-imagesgallery/blob/main/LICENSE.txt
    :alt: License

.. |status-badge| image:: https://img.shields.io/badge/Status-Maintained-brightgreen
