import { useState, useEffect } from 'react';
import DropZoneFile from '@components/DropZoneFile';
import ListImages from '@components/ListImages';
import Gallery from '@components/Gallery';
import { GalleryContext } from '@contexts/galleryContext';

import './App.css';

const App = () => {
  const [isGalleryOpened, setIsGalleryOpened] = useState(false);
  const [filesToUploadList, setFilesToUploadList] = useState([]);

  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <GalleryContext.Provider value={{ isGalleryOpened, setIsGalleryOpened, filesToUploadList, setFilesToUploadList }}>
      <div className="container">
        <h1 className="title">Images Gallery XBlock</h1>
        {isGalleryOpened ? (
          <Gallery />
        ) : (
          <>
            <DropZoneFile />
            <ListImages list={filesToUploadList} />
          </>
        )}
      </div>
    </GalleryContext.Provider>
  );
};

export default App;
