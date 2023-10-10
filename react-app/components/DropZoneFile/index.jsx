import React, { useCallback, useContext, useState, memo, useEffect, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { StatusCodes } from 'http-status-codes';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImage } from '@fortawesome/free-regular-svg-icons';
import PropTypes from 'prop-types';
import { GalleryContext } from '@contexts/galleryContext';
import { getItemLocalStorage, setItemLocalStorage } from '@utils/localStorageUtils';
import globalObject from '@constants/globalObject';
import apiConfig from '@config/api';
import ErrorMessage from '@components/ErrorMessage';
import XBlockActionButtons from '@components/XBlockActionButtons';
import { setFiles } from '@redux/actions/file';
import './styles.css';

const fileTypesAllowed = {
  'image/jpeg': [],
  'image/png': [],
  'image/webp': [],
  'image/heic': [],
  'image/jfif': [],
  'image/gif': []
};

const DropZoneFile = ({ onDroppedImages, onSaveImages }) => {
  const { setFilesToUploadList, galleryErrorMessage } = useContext(GalleryContext);
  const [dropZoneErrorMessage, setDropZoneErrorMessage] = useState(null);
  const { filesToUpload } = useSelector((state) => state.files);
  const dispatch = useDispatch();
  const [filesToUploadStoraged, setFilesToUploadStoraged] = useState();
  const [isCallbackExecuted, setIsCallbackExecuted] = useState(false);
  const { xblockId, isEditView } = globalObject;
  /**
   * Uploads files using the provided form data and fetches the uploaded files' information.
   *
   * @async
   * @function
   * @param {FormData} formData - The FormData containing files to be uploaded.
   * @returns {Promise<void>} - A Promise that resolves once the upload is complete.
   */
  async function uploadAndFetchFiles(formData) {
    let filesToUploadFailedMessage = '';
    try {
      const { element: globalElement, xblockId } = globalObject;
      const fileUploadHandler = globalObject.runtime.handlerUrl(globalElement, 'file_upload');

      // Upload the file
      const uploadResponse = await apiConfig.post(fileUploadHandler, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (uploadResponse.status === StatusCodes.OK) {
        const { data: imagesUploaded } = uploadResponse;

        const formatImagesUploaded = imagesUploaded.map(({ id, asset_key, display_name, file_size, external_url }) => ({
          id,
          assetKey: asset_key,
          name: display_name,
          size: file_size,
          url: external_url
        }));

        const filesSaved = getItemLocalStorage(xblockId) || [];

        const filesUnloaded = [...filesSaved, ...formatImagesUploaded];
        setFilesToUploadList(filesUnloaded);
        setItemLocalStorage(xblockId, filesUnloaded);
        setDropZoneErrorMessage(null);
      } else {
        filesToUploadFailedMessage = gettext('File upload failed');
        setDropZoneErrorMessage(filesToUploadFailedMessage);
      }
    } catch (error) {
      console.error('Error:', error);
      filesToUploadFailedMessage = gettext('An unexpected error occurred');
      setDropZoneErrorMessage(filesToUploadFailedMessage);
    }
  }

  // Callback executed when files are dropped to the drop zone
  const onDrop = useCallback(async (allowedFiles) => {
    const filesImagesToSave = [];

    async function readAndProcessFile(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = (event) => {
          const { name, size } = file;
          const id = new Date().getTime();
          const url = event.target.result;
          const image = {
            id: `${id}_${name}`,
            assetKey: `${id}_asset`,
            name,
            size,
            url,
            file
          };

          filesImagesToSave.push(image);
          resolve();
        };

        // Read the file as a data URL (this will trigger the onload callback)
        reader.readAsDataURL(file);
      });
    }

    // Read and process all files asynchronously
    await Promise.all(allowedFiles.map((file) => readAndProcessFile(file)));
    onDroppedImages(filesImagesToSave);
    //const storageKey = `${xblockId}_edit`;
    // const filesSaved = getItemLocalStorage(storageKey) || [];
    //const newData = [...filesSaved, ...filesImagesToSave];
    //setItemLocalStorage(storageKey, newData);
    // dispatch(setFiles(newData));

    const { element: globalElement } = globalObject;
    if (globalElement) {
      // uploadAndFetchFiles(formData);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: fileTypesAllowed });

  // Handler to save images in backend when save button is clicked
  const handleSaveButton = async (data) => {
    try {
      const { element: globalElement } = globalObject;
      // 'change the name of the handler here'
      const fileDeleteHandler = globalObject.runtime.handlerUrl(globalElement, 'handler_name');
      const resultRequest = await apiConfig.post(fileDeleteHandler, data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSaveImages = (data) => {
    const formData = new FormData();
    data.forEach(({ file }) => {
      formData.append('files', file);
    });
    onSaveImages(formData);
    // console.log('data', data);
    //console.log('formData', formData);
    // handleSaveButton(formData);
  };

  const xblockBottomButtons = useMemo(() => {
    return [
      {
        id: '527bd5b5d689e2c32ae974c6229ff785',
        xblockIdItem: xblockId,
        title: 'Save',
        callback: () => {}
      }
    ];
  }, [filesToUpload]);

  return (
    <div className="xblock-images-gallery__file-uploader">
      <div {...getRootProps()} className={`xblock-images-gallery__dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        <p>{gettext('Drag & drop files here, or click to select files')}</p>
        <FontAwesomeIcon icon={faFileImage} style={{ fontSize: '50px', color: '#007bff' }} />
      </div>
      {(dropZoneErrorMessage || galleryErrorMessage) && (
        <ErrorMessage message={dropZoneErrorMessage || galleryErrorMessage} />
      )}
      {/*isEditView && <XBlockActionButtons buttons={xblockBottomButtons} callbackFunction={handleSaveImages} /> */}
    </div>
  );
};

DropZoneFile.propTypes = {
  onDroppedImages: PropTypes.func.isRequired,
  onSaveImages: PropTypes.func.isRequired
};

export default memo(DropZoneFile);
