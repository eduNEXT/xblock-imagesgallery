import React from 'react';
import ReactDOM from 'react-dom/client';
import globalObject from '@constants/globalObject';

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
function ImagesGalleryXBlock(runtime, element, context) {
  const typeRuntime = element.getAttribute('data-runtime-class');
  const xblockId = element.getAttribute('data-usage-id');
  globalObject.runtime = runtime;
  globalObject.element = element;
  globalObject.context = context;
  globalObject.isStudioView = element && typeRuntime === 'PreviewRuntime';
  globalObject.xblockId = xblockId;
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
