// features/bridge/bridgeApiSlice.js
import { apiSlice } from '../../app/api';

export const bridgeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    requestVerification: builder.mutation({
      query: (data) => ({
        url: '/admin/cross-chain/verifications',
        method: 'POST',
        body: data,
      }),
    }),
    bridgeTokens: builder.mutation({
      query: (data) => ({
        url: '/admin/cross-chain/bridge-tokens',
        method: 'POST',
        body: data,
      }),
    }),
    getTokenTransferStatus: builder.query({
      query: (transferId) => `/admin/cross-chain/transfers/${transferId}`,
      providesTags: (result, error, id) => [{ type: 'Bridge', id }],
    }),
    getVerificationStatus: builder.query({
      query: (requestId) => `/admin/cross-chain/verifications/${requestId}`,
      providesTags: (result, error, id) => [{ type: 'Bridge', id }],
    }),
  }),
});

export const {
  useRequestVerificationMutation,
  useBridgeTokensMutation,
  useGetTokenTransferStatusQuery,
  useGetVerificationStatusQuery,
} = bridgeApiSlice;