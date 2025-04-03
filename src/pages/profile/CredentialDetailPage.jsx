import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetCredentialQuery, useRevokeCredentialMutation } from '../../features/credentials/credentialsApiSlice';

const CredentialDetailPage = () => {
  const { credentialHash } = useParams();
  const { data, isLoading, error } = useGetCredentialQuery(credentialHash);
  const [revokeCredential, { isLoading: isRevoking }] = useRevokeCredentialMutation();

  const handleRevoke = async () => {
    try {
      await revokeCredential({
        credentialHash,
        reason: 'Revoked by user'
      }).unwrap();
    } catch (err) {
      console.error('Failed to revoke credential:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="dark-card glass-effect p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-7 bg-[var(--background-secondary)] w-1/2 rounded-md"></div>
            <div className="h-4 bg-[var(--background-secondary)] w-3/4 rounded-md"></div>
            <div className="h-4 bg-[var(--background-secondary)] w-1/2 rounded-md"></div>
            <div className="h-32 bg-[var(--background-secondary)] rounded-md"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-900 bg-opacity-20 border border-red-800 text-red-400 px-4 py-3 rounded-md">
          Failed to load credential: {error.message}
        </div>
      </div>
    );
  }

  const credential = data?.credential;
  
  const statusClasses = {
    ACTIVE: 'status-indicator status-success',
    REVOKED: 'status-indicator status-danger',
    SUSPENDED: 'status-indicator status-warning',
    EXPIRED: 'bg-gray-700 text-gray-300'
  };

  return (
    <div className="container mx-auto p-4">
      <div className="dark-card glass-effect p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold">
            {credential?.credential_type || 'Verifiable Credential'}
          </h1>
          <span className={`px-2.5 py-1 rounded-full text-xs ${statusClasses[credential?.status] || 'bg-[var(--border-color)] text-[var(--text-secondary)]'}`}>
            {credential?.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Issuer</p>
            <p className="font-mono text-[var(--text-primary)]">{credential?.issuer_did}</p>
          </div>
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Subject</p>
            <p className="font-mono text-[var(--text-primary)]">{credential?.subject_did}</p>
          </div>
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Issuance Date</p>
            <p className="text-[var(--text-primary)]">{new Date(credential?.issuance_date).toLocaleDateString()}</p>
          </div>
          {credential?.expiration_date && (
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Expiration Date</p>
              <p className="text-[var(--text-primary)]">{new Date(credential?.expiration_date).toLocaleDateString()}</p>
            </div>
          )}
          {credential?.sbt_token_id && (
            <div className="col-span-2">
              <p className="text-sm text-[var(--text-secondary)]">SBT Token ID</p>
              <p className="font-mono text-[var(--text-primary)]">{credential.sbt_token_id}</p>
            </div>
          )}
        </div>

        <div className="bg-[var(--background-secondary)] border border-[var(--border-color)] p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">Credential Details</h3>
          <pre className="text-sm overflow-x-auto text-[var(--text-primary)] p-2 rounded bg-[var(--background-primary)]">
            {JSON.stringify(credential?.fullCredential || credential, null, 2)}
          </pre>
        </div>

        <div className="mt-6 flex justify-between">
          <Link
            to="/credentials"
            className="text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Credentials
          </Link>
          {credential?.status === 'ACTIVE' && (
            <button 
              onClick={handleRevoke}
              disabled={isRevoking}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:bg-red-800 disabled:opacity-50"
            >
              {isRevoking ? 'Revoking...' : 'Revoke Credential'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CredentialDetailPage;