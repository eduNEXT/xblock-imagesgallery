import { memo, useEffect, useState } from 'react'
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import xBlockContext from '@constants/xBlockContext';
import apiConfig from '@config/api';
import ErrorMessage from '@components/ErrorMessage';
import Spinner from '@components/Spinner';

import './styles.css';

const itemsPerPage = 10;

function Gallery() {
  const [imagesList, setImagesList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sizeItems, setSizeItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [fetchedPages, setFetchedPages] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [galleryErrorMessage, setGalleryErrorMessage] = useState(null);
  const currentPageLastItem = currentPage * itemsPerPage - 1;

  /**
   * When a thumbnail in the gallery is clicked
   * @param {ClickEvent} _ the event won't be used so we use _
   * @param {number} index it's the thumbnail's index in the gallery
   */
  const handleOnThumbnailClick = (_, index) => {
    setCurrentIndex(index);
  };

  /**
   * Gets the index of the current file when previous/next/thumbnail/ are clicked
   * @param {number} currentIndex page that will be fetched
   */
  const handleOnSlide = (currentIndex) => {
    setCurrentIndex(currentIndex);
  };

  /**
   * Gets the files from backend with a page index given
   * @param {number} page page that will be fetched
   */
  const fetchUploadedFiles = async (page = 0) => {
    setIsLoading(true);

    try {
      const { element: globalElement } = xBlockContext;
      const fileGetterHandler = xBlockContext.runtime.handlerUrl(globalElement, 'get_files');
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
      const errorMessage = gettext('An unexpected error has occurred');
      setGalleryErrorMessage(errorMessage);
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

  if (isLoading) {
    return <Spinner />;
  }

  if (isFirstPageFetched && !sizeItems) {
    return <p>{emptyImagesMessage}</p>;
  }

  return (
    <div className="gallery-container">
      <div className="gallery-content">
        <ImageGallery
          items={imagesList}
          startIndex={currentIndex}
          onThumbnailClick={handleOnThumbnailClick}
          onSlide={handleOnSlide}
          lazyLoad
        />
      </div>
      {galleryErrorMessage && <ErrorMessage message={galleryErrorMessage} />}
    </div>
  );
}

export default memo(Gallery);
