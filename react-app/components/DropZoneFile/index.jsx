import React, { useCallback, useContext, useState, memo } from 'react';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImage } from '@fortawesome/free-regular-svg-icons';
import PropTypes from 'prop-types';
import { v4 as uuid4 } from 'uuid';
import { GalleryContext } from '@contexts/galleryContext';
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

const DropZoneFile = ({ onDroppedImages }) => {
  const { galleryErrorMessage } = useContext(GalleryContext);
  const [dropZoneErrorMessage] = useState(null);
  // Callback executed when files are dropped to the drop zone
  const onDrop = useCallback(async (allowedFiles) => {
    const filesImagesToSave = [];

    async function readAndProcessFile(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = (event) => {
          const { name, size } = file;
          const id = uuid4();
          const url = event.target.result;
          const image = {
            id: `${id}_${name}`,
            assetKey: `${id}_asset`,
            name,
            size,
            url,
            uniqueId: uuid4(),
            isSaved: false,
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
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: fileTypesAllowed });

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
    </div>
  );
};

DropZoneFile.propTypes = {
  onDroppedImages: PropTypes.func.isRequired
};

export default memo(DropZoneFile);
