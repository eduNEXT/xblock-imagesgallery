import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DropZoneFile from '@components/DropZoneFile';
import ListImages from '@components/ListImages';
import XBlockActionButtons from '@components/XBlockActionButtons';
import ErrorMessage from '@components/ErrorMessage';
import globalObject from '@constants/globalObject';
import apiConfig from '@config/api';
import { setFiles } from '@redux/actions/file';

const itemsPerPage = 10;

const EditVIew = () => {
  const dispatch = useDispatch();
  const { filesToUpload } = useSelector((state) => state.files);
  const [imagesToSave, setImagesToSave] = useState([]);
  const [currentImagesList, setCurrentImagesList] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const buttonCancelRef = useRef(null);
  const { xblockId, isEditView } = globalObject;

  const xblockBottomButtons = useMemo(() => {
    return [
      {
        id: '527bd5b5d689e2c32ae974c6229ff785',
        xblockIdItem: xblockId,
        title: 'Save',
        callback: () => {}
      }
    ];
  }, [xblockId]);

  const handleOnDroppedImages = (images) => {
    console.log('images', images);
    setImagesToSave((prevImagesToSave) => [...prevImagesToSave, ...images]);
    setCurrentImagesList((prevImages) => [...prevImages, ...images]);
    dispatch(setFiles([...imagesToSave, ...images]));
  };

  const handleOnSaveImages = (images) => {
    //console.log('onSave', images);
    //const formData = new FormData();
    //console.log('imagesToSave', imagesToSave);
    //console.log('form data', formData);
    console.log_(filesToUpload);
  };

  const fetchUploadedFiles = async (page = 0) => {
    //setIsLoading(true);
    try {
      const { element: globalElement } = globalObject;
      const fileGetterHandler = globalObject.runtime.handlerUrl(globalElement, 'get_files');
      const data = {
        current_page: page,
        page_size: itemsPerPage
      };

      const filesResponse = await apiConfig.post(fileGetterHandler, data);
      const { total_count: sizeItems, files } = filesResponse.data;
      const formatImagesUploaded = files.map(({ id, asset_key, display_name, file_size, external_url }) => ({
        id,
        assetKey: asset_key,
        name: display_name,
        size: file_size,
        url: external_url,
        isSaved: true
      }));

      //setSizeItems(sizeItems);
      setCurrentImagesList((prevImages) => [...prevImages, ...formatImagesUploaded]);
      // console.log('currentImagesList', currentImagesList);
      //setFetchedPages({ ...fetchedPages, [page]: true });
    } catch (error) {
      console.log('error :/', error.message);
      //const errorMessage = gettext('An unexpected error has occured');
      // setGalleryErrorMessage(errorMessage);
    } finally {
      //setIsLoading(false);
    }
  };

  async function deleteFiles(filesToDeleteKeys) {
    try {
      const { element: globalElement } = globalObject;
      const filesDeleteHandler = globalObject.runtime.handlerUrl(globalElement, 'remove_files');

      const deleteFilesResponse = await apiConfig.post(filesDeleteHandler, { assets: filesToDeleteKeys });

      if (deleteFilesResponse.status !== StatusCodes.OK) {
        throw new Error('Upload files has failed');
      }
    } catch (error) {
      throw new Error('Upload files has failed');
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
      const { element: globalElement, xblockId } = globalObject;
      const fileUploadHandler = globalObject.runtime.handlerUrl(globalElement, 'file_upload');

      // Upload the file
      const uploadResponse = await apiConfig.post(fileUploadHandler, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (uploadResponse.status !== StatusCodes.OK) {
        throw new Error('Upload files has failed');
      }
    } catch (error) {
      throw new Error('Upload files has failed');
    }
  }

  const handleDeleteImage = (assetKeyToDelete, isImageSaved) => {
    const newImages = [...currentImagesList].filter(({ assetKey }) => assetKey !== assetKeyToDelete);
    if (isImageSaved) {
      setImagesToDelete((prevKeys) => [...prevKeys, assetKeyToDelete]);
    }
    setCurrentImagesList(newImages);
  };

  useEffect(() => {
    fetchUploadedFiles();
    console.log('Hello friend :D');
  }, []);

  useEffect(() => {
    const actionButtonCancel = document.querySelector('.modal-actions ul .action-cancel');
    buttonCancelRef.current = actionButtonCancel;
  }, []);

  const handleSaveImages = (data, imagesKeysToDelete) => {
    const formData = new FormData();
    data.forEach(({ file }) => {
      formData.append('files', file);
    });

    try {
      if (data.length) {
        uploadFiles(formData);
      }
      if (imagesKeysToDelete.length) {
        deleteFiles(imagesKeysToDelete);
      }
      console.log('All good :D');
    } catch (error) {
      console.log('errr', error.message);
    }
    //console.log('formData', formData);
    // console.log('imagesKeysToDelete', imagesKeysToDelete);
    // console.log('data', data);
    //console.log('formData', formData);
    // handleSaveButton(formData);
  };

  return (
    <>
      <DropZoneFile onDroppedImages={handleOnDroppedImages} onSaveImages={handleOnSaveImages} />
      <ListImages list={currentImagesList} onDeleteImageList={handleDeleteImage} />
      <ErrorMessage message="It has ocurred an error" />
      {isEditView && (
        <XBlockActionButtons
          imagesToDelete={imagesToDelete}
          buttons={xblockBottomButtons}
          imagesList={imagesToSave}
          callbackFunction={handleSaveImages}
        />
      )}
    </>
  );
};

export default EditVIew;
