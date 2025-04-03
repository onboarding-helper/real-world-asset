import { apiSlice } from '../../app/api';

export const identityApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createDID: builder.mutation({
      query: (data) => ({
        url: '/identity/did',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Identity'],
    }),
    getDID: builder.query({
      query: (did) => `/identity/did/${did}`,
      providesTags: ['Identity'],
    }),
    getChainIdentities: builder.query({
      query: (did) => `/identity/did/${did}/chain-identities`,
      providesTags: ['Identity'],
    }),
    addChainIdentity: builder.mutation({
      query: ({ did, chain, address }) => ({
        url: `/identity/did/${did}/chain-identities`,
        method: 'POST',
        body: { chain, address },
      }),
      invalidatesTags: ['Identity'],
    }),
    updateDID: builder.mutation({
      query: ({ did, updates }) => ({
        url: `/identity/did/${did}`,
        method: 'PUT',
        body: { updates },
      }),
      invalidatesTags: ['Identity'],
    }),
  }),
});

export const {
  useCreateDIDMutation,
  useGetDIDQuery,
  useGetChainIdentitiesQuery,
  useAddChainIdentityMutation,
  useUpdateDIDMutation,
} = identityApiSlice;