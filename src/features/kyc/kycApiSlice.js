import { apiSlice } from '../../app/api';

export const kycApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    initVerification: builder.mutation({
      query: (data) => ({
        url: '/kyc/init-verification',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['KYC'],
    }),
    getVerificationStatus: builder.query({
      query: (verificationId) => `/kyc/verification/${verificationId}`,
      providesTags: (result, error, id) => [{ type: 'KYC', id }],
    }),
    getUserVerifications: builder.query({
      query: () => '/kyc/verifications',
      providesTags: ['KYC'],
    }),
    generateProof: builder.mutation({
      query: (verificationId) => ({
        url: `/kyc/proof/${verificationId}`,
        method: 'POST',
      }),
      invalidatesTags: ['KYC'],
    }),
  }),
});

export const {
  useInitVerificationMutation,
  useGetVerificationStatusQuery,
  useGetUserVerificationsQuery,
  useGenerateProofMutation,
} = kycApiSlice;