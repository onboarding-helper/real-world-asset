// features/credentials/credentialsApiSlice.js
import { apiSlice } from '../../app/api';

export const credentialsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCredentialsForSubject: builder.query({
      query: (did) => `/credential/subject/${did}`,
      providesTags: ['Credential'],
    }),
    getCredential: builder.query({
      query: (credentialHash) => `/credential/${credentialHash}`,
      providesTags: (result, error, id) => [{ type: 'Credential', id }],
    }),
    issueCredential: builder.mutation({
      query: (data) => ({
        url: '/credential/issue',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Credential'],
    }),
    verifyCredential: builder.mutation({
      query: (data) => ({
        url: '/credential/verify',
        method: 'POST',
        body: data,
      }),
    }),
    revokeCredential: builder.mutation({
      query: (data) => ({
        url: '/credential/revoke',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Credential'],
    }),
  }),
});

export const {
  useGetCredentialsForSubjectQuery,
  useGetCredentialQuery,
  useIssueCredentialMutation,
  useVerifyCredentialMutation,
  useRevokeCredentialMutation,
} = credentialsApiSlice;