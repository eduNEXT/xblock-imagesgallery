import React, { useState, useEffect, useMemo } from 'react';
import { StatusCodes } from 'http-status-codes';
import { v4 as uuid4 } from 'uuid';
import DropZoneFile from '@components/DropZoneFile';
import ListImages from '@components/ListImages';
import ErrorMessage from '@components/ErrorMessage';
import xBlockContext from '@constants/xBlockContext';
import apiConfig from '@config/api';
import useXBlockActionButtons from '@hooks/useXBlockActionButtons';
import useAddErrorMessageToModal from '@hooks/useAddErrorMessageToModal';

import './styles.css';

const itemsPerPage = 100;

const XBlockEditView = () => {
  const [imagesToSave, setImagesToSave] = useState([]);
  const [currentImagesList, setCurrentImagesList] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [isFetchLoading, setIsFetchLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [reloadPage, setReloadPage] = useState(false);
  const { xblockId, isEditView } = xBlockContext;
  const xblockBottomButtons = useMemo(() => {
    return [
      {
        id: new Date().getTime(),
        xblockIdItem: xblockId,
        title: gettext('Save'),
        callback: () => {}
      }
    ];
  }, [xblockId]);
  /**
   * Handles the saving of images and files, including uploading new files and deleting specified images.
   *
   * @async
   * @param {Array} data - An array of data objects, each containing a file to upload.
   * @param {Array<string>} imagesKeysToDelete - An array of keys identifying images to be deleted.
   * @param {HTMLElement} buttonSaveRef - The reference to the button triggering the save operation.
   * @returns {Promise<void>} A promise that resolves after the saving process is completed.
   *
   * @throws {Error} If any part of the saving process encounters an error.
   *
   * This function handles the process of saving images and files. It uploads new files, deletes specified images,
   * and updates the UI accordingly. It is typically used when a user saves changes to images.
   */
  const handleSaveImages = async (data, imagesKeysToDelete, buttonSaveRef) => {
    const formData = new FormData();
    data.forEach(({ file }) => {
      formData.append('files', file);
    });

    setIsFetchLoading(true);

    buttonSaveRef.disabled = 'disabled';
    buttonSaveRef.classList.add('disabled-button');

    try {
      if (data.length > 0) {
        await uploadFiles(formData);
      }

      if (imagesKeysToDelete.length > 0) {
        const imagesKeysToDeleteRemoveDuplicates = [...new Set(imagesKeysToDelete)];
        await deleteFiles(imagesKeysToDeleteRemoveDuplicates);
      }

      setImagesToSave([]);
      setImagesToDelete([]);
      setReloadPage(true);
    } catch (error) {
      const errorMessage = gettext('An unexpected error has occurred');
      setErrorMessage(errorMessage);
      buttonSaveRef.classList.remove('disabled-button');
      buttonSaveRef.removeAttribute('disabled');
    } finally {
      setIsFetchLoading(false);
    }
  };

  /**
   * Callback function for handling button clicks.
   *
   * @param {string} id - The unique identifier of the clicked button(Xblockid).
   * @param {Array} imagesList - An array of images to be passed as a parameter.
   * @param {Array} imagesToDelete - An array of image keys to be passed as a parameter.
   * @param {Object} buttonRef - The reference to the button element that was clicked.
   */
  const handleButtonClick = (_, imagesList, imagesToDelete, buttonRef) => {
    handleSaveImages(imagesList, imagesToDelete, buttonRef);
  };

  useXBlockActionButtons(
    xblockBottomButtons,
    isFetchLoading,
    handleButtonClick,
    imagesToSave,
    imagesToDelete,
    isEditView
  );

  /**
   * Handles dropped images by adding them to the list of images to save and updating the currentImagesList.
   *
   * @param {Array} images - An array of dropped image objects to handle.
   *
   * This function is used to handle images that are dropped or selected for upload.
   * It adds the dropped images to the list of images to save and updates the currentImagesList
   * to include the newly added images.
   */
  const handleOnDroppedImages = (images) => {
    setImagesToSave((prevImagesToSave) => [...prevImagesToSave, ...images]);
    setCurrentImagesList((prevImages) => [...prevImages, ...images]);
  };

  /**
   * Fetches a page of uploaded files and updates the currentImagesList.
   *
   * @async
   * @param {number} page - The page number to fetch (default is 0).
   * @returns {Promise<void>} A promise that resolves after fetching and updating the list.
   *
   * @throws {Error} If the file fetching request fails with a non-OK status code.
   *
   * This function fetches a page of uploaded files, processes the response, and updates the currentImagesList.
   */
  const fetchUploadedFiles = async (page = 0) => {
    setIsFetchLoading(true);
    try {
      const { element: globalElement } = xBlockContext;
      const fileGetterHandler = xBlockContext.runtime.handlerUrl(globalElement, 'get_files');
      const data = {
        current_page: page,
        page_size: itemsPerPage
      };

      const filesResponse = await apiConfig.post(fileGetterHandler, data);

      if (filesResponse.status !== StatusCodes.OK) {
        throw new Error('Fetch uploaded files has failed');
      }

      const { files } = filesResponse.data;
      const formatImagesUploaded = files.map(({ id, asset_key, display_name, file_size, external_url }) => ({
        id,
        assetKey: asset_key,
        name: display_name,
        size: file_size,
        url: external_url,
        isSaved: true,
        internalId: uuid4()
      }));

      setCurrentImagesList((prevImages) => [...prevImages, ...formatImagesUploaded]);
    } catch (error) {
      const errorMessage = gettext('An unexpected error has occurred');
      setErrorMessage(errorMessage);
    } finally {
      setIsFetchLoading(false);
    }
  };

  /**
   * Deletes files identified by their keys.
   *
   * @async
   * @param {Array<string>} filesToDeleteKeys - An array of keys that identify the files to be deleted.
   * @returns {Promise<string>} A promise that resolves with a success message or rejects with an error message.
   *
   * @throws {Error} If the file deletion request fails with a non-OK status code.
   *
   * This function sends a request to delete files specified by their keys and handles the response.
   */
  async function deleteFiles(filesToDeleteKeys) {
    try {
      const { element: globalElement } = xBlockContext;
      const filesDeleteHandler = xBlockContext.runtime.handlerUrl(globalElement, 'remove_files');

      const deleteFilesResponse = await apiConfig.post(filesDeleteHandler, { assets: filesToDeleteKeys });

      if (deleteFilesResponse.status !== StatusCodes.OK) {
        throw new Error('Delete files has failed');
      }
      return Promise.resolve('Remove files successfully');
    } catch (error) {
      return Promise.reject('Error deleting');
    }
  }

  /**
   * Uploads files using the provided form data.
   *
   * @async
   * @function
   * @param {FormData} formData - The FormData containing files to be uploaded.
   * @returns {Promise<void>} - A Promise that resolves once the upload is complete.
   */
  async function uploadFiles(formData) {
    try {
      const { element: globalElement } = xBlockContext;
      const fileUploadHandler = xBlockContext.runtime.handlerUrl(globalElement, 'file_upload');

      // Upload the file
      const uploadResponse = await apiConfig.post(fileUploadHandler, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (uploadResponse.status !== StatusCodes.OK) {
        throw new Error('Upload files has failed');
      }

      return Promise.resolve('uploadFiles files successfully');
    } catch (error) {
      return Promise.reject('Error uploading files');
    }
  }

  /**
   * Handles the deletion of an image from the currentImagesList.
   *
   * @param {string} internalIdToDelete - The unique identifier of the image to delete.
   * @param {string} assetKey - The key associated with the image.
   * @param {boolean} isImageSaved - Indicates whether the image is saved (to be deleted later).
   *
   * This function removes an image from the currentImagesList based on its internalId.
   * If isImageSaved is true, the assetKey is added to the list of images to be deleted.
   */
  const handleDeleteImage = (internalIdToDelete, assetKey, isImageSaved) => {
    const newImages = [...currentImagesList].filter(({ internalId }) => internalId !== internalIdToDelete);
    const newImagesToSave = [...imagesToSave].filter(({ internalId }) => internalId !== internalIdToDelete);
    if (isImageSaved) {
      setImagesToDelete((prevKeys) => [...prevKeys, assetKey]);
    }

    setCurrentImagesList(newImages);
    setImagesToSave(newImagesToSave);
  };

  useAddErrorMessageToModal(
    errorMessage ? <ErrorMessage message={errorMessage} className="error-message-edit" /> : null
  );

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  useEffect(() => {
    if (reloadPage) {
      window.location.reload();
    }
  }, [reloadPage]);

  return (
    <>
      <DropZoneFile onDroppedImages={handleOnDroppedImages} />
      <ListImages list={currentImagesList} onDeleteImageList={handleDeleteImage} />
    </>
  );
};

export default XBlockEditView;
