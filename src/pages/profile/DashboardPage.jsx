// Fixed hover effects for Dashboard in both dark and light mode
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useGetUserProfileQuery } from '../../features/auth/authApiSlice';
import { useGetDIDQuery } from '../../features/identity/identityApiSlice';
import { useGetCredentialsForSubjectQuery } from '../../features/credentials/credentialsApiSlice';
import { setIdentity } from '../../features/identity/identitySlice';
import { setCredentials } from '../../features/credentials/credentialsSlice';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { did, sbtTokenId } = useSelector(state => state.identity);
  
  // Fetch user profile
  const { data: profileData } = useGetUserProfileQuery();
  
  // Fetch DID document if user has a DID
  const { data: didData } = useGetDIDQuery(profileData?.user?.did, {
    skip: !profileData?.user?.did
  });
  
  // Fetch credentials for this DID
  const { data: credentialsData } = useGetCredentialsForSubjectQuery(profileData?.user?.did, {
    skip: !profileData?.user?.did
  });
  
  useEffect(() => {
    // Set identity information in state when data is loaded
    if (didData && didData.success) {
      dispatch(setIdentity({
        did: didData.did,
        sbtTokenId: didData.sbtTokenId,
        document: didData.didDocument
      }));
    }
    
    // Set credentials in state when data is loaded
    if (credentialsData && credentialsData.success) {
      dispatch(setCredentials(credentialsData.credentials));
    }
  }, [didData, credentialsData, dispatch]);
  
  // If user doesn't have a DID, show DID creation component
  if (!did && !profileData?.user?.did) {
    return (
      <div className="container mx-auto p-4">
        <div className="dark-card glass-effect p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to Identity Bridge</h1>
          <p className="text-[var(--text-secondary)] mb-6">You need to create a decentralized identity (DID) to get started.</p>
          <Link
            to="/identity/create"
            className="dark-button inline-block"
          >
            Create Identity
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Identity Overview */}
        <div className="dark-card glass-effect p-6 md:col-span-2">
          <h2 className="text-xl font-bold mb-4">Identity Overview</h2>
          <div className="mb-4">
            <p className="text-[var(--text-secondary)]">DID</p>
            <p className="font-mono text-sm break-all text-[var(--text-primary)]">{did || profileData?.user?.did}</p>
          </div>
          <div className="mb-4">
            <p className="text-[var(--text-secondary)]">SBT Token ID</p>
            <p className="font-mono text-[var(--text-primary)]">{sbtTokenId}</p>
          </div>
          <div className="mb-4">
            <p className="text-[var(--text-secondary)]">Wallet Address</p>
            <p className="font-mono text-sm break-all text-[var(--text-primary)]">{user?.walletAddress}</p>
          </div>
        </div>
        
        {/* Status Card */}
        <div className="dark-card glass-effect p-6">
          <h2 className="text-xl font-bold mb-4">Verification Status</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)] flex items-center justify-center text-black mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-[var(--text-primary)]">Identity Created</p>
                <p className="text-sm text-[var(--text-secondary)]">Your decentralized identity is active</p>
              </div>
            </div>
            
            {/* KYC Status */}
            <div className="flex items-center">
              {profileData?.user?.kycVerified ? (
                <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)] flex items-center justify-center text-black mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <div>
                <p className="font-semibold text-[var(--text-primary)]">KYC Verification</p>
                <p className="text-sm text-[var(--text-secondary)]">
                  {profileData?.user?.kycVerified
                    ? 'Verification completed'
                    : <Link to="/kyc" className="text-[var(--accent-primary)] hover:text-[var(--accent-secondary)]">Complete verification</Link>}
                </p>
              </div>
            </div>
            
            {/* Credentials Status */}
            <div className="flex items-center">
              {(credentialsData?.credentials?.length > 0) ? (
                <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)] flex items-center justify-center text-black mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <div>
                <p className="font-semibold text-[var(--text-primary)]">Verifiable Credentials</p>
                <p className="text-sm text-[var(--text-secondary)]">
                  {credentialsData?.credentials?.length > 0
                    ? `${credentialsData.credentials.length} credential(s) issued`
                    : 'No credentials yet'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Credentials */}
        <div className="dark-card glass-effect p-6 md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Recent Credentials</h2>
            <Link to="/credentials" className="text-[var(--accent-primary)] hover:text-[var(--accent-secondary)]">
              View All
            </Link>
          </div>
          
          {credentialsData?.credentials?.length > 0 ? (
            <div className="space-y-4">
              {credentialsData.credentials.slice(0, 3).map(credential => (
                <div key={credential.credential_hash} className="border border-[var(--border-color)] rounded-lg p-4 bg-[var(--background-secondary)] hover:bg-[var(--hover-bg)] transition-colors">
                  <div className="flex justify-between">
                    <p className="font-semibold text-[var(--text-primary)]">{credential.credential_type || 'Credential'}</p>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      credential.status === 'ACTIVE' ? 'status-indicator status-success' :
                      credential.status === 'REVOKED' ? 'status-indicator status-danger' :
                      'status-indicator status-warning'
                    }`}>
                      {credential.status}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">Issued by: {credential.issuer_did}</p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Issued: {new Date(credential.issuance_date).toLocaleDateString()}
                  </p>
                  <Link
                    to={`/credentials/${credential.credential_hash}`}
                    className="text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] text-sm block mt-2"
                  >
                    View Details →
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-[var(--text-secondary)]">No credentials found</p>
              <p className="mt-2">
                <Link to="/kyc" className="text-[var(--accent-primary)] hover:text-[var(--accent-secondary)]">
                  Complete KYC verification
                </Link>{' '}
                to get your first credential.
              </p>
            </div>
          )}
        </div>
        
        {/* Quick Actions */}
        <div className="dark-card glass-effect p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/bridge"
              className="action-link block border border-[var(--border-color)] hover:border-[var(--accent-primary)] p-3 rounded-lg bg-[var(--background-secondary)] hover:bg-[var(--hover-bg)] transition-colors"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[var(--background-primary)] text-[var(--accent-primary)] flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
                  </svg>
                </div>
                <span className="text-[var(--text-primary)]">Cross-Chain Bridge</span>
              </div>
            </Link>
            
            <Link
              to="/kyc"
              className="action-link block border border-[var(--border-color)] hover:border-[var(--accent-primary)] p-3 rounded-lg bg-[var(--background-secondary)] hover:bg-[var(--hover-bg)] transition-colors"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[var(--background-primary)] text-[var(--accent-primary)] flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-[var(--text-primary)]">KYC Verification</span>
              </div>
            </Link>
            
            <Link
              to="/credentials"
              className="action-link block border border-[var(--border-color)] hover:border-[var(--accent-primary)] p-3 rounded-lg bg-[var(--background-secondary)] hover:bg-[var(--hover-bg)] transition-colors"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[var(--background-primary)] text-[var(--accent-primary)] flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-[var(--text-primary)]">Manage Credentials</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;