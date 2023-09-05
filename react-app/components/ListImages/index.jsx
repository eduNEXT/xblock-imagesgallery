import React, { memo } from 'react';
import PropTypes from 'prop-types';

import ImageItem from './components/ImageItem';
import './styles.css';

function ListImages(props) {
  const { list } = props;

  return (
    <>
      <div>
        <h3 className="list-title">To upload</h3>
      </div>
      <div className="grid">
        {list.map((imageData) => (
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
