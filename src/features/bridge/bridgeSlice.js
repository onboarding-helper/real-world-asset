import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pendingTransactions: [],
  targetChain: null,
  sourceChain: null,
  selectedToken: null,
  amount: 0,
};

export const bridgeSlice = createSlice({
  name: 'bridge',
  initialState,
  reducers: {
    setTargetChain: (state, action) => {
      state.targetChain = action.payload;
    },
    setSourceChain: (state, action) => {
      state.sourceChain = action.payload;
    },
    setSelectedToken: (state, action) => {
      state.selectedToken = action.payload;
    },
    setAmount: (state, action) => {
      state.amount = action.payload;
    },
    addPendingTransaction: (state, action) => {
      state.pendingTransactions.push(action.payload);
    },
    updatePendingTransaction: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.pendingTransactions.findIndex(tx => tx.id === id);
      if (index !== -1) {
        state.pendingTransactions[index] = { ...state.pendingTransactions[index], ...updates };
      }
    },
    removePendingTransaction: (state, action) => {
      state.pendingTransactions = state.pendingTransactions.filter(tx => tx.id !== action.payload);
    },
    clearBridge: (state) => {
      state.targetChain = null;
      state.sourceChain = null;
      state.selectedToken = null;
      state.amount = 0;
    },
  },
});

export const {
  setTargetChain,
  setSourceChain,
  setSelectedToken,
  setAmount,
  addPendingTransaction,
  updatePendingTransaction,
  removePendingTransaction,
  clearBridge
} = bridgeSlice.actions;

export default bridgeSlice.reducer;
