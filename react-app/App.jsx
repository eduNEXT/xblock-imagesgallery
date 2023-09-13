import { useState, useEffect } from 'react';
import DropZoneFile from '@components/DropZoneFile';
import ListImages from '@components/ListImages';
import Gallery from '@components/Gallery';
import { GalleryContext } from '@contexts/galleryContext';
import globalObject from '@constants/globalObject';
import { getItemLocalStorage } from '@utils/localStorageUtils';

import './App.css';

const App = () => {
  const [filesToUploadList, setFilesToUploadList] = useState([]);
  const { xblockId, isStudioView } = globalObject;

  useEffect(() => {
    const filesUploaded = getItemLocalStorage(xblockId) || [];
    setFilesToUploadList(filesUploaded);
  }, []);

  return (
    <GalleryContext.Provider value={{ filesToUploadList, setFilesToUploadList }}>
      <div className="xblock-images-gallery__container">
        <h1 className="xblock-images-gallery__title">Images Gallery XBlock</h1>
        {isStudioView ? (
          <>
            <DropZoneFile />
            <ListImages list={filesToUploadList} />
          </>
        ) : (
          <Gallery />
        )}
      </div>
    </GalleryContext.Provider>
  );
};

export default App;
