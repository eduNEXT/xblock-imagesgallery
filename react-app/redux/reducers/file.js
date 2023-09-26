import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filesToUpload: []
};

export const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    setFiles: (state, action) => {
      state.filesToUpload = action.payload;
    }
  }
});

export default fileSlice.reducer;
