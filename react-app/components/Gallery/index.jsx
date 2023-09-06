import { useContext, memo } from 'react';
import ImageGallery from 'react-image-gallery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import 'react-image-gallery/styles/css/image-gallery.css';
import { GalleryContext } from '@contexts/galleryContext';

import './styles.css';
// TODO: Remove this images ulr's when files come from backend
const images = [
  {
    original: 'https://fastly.picsum.photos/id/1018/1000/600.jpg?hmac=8y6PgnvgTLEEW-118lVn6V6zPUVSN9JSi27GSpmGpdQ',
    thumbnail: 'https://fastly.picsum.photos/id/1018/250/150.jpg?hmac=a9jeH9XHKHtbPkhvklrYWgcEOX9kfjewcCNGPOrbAs0'
  },
  {
    original: 'https://picsum.photos/id/1015/1000/600/',
    thumbnail: 'https://picsum.photos/id/1015/250/150/'
  },
  {
    original: 'https://picsum.photos/id/1019/1000/600/',
    thumbnail: 'https://picsum.photos/id/1019/250/150/'
  }
];

function Gallery() {
  const { isGalleryOpened, setIsGalleryOpened } = useContext(GalleryContext);
  // TODO: uncomment this when files come from backend
  // const formatListImagesGallery = filesToUploadList.map(({ url}) => ({ original: url, thumbnail: url }));
  const toggleGallery = () => setIsGalleryOpened(!isGalleryOpened);

  return (
    <div className={`gallery-container ${isGalleryOpened ? 'show' : ''}`}>
      <div className="gallery-content">
        <ImageGallery items={images} />
      </div>
      <div className="actions-container">
        <button type="button" className="button-close" onClick={toggleGallery}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
    </div>
  );
}

export default memo(Gallery);
