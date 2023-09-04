import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import './styles.css';

import { MyContext } from '../../../../App';

function ImageItem() {
  const [isHovered, setIsHovered] = useState(false);
  const { setIsGalleryOpened } = useContext(MyContext);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleOpenGallery = () => {
    setIsGalleryOpened(true);
  };

  return (
    <div className="card" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleOpenGallery}>
      <div className={`title-top ${isHovered ? 'visible' : ''}`}>Title 1</div>
      <img
        className={`card-image ${isHovered ? 'faded' : ''}`}
        src="https://picsum.photos/id/1018/1000/600/"
        alt="Image 1"
      />
      <div className={`bottom-content ${isHovered ? 'visible' : ''}`}>
        <div className="title-bottom">Subtitle 2</div>
        <div className="delete-icon">
          <FontAwesomeIcon icon={faTrash} />
        </div>
      </div>
    </div>
  );
}

export default ImageItem;
