import { useState, createContext } from 'react';

import './App.css';
import DropZoneFile from './components/DropZoneFile';
import ListImages from './components/ListImages';
import Gallery from './components/Gallery';

// Create a new context
export const MyContext = createContext();

const App = () => {
  const [isGalleryOpened, setIsGalleryOpened] = useState(false);

  const toggleGallery = () => setIsGalleryOpened(!isGalleryOpened);

  return (
    <MyContext.Provider value={{ isGalleryOpened, setIsGalleryOpened }}>
      <div className="test-div">
        <h1 className="title">Images Gallery XBlock</h1>
        <button type="button" onClick={toggleGallery}>CLick me!</button>
        {isGalleryOpened ? (
          <Gallery />
        ) : (
          <>
            <DropZoneFile />
            <ListImages />
          </>
        )}

        {/*<Gallery /> */}
      </div>
    </MyContext.Provider>
  );
};

export default App;
