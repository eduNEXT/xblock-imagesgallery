import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider, useSelector } from 'react-redux';
import globalObject from '@constants/globalObject';
import store from '@redux/store';

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
  globalObject.isEditView = context.is_edit_view;
  const rootElement = document.getElementById('images-gallery-app-root');
  const root = ReactDOM.createRoot(rootElement);

  if (!window.gettext) {
    window.gettext = (text) => text;
  }

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
}

export { ImagesGalleryXBlock };
