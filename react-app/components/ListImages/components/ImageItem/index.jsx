import React, { useContext, useState, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import { getItemLocalStorage, setItemLocalStorage } from '@utils/localStorageUtils';
import { GalleryContext } from '@contexts/galleryContext';

import './styles.css';

function ImageItem(props) {
  const { id: idImageItem, url, name, size } = props;
  const [isHovered, setIsHovered] = useState(false);
  const { setIsGalleryOpened, setFilesToUploadList } = useContext(GalleryContext);

  // Event triggered when the mouse is over current the image.
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Event triggered when the mouse is out of the current image.
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Callback triggered to open the gallery.
  const handleOpenGallery = () => {
    setIsGalleryOpened(true);
  };

  // Callback triggered to delete the current image.
  const handleDeleteFile = () => {
    const filesToUploadListStorage = getItemLocalStorage('filesToUploadList') || [];
    const filesToUploadListUpdated = filesToUploadListStorage.filter(({ id }) => id !== idImageItem);
    setItemLocalStorage('filesToUploadList', filesToUploadListUpdated);
    setFilesToUploadList(filesToUploadListUpdated);
  };

  return (
    <div className="card" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className={`title-top ${isHovered ? 'visible' : ''}`} onClick={handleOpenGallery}>
        {name}
      </div>
      <img className={`card-image ${isHovered ? 'faded' : ''}`} src={url} alt={`${name}`} />
      <div className={`bottom-content ${isHovered ? 'visible' : ''}`}>
        <div className="title-bottom">{size}</div>
        <div className="delete-icon" onClick={handleDeleteFile}>
          <FontAwesomeIcon icon={faTrash} />
        </div>
      </div>
    </div>
  );
}

ImageItem.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired
};

export default memo(ImageItem);
