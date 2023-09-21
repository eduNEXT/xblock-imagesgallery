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
function ImagesGalleryXBlock(runtime, _, context) {
  const xblockId = context.xblock_id;
  const elementSelector = document.querySelector(`[data-usage-id="${xblockId}"]`);
  const typeRuntime = elementSelector.getAttribute('data-runtime-class');
  globalObject.runtime = runtime;
  globalObject.element = elementSelector;
  globalObject.context = context;
  globalObject.isStudioView = elementSelector && typeRuntime !== 'LmsRuntime';
  globalObject.xblockId = xblockId;
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

export { ImagesGalleryXBlock };
