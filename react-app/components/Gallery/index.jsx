import { useContext, memo, useEffect, useState } from 'react';
import ImageGallery from 'react-image-gallery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import 'react-image-gallery/styles/css/image-gallery.css';
import { GalleryContext } from '@contexts/galleryContext';
import globalObject from '@constants/globalObject';
import apiConfig from '@config/api';

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
  const [imagesList, setImagesList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sizeItems, setSizeItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [request, setRequest] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const currentPageLastItem = currentPage * 10 - 1;
  const handleOnThumbnailClick = (_, index) => {
    setCurrentIndex(index);
  };

  const handleOnSlide = (currentIndex) => {
    setCurrentIndex(currentIndex);
  };

  const getFilesList = async (page = 0) => {
    setIsLoading(true);

    try {
      const { element: globalElement } = globalObject;
      const fileGetterHandler = globalObject.runtime.handlerUrl(globalElement, 'get_files');
      const data = {
        current_page: page,
        page_size: 10
      };
      const filesResponse = await apiConfig.post(fileGetterHandler, data);
      const { total_count: sizeItems, files } = filesResponse.data;
      const formatFiles = files.map(({ external_url }) => ({
        original: external_url,
        thumbnail: external_url,
      }));
      setSizeItems(sizeItems);
      setImagesList((prevImages) => [...prevImages, ...formatFiles]);
      setRequest({ ...request, [page]: true });
      console.log('filesResponse', filesResponse.data);
      console.log('formatFiles', formatFiles);
    } catch (error) {
      console.log('files error', error);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentPageLastItem === currentIndex && !request[currentIndex] && !isLoading) {
      const newPage = currentPage + 1;
      setIsLoading(true);
      getFilesList(newPage - 1);
      setCurrentPage(newPage);
      setCurrentIndex(currentIndex);
    }
  }, [currentIndex, currentPageLastItem, request, isLoading]);

  useEffect(() => {
    getFilesList();
  }, []);

  return (
    <div className={`gallery-container`}>
      <div className="gallery-content">
        <ImageGallery
          items={imagesList}
          startIndex={currentIndex}
          onThumbnailClick={handleOnThumbnailClick}
          onSlide={handleOnSlide}
          lazyLoad
        />
      </div>
      <div>
       {/*
         <p> currentIndex: {currentIndex}</p>
        <p> sizeItems: {sizeItems}</p>
        <p> currentPage: {currentPage}</p>
        <p> currentPageLastItem: {currentPageLastItem}</p>

       */}

      </div>
    </div>
  );
}

export default memo(Gallery);
