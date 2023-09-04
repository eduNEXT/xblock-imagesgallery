import ImageGallery from 'react-image-gallery';
// import stylesheet if you're not already using CSS @import
import 'react-image-gallery/styles/css/image-gallery.css';

const images = [
  {
    original: 'https://picsum.photos/id/1018/1000/600/',
    thumbnail: 'https://picsum.photos/id/1018/250/150/'
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
  return (
    <>
      <button type="button"><FontAwesomeIcon icon={faXmark} /></button>
      <ImageGallery items={images} />
    </>
  );
}

export default Gallery;
