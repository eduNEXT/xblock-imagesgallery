import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import globalObject from '@constants/globalObject';

import ImageItem from './components/ImageItem';
import './styles.css';

const ListImages =  (props) => {
  const { isEditView } = globalObject;
  const { list } = props;
  const { filesToUpload = [] } = useSelector(state => state.files);
  const listImages = isEditView ? filesToUpload : list;

  return (
    <>
      <div>
        <h3 className="xblock-images-gallery__list-title">{gettext('To upload')}</h3>
      </div>
      <div className="xblock-images-gallery__grid">
        {listImages.map((imageData) => (
          <ImageItem key={imageData.id} {...imageData} />
        ))}
      </div>
    </>
  );
}

ListImages.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      url: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      size: PropTypes.string.isRequired
    })
  ).isRequired
};

export default memo(ListImages);
