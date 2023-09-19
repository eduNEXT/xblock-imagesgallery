import React, { useCallback, useContext, useState, memo } from 'react';
import { useDropzone } from 'react-dropzone';
import { StatusCodes } from 'http-status-codes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImage } from '@fortawesome/free-regular-svg-icons';
import { GalleryContext } from '@contexts/galleryContext';
import { getItemLocalStorage, setItemLocalStorage } from '@utils/localStorageUtils';
import globalObject from '@constants/globalObject';
import apiConfig from '@config/api';
import ErrorMessage from '@components/ErrorMessage';
import './styles.css';

const fileTypesAllowed = {
  'image/jpeg': [],
  'image/png': [],
  'image/webp': [],
  'image/heic': [],
  'image/jfif': [],
  'image/gif': []
};

const DropZoneFile = () => {
  const { setFilesToUploadList, galleryErrorMessage } = useContext(GalleryContext);
  const [dropZoneErrorMessage, setDropZoneErrorMessage] = useState(null);

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
      filesToUploadFailedMessage = gettext('It occurred an unexpected error');
      setDropZoneErrorMessage(filesToUploadFailedMessage);
    }
  }

  // Callback executed when files are dropped to the drop zone
  const onDrop = useCallback((allowedFiles) => {
    // Create a FormData object to send the file to the server
    // const formData = new FormData();
    allowedFiles.forEach((file) => {
      //TODO: remove this code when files come from backend
      const reader = new FileReader();

      // Define the callback function to run when the file is loaded
      reader.onload = (event) => {
        const { name, size } = file;
        const id = new Date().getTime();
        const url = event.target.result;
        const sizeFormatted = sizeFileFormat(size);
        const image = {
          id,
          name,
          url,
          size: sizeFormatted
        };

        const filesToUploadListStorage = getItemLocalStorage('filesToUploadList') || [];
        const filesToUploadListUpdated = [...filesToUploadListStorage, image];
        setItemLocalStorage('filesToUploadList', filesToUploadListUpdated);
        setFilesToUploadList(filesToUploadListUpdated);
      };

      // Read the file as a data URL (this will trigger the onload callback)
      reader.readAsDataURL(file);
    });

    const { element: globalElement } = globalObject;
    if (globalElement) {
      uploadAndFetchFiles(formData);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: fileTypesAllowed });

  return (
    <div className="xblock-images-gallery__file-uploader">
      <div {...getRootProps()} className={`xblock-images-gallery__dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        <p>{gettext('Drag & drop files here, or click to select files')}</p>
        <FontAwesomeIcon icon={faFileImage} style={{ fontSize: '50px', color: '#007bff' }} />
      </div>
      {(dropZoneErrorMessage || galleryErrorMessage) && (<ErrorMessage message={dropZoneErrorMessage || galleryErrorMessage } />)}
    </div>
  );
};

export default memo(DropZoneFile);
