import React from 'react';
import ReactDOM from 'react-dom/client';
import globalObject from '@constants/gloablObjectEdit';

import App from './App';

// Check the environment
if (process.env.NODE_ENV === 'development') {
  // Development mode rendering
  const rootElement = document.getElementById('images-gallery-app-root-2');
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


function ImagesGalleryXBlockEdit(runtime, element, context) {
  const typeRuntime = element.getAttribute('data-runtime-class');
  globalObject.runtime = runtime;
  globalObject.element = element;
  globalObject.context = context;
  globalObject.isStudioView = element && typeRuntime === 'PreviewRuntime';
  console.log(globalObject);
  const rootElement = document.getElementById('images-gallery-app-root-2');
  // const currentDateTime = new Date().getTime();
  // const dynamicRootId = `images-gallery-app-root-2-${currentDateTime}`;
  // rootElement.setAttribute('id', dynamicRootId);
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

export { ImagesGalleryXBlockEdit };
