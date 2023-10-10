import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DropZoneFile from '@components/DropZoneFile';
import ListImages from '@components/ListImages';
import Gallery from '@components/Gallery';
import EditVIew from '@components/EditVIew';
import XBlockActionButtons from '@components/XBlockActionButtons';
import { GalleryContext } from '@contexts/galleryContext';
import globalObject from '@constants/globalObject';
import { getItemLocalStorage, setItemLocalStorage } from '@utils/localStorageUtils';

import './App.css';

const App = () => {
  const [filesToUploadList, setFilesToUploadList] = useState([]);
  const [galleryErrorMessage, setGalleryErrorMessage] = useState(null);
  /*const state = useSelector((state) => state);
  const { filesToUpload = [] } = useSelector((state) => state.files);
  */
  const { xblockId, isStudioView, isEditView } = globalObject;

  useEffect(() => {
    /*const filesUploaded = getItemLocalStorage(xblockId) || [];
    setFilesToUploadList(filesUploaded);
    if (isEditView) {
      localStorage.removeItem(`${xblockId}_edit`);
    } */
  }, []);

  return (
    <GalleryContext.Provider
      value={{ filesToUploadList, setFilesToUploadList, galleryErrorMessage, setGalleryErrorMessage }}>
      <div className="xblock-images-gallery__container">
        <h1 className="xblock-images-gallery__title">Images Gallery XBlock</h1>
        {isStudioView && isEditView ? (
          <EditVIew />
        ) : (
          <Gallery />
        )}
      </div>
    </GalleryContext.Provider>
  );
};

export default App;
