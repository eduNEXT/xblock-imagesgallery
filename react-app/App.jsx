import { useState } from 'react';
import Gallery from '@components/Gallery';
import XBlockEditView from '@components/XBlockEditView';
import { GalleryContext } from '@contexts/galleryContext';
import xBlockContext from '@constants/xBlockContext';

import './App.css';

const App = () => {
  const [filesToUploadList, setFilesToUploadList] = useState([]);
  const [galleryErrorMessage, setGalleryErrorMessage] = useState(null);
  const { isEditView } = xBlockContext;

  return (
    <GalleryContext.Provider
      value={{ filesToUploadList, setFilesToUploadList, galleryErrorMessage, setGalleryErrorMessage }}>
      <div className="xblock-images-gallery__container">
        {isEditView ? (
          <XBlockEditView />
        ) : (
          <Gallery />
        )}
      </div>
    </GalleryContext.Provider>
  );
};

export default App;
