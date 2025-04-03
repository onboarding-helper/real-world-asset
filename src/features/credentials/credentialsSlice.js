// features/credentials/credentialsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  credentials: [],
  selectedCredential: null,
  loading: false,
  error: null,
};

export const credentialsSlice = createSlice({
  name: 'credentials',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.credentials = action.payload;
    },
    setSelectedCredential: (state, action) => {
      state.selectedCredential = action.payload;
    },
    clearCredentials: (state) => {
      state.credentials = [];
      state.selectedCredential = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setCredentials, 
  setSelectedCredential, 
  clearCredentials,
  setLoading,
  setError
} = credentialsSlice.actions;

export default credentialsSlice.reducer;