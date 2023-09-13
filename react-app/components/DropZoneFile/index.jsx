import React, { useCallback, useContext, memo } from 'react';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImage } from '@fortawesome/free-regular-svg-icons';
import { GalleryContext } from '@contexts/galleryContext';
import { getItemLocalStorage, setItemLocalStorage } from '@utils/localStorageUtils';
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

  async function uploadAndFetchFiles(formData, _ = 10) {
    try {
      const { element: globalElement, xblockId } = globalObject;
      const fileUploadHandler = globalObject.runtime.handlerUrl(globalElement, 'file_upload');

      // Upload the file
      const uploadResponse = await apiConfig.post(fileUploadHandler, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (uploadResponse.status === 200) {

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
        // TODO: get data from backend when we have fixed the gallery data
        /* // Fetch files
         const data = {
            current_page: 0,
            page_size: pageSize
          };

        //const filesResponse = await apiConfig.post(fileGetterHandler, data);
        // const {data: uploadedFiles } = filesResponse.files; */

        // Handle the response here
        // console.log(filesResponse.data);
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
    const filesLength = allowedFiles.length;
    if (globalElement) {
      uploadAndFetchFiles(formData, filesLength);
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
