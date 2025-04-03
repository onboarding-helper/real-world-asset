import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  verificationId: null,
  status: null, // 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED'
  level: null,
  proofId: null,
  zkProof: null,
};

export const kycSlice = createSlice({
  name: 'kyc',
  initialState,
  reducers: {
    setVerification: (state, action) => {
      const { verificationId, status, level } = action.payload;
      state.verificationId = verificationId;
      state.status = status;
      state.level = level;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setProof: (state, action) => {
      const { proofId, zkProof } = action.payload;
      state.proofId = proofId;
      state.zkProof = zkProof;
    },
    clearKyc: (state) => {
      return initialState;
    },
  },
});

export const { setVerification, setStatus, setProof, clearKyc } = kycSlice.actions;
export default kycSlice.reducer;
