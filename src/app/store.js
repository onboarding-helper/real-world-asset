// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { apiSlice } from './api';
import authReducer from '../features/auth/authSlice';
import identityReducer from '../features/identity/identitySlice';
import credentialsReducer from '../features/credentials/credentialsSlice';
import kycReducer from '../features/kyc/kycSlice';
import bridgeReducer from '../features/bridge/bridgeSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    identity: identityReducer,
    credentials: credentialsReducer,
    kyc: kycReducer,
    bridge: bridgeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
      },
    }).concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

setupListeners(store.dispatch);

export default store;