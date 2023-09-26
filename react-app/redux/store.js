import { configureStore } from '@reduxjs/toolkit';

import fileReducer from './reducers/file';

const store = configureStore({
  reducer: {
    files: fileReducer,
  }
});

export default store;
