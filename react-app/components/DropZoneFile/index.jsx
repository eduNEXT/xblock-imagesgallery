import React, { useCallback, useContext, memo } from 'react';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImage } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';
import Cookies from 'js-cookie';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { GalleryContext } from '@contexts/galleryContext';
import { getItemLocalStorage, setItemLocalStorage } from '@utils/localStorageUtils';
import { sizeFileFormat } from '@utils/fileUtils';
import globalObject from '@constants/globalObject';
import apiConfig from '@config/api';
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
  const { setFilesToUploadList } = useContext(GalleryContext);

  async function uploadAndFetchFiles(formData) {
    try {
      const { element: globalElement } = globalObject;
      const fileUploadHandler = globalObject.runtime.handlerUrl(globalElement, 'file_upload');
      const fileGetterHandler = globalObject.runtime.handlerUrl(globalElement, 'get_files');

      // Upload the file
      const uploadResponse = await apiConfig.post(fileUploadHandler, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (uploadResponse.status === 200) {
        console.log('File uploaded successfully');

        // Fetch files
        const data = {
          current_page: 0,
          page_size: 10
        };

        const filesResponse = await apiConfig.post(fileGetterHandler, data);

        // Handle the response here
        console.log(filesResponse.data);
      } else {
        console.error('File upload failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // Callback executed when files are dropped to the drop zone
  const onDrop = useCallback((allowedFiles) => {
    // Create a FormData object to send the file to the server
    const formData = new FormData();
    allowedFiles.forEach((file) => {
      formData.append('files', file);
    });

    const { element: globalElement } = globalObject;
    if (globalElement) {
      uploadAndFetchFiles(formData);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: fileTypesAllowed });

  return (
    <div className="xblock-images-gallery__file-uploader">
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        <p>{gettext('Drag & drop files here, or click to select files')}</p>
        <FontAwesomeIcon icon={faFileImage} style={{ fontSize: '50px', color: '#007bff' }} />
      </div>
    </div>
  );
};

export default memo(DropZoneFile);
