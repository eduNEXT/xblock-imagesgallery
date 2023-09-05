import React, { useCallback, useContext, memo } from 'react';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImage } from '@fortawesome/free-regular-svg-icons';
import { GalleryContext } from '@contexts/galleryContext';
import { getItemLocalStorage, setItemLocalStorage } from '@utils/localStorage';
import { sizeFileFormat } from '@utils/fileUtils';
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

  const onDrop = useCallback((acceptedFiles) => {
    // Create a FormData object to send the file to the server
    // const formData = new FormData();
    acceptedFiles.forEach((file) => {
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

    // TODO: Uncomment this when files come from backend
    /*axios.post('/upload', formData).then((response) => {
      // Handle the response from the server
      console.log('File uploaded successfully!', response.data);
      setUploadedFiles(response.data); // You can store uploaded files in state
    }); */
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: fileTypesAllowed });

  return (
    <div className="file-uploader">
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        <p>Drag & drop files here, or click to select files</p>
        <FontAwesomeIcon icon={faFileImage} style={{ fontSize: '50px', color: '#007bff' }} />
      </div>
    </div>
  );
};

export default memo(DropZoneFile);
