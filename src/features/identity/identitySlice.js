import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  did: null,
  sbtTokenId: null,
  document: null,
  chainIdentities: [],
};

export const identitySlice = createSlice({
  name: 'identity',
  initialState,
  reducers: {
    setIdentity: (state, action) => {
      const { did, sbtTokenId, document } = action.payload;
      state.did = did;
      state.sbtTokenId = sbtTokenId;
      state.document = document;
    },
    setChainIdentities: (state, action) => {
      state.chainIdentities = action.payload;
    },
    clearIdentity: (state) => {
      state.did = null;
      state.sbtTokenId = null;
      state.document = null;
      state.chainIdentities = [];
    },
  },
});

export const { setIdentity, setChainIdentities, clearIdentity } = identitySlice.actions;
export default identitySlice.reducer;