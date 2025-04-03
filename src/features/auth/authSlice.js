import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
  walletAddress: null,
  chainId: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem('token', token);
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.walletAddress = null;
      state.chainId = null;
      localStorage.removeItem('token');
    },
    setWalletAddress: (state, action) => {
      state.walletAddress = action.payload;
    },
    setChainId: (state, action) => {
      state.chainId = action.payload;
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
  logOut,
  setWalletAddress,
  setChainId,
  setLoading,
  setError
} = authSlice.actions;

export default authSlice.reducer;