import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

// Check the environment
if (process.env.NODE_ENV === 'development') {
  // Development mode rendering
  const rootElement = document.getElementById('images-gallery-app-root');
  const root = ReactDOM.createRoot(rootElement);

  if (!window.gettext) {
    window.gettext = (text) => text;
  }

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// Production mode rendering
function ImagesGalleryXBlock(runtime, element, options) {
  const rootElement = document.getElementById('images-gallery-app-root');
  const currentDateTime = new Date().getTime();
  const dynamicRootId = `images-gallery-app-root-${currentDateTime}`;
  rootElement.setAttribute('id', dynamicRootId);
  const root = ReactDOM.createRoot(rootElement);

  if (!window.gettext) {
    window.gettext = (text) => text;
  }

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

export { ImagesGalleryXBlock };
