import { useContext, memo } from 'react';
import ImageGallery from 'react-image-gallery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import 'react-image-gallery/styles/css/image-gallery.css';
import globalObject from '@constants/globalObject';
import apiConfig from '@config/api';
import ErrorMessage from '@components/ErrorMessage';

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
   * @param {number} index index of the thumbnail in the gallery
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
      const errorMessage = gettext('It has occurred an unexpected error');
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

  if (isFirstPageFetched && !sizeItems) {
    return <p>{emptyImagesMessage}</p>;
  }

  return (
    <div className="gallery-container">
      <div className="gallery-content">
        <ImageGallery items={images} />
      </div>
      <div className="actions-container">
        <button type="button" className="button-close" onClick={toggleGallery}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
      {galleryErrorMessage && (<ErrorMessage message={galleryErrorMessage} />)}
    </div>
  );
}

export default memo(Gallery);
