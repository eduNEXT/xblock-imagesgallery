import React, { useState, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

import './styles.css';

const ImageItem = (props) => {
  const { url, name, size, assetKey, isSaved, onDeleteImage, internalId } = props;
  const [isHovered, setIsHovered] = useState(false);

  // Event triggered when the mouse is over current the image.
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Event triggered when the mouse is out of the current image.
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Callback triggered to delete the current image.
  const handleDeleteFileEditView = () => {
    if (onDeleteImage) {
      onDeleteImage(internalId, assetKey, isSaved);
    }
  };

  return (
    <div className="card" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className={`title-top ${isHovered ? 'visible' : ''}`}>{name}</div>
      <img className={`card-image ${isHovered ? 'faded' : ''}`} src={url} alt={`${name}`} />
      <div className={`bottom-content ${isHovered ? 'visible' : ''}`}>
        <div className="title-bottom">{size}</div>
        <div className="delete-icon" onClick={handleDeleteFileEditView}>
          <FontAwesomeIcon icon={faTrash} />
        </div>
      </div>
    </div>
  );
};

ImageItem.defaultProps = {
  isSaved: false,
  onDeleteImage: undefined
};

ImageItem.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  assetKey: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired,
  isSaved: PropTypes.bool,
  onDeleteImage: PropTypes.func,
  internalId: PropTypes.string.isRequired
};

export default memo(ImageItem);
