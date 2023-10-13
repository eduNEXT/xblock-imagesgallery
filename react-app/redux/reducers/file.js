import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filesToUpload: [],
  fetchGallery: {
   xblockId: null,
   fetched: false,
  }
};

export const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    setFiles: (state, action) => {
      state.filesToUpload = action.payload;
    },
    uploadGallery: (state, action) => {
      state.fetchGallery = action.payload;
    }
  }
});

export default fileSlice.reducer;
