import { memo, useEffect, useState } from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import globalObject from '@constants/globalObject';
import apiConfig from '@config/api';

import './styles.css';

const itemsPerPage = 10;

function Gallery() {
  const [imagesList, setImagesList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sizeItems, setSizeItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [fetchedPages, setFetchedPages] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const currentPageLastItem = currentPage * itemsPerPage - 1;

  const handleOnThumbnailClick = (_, index) => {
    setCurrentIndex(index);
  };

  const handleOnSlide = (currentIndex) => {
    setCurrentIndex(currentIndex);
  };

  const fetchUploadedFiles = async (page = 0) => {
    setIsLoading(true);

    try {
      const { element: globalElement } = globalObject;
      const fileGetterHandler = globalObject.runtime.handlerUrl(globalElement, 'get_files');
      const data = {
        current_page: page,
        page_size: itemsPerPage
      };

      const filesResponse = await apiConfig.post(fileGetterHandler, data);
      const { total_count: sizeItems, files } = filesResponse.data;
      const formatImages = files.map(({ external_url }) => ({
        original: external_url,
        thumbnail: external_url
      }));

      setSizeItems(sizeItems);
      setImagesList((prevImages) => [...prevImages, ...formatImages]);
      setFetchedPages({ ...fetchedPages, [page]: true });
    } catch (error) {
      console.log('files error', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentPageLastItem === currentIndex && !fetchedPages[currentIndex] && !isLoading) {
      const newPage = currentPage + 1;
      setIsLoading(true);
      fetchUploadedFiles(currentPage);
      setCurrentPage(newPage);
      setCurrentIndex(currentIndex);
    }
  }, [currentIndex, currentPageLastItem, fetchedPages, isLoading]);

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const isFirstPageFetched = Boolean(fetchedPages[0]);
  const emptyImagesMessage = gettext('There are not images available');

  if (isFirstPageFetched && !sizeItems) {
    return <p>{emptyImagesMessage}</p>;
  }

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
    </div>
  );
}

export default memo(Gallery);
