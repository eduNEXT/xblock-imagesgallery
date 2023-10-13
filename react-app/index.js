import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import xBlockContext from '@constants/xBlockContext';
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
  xBlockContext.runtime = runtime;
  xBlockContext.element = elementSelector;
  xBlockContext.context = context;
  xBlockContext.isStudioView = elementSelector && typeRuntime !== 'LmsRuntime';
  xBlockContext.xblockId = xblockId;
  xBlockContext.isEditView = context.is_edit_view;
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
