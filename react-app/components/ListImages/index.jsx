import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import globalObject from '@constants/globalObject';

import ImageItem from './components/ImageItem';
import './styles.css';

const ListImages = ({ list, onDeleteImageList }) => {
  return (
    <>
      <div>
        <h3 className="xblock-images-gallery__list-title">{gettext('To upload')}</h3>
      </div>
      <div className="xblock-images-gallery__grid">
        {list.map((imageData) => (
          <ImageItem key={imageData.uniqueId} {...imageData} onDeleteImage={onDeleteImageList} />
        ))}
      </div>
    </>
  );
};

ListImages.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      url: PropTypes.string.isRequired,
      assetKey: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      size: PropTypes.string.isRequired,
      isSaved: PropTypes.bool,
      onDeleteImage: PropTypes.func,
      uniqueId: PropTypes.string
    })
  ).isRequired,
  onDeleteImageList: PropTypes.func
};

export default memo(ListImages);
