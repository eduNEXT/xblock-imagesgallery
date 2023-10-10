import React, { useContext, useState, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { getItemLocalStorage, setItemLocalStorage } from '@utils/localStorageUtils';
import { GalleryContext } from '@contexts/galleryContext';
import globalObject from '@constants/globalObject';
import apiConfig from '@config/api';
import { setFiles } from '@redux/actions/file';

import './styles.css';

const ImageItem = (props) => {
  const dispatch = useDispatch();
  const { id: idImageItem, url, name, size, assetKey, isSaved, onDeleteImage } = props;
  const [isHovered, setIsHovered] = useState(false);
  const { setFilesToUploadList, setGalleryErrorMessage } = useContext(GalleryContext);
  const { isEditView } = globalObject;

  // Event triggered when the mouse is over current the image.
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Event triggered when the mouse is out of the current image.
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Callback triggered to delete the current image.
  const handleDeleteFile = async () => {
    try {
      const { element: globalElement, xblockId } = globalObject;
      const fileDeleteHandler = globalObject.runtime.handlerUrl(globalElement, 'remove_files');
      const data = { asset_key: assetKey };
      await apiConfig.post(fileDeleteHandler, data);
      const filesToUploadListStorage = getItemLocalStorage(xblockId) || [];
      const filesToUploadListUpdated = filesToUploadListStorage.filter(({ id }) => id !== idImageItem);
      setItemLocalStorage(xblockId, filesToUploadListUpdated);
      setFilesToUploadList(filesToUploadListUpdated);
      setGalleryErrorMessage(null);
    } catch (error) {
      const deleteImageErrorMessage = gettext('it failed to delete file');
      setGalleryErrorMessage(deleteImageErrorMessage);
    }
  };

  const handleDeleteFileEditView = () => {
    if(onDeleteImage){
       onDeleteImage(assetKey, isSaved);
    }
    /*const { xblockId } = globalObject;
    const filesToUploadListStorage = getItemLocalStorage(`${xblockId}_edit`) || [];
    const filesToUploadListUpdated = filesToUploadListStorage.filter(({ id }) => id !== idImageItem);
    setItemLocalStorage(`${xblockId}_edit`, filesToUploadListUpdated); */
    // dispatch(setFiles(filesToUploadListUpdated));
    //setFilesToUploadList(filesToUploadListUpdated);
  }

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
}

ImageItem.defaultProps = {
  isSaved: false,
  onDeleteImage: undefined
}

ImageItem.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  assetKey: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired,
  isSaved: PropTypes.bool,
  onDeleteImage: PropTypes.func,
};

export default memo(ImageItem);
