import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useGetUserVerificationsQuery, useGenerateProofMutation } from '../../features/kyc/kycApiSlice';
import { setVerification, setProof } from '../../features/kyc/kycSlice';

const KycPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { verificationId, status, level, proofId } = useSelector(state => state.kyc);
  
  // Fetch user's verification history
  const { data: verificationsData, isLoading } = useGetUserVerificationsQuery();
  
  // Generate ZK proof mutation
  const [generateProof, { isLoading: isGeneratingProof }] = useGenerateProofMutation();
  
  // Update verification state when data is loaded
  useEffect(() => {
    if (verificationsData?.verifications && verificationsData.verifications.length > 0) {
      // Get the most recent verification
      const latestVerification = verificationsData.verifications[0];
      
      dispatch(setVerification({
        verificationId: latestVerification.id,
        status: latestVerification.status,
        level: latestVerification.verification_level
      }));
    }
  }, [verificationsData, dispatch]);
  
  const startVerification = (level) => {
    navigate('/kyc/verify', { state: { level } });
  };
  
  const handleGenerateProof = async () => {
    if (!verificationId) return;
    
    try {
      const response = await generateProof(verificationId).unwrap();
      
      if (response.success) {
        dispatch(setProof({
          proofId: response.proofId,
          zkProof: response.publicInputs
        }));
      }
    } catch (error) {
      console.error('Error generating proof:', error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="dark-card glass-effect p-6 flex items-center justify-center min-h-[300px]">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="dark-card glass-effect p-6">
        <h1 className="text-2xl font-bold mb-6">KYC Verification</h1>
        
        {/* Verification Status */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Verification Status</h2>
          
          {status ? (
            <div className="bg-[var(--background-secondary)] border border-[var(--border-color)] p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  status === 'APPROVED' || status === 'VERIFIED' ? 'bg-[var(--accent-primary)] text-black' :
                  status === 'PENDING' || status === 'IN_PROGRESS' ? 'bg-[var(--warning)] text-black' :
                  'bg-[var(--danger)] text-white'
                }`}>
                  {status === 'APPROVED' || status === 'VERIFIED' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : status === 'PENDING' || status === 'IN_PROGRESS' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">{level || 'KYC'} Verification</p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Status: <span className="font-medium">{status}</span>
                  </p>
                </div>
              </div>
              
              {(status === 'APPROVED' || status === 'VERIFIED') && (
                <div>
                  <p className="text-sm text-[var(--text-secondary)] mb-4">
                    Your identity has been verified. You can now generate a zero-knowledge proof to share your verification status without revealing your personal information.
                  </p>
                  <button
                    onClick={handleGenerateProof}
                    disabled={isGeneratingProof || !!proofId}
                    className={`px-4 py-2 rounded-md ${
                      proofId
                        ? 'bg-green-900 bg-opacity-20 text-green-400 border border-green-800 cursor-not-allowed'
                        : isGeneratingProof
                          ? 'bg-[var(--background-secondary)] text-[var(--text-secondary)] cursor-not-allowed'
                          : 'dark-button'
                    }`}
                  >
                    {proofId
                      ? 'Proof Generated'
                      : isGeneratingProof
                        ? 'Generating...'
                        : 'Generate ZK Proof'}
                  </button>
                  
                  {proofId && (
                    <div className="mt-4 p-3 bg-green-900 bg-opacity-10 border border-green-800 rounded-md">
                      <p className="text-sm font-semibold text-green-400">Proof Generated Successfully</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-1 font-mono">Proof ID: {proofId}</p>
                    </div>
                  )}
                </div>
              )}
              
              {(status === 'PENDING' || status === 'IN_PROGRESS') && (
                <p className="text-sm text-[var(--text-secondary)]">
                  Your verification is being processed. This may take a few minutes.
                </p>
              )}
              
              {(status === 'REJECTED' || status === 'FAILED') && (
                <div>
                  <p className="text-sm text-[var(--text-secondary)] mb-4">
                    Your verification was not successful. Please try again with valid documentation.
                  </p>
                  <button
                    onClick={() => startVerification(level || 'BASIC')}
                    className="dark-button px-4 py-2"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-[var(--text-secondary)] mb-6">
              You have not completed KYC verification yet. Choose a verification level to get started.
            </p>
          )}
        </div>
        
        {/* Verification Levels */}
        {!status && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Choose Verification Level</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="dark-card glass-effect border border-[var(--border-color)] rounded-lg p-4 hover:border-[var(--accent-primary)] transition-all">
                <h3 className="font-bold mb-2 text-[var(--text-primary)]">Basic Verification</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">Simple ID verification for basic access.</p>
                <button
                  onClick={() => startVerification('BASIC')}
                  className="dark-button px-4 py-2 w-full"
                >
                  Start Basic Verification
                </button>
              </div>
              
              <div className="dark-card glass-effect border border-[var(--border-color)] rounded-lg p-4 hover:border-[var(--accent-primary)] transition-all">
                <h3 className="font-bold mb-2 text-[var(--text-primary)]">Advanced Verification</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">Comprehensive ID verification for full access.</p>
                <button
                  onClick={() => startVerification('ADVANCED')}
                  className="dark-button px-4 py-2 w-full"
                >
                  Start Advanced Verification
                </button>
              </div>
              
              <div className="dark-card glass-effect border border-[var(--border-color)] rounded-lg p-4 hover:border-[var(--accent-primary)] transition-all">
                <h3 className="font-bold mb-2 text-[var(--text-primary)]">Business Verification</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">Business entity verification for institutional access.</p>
                <button
                  onClick={() => startVerification('BUSINESS')}
                  className="dark-button px-4 py-2 w-full"
                >
                  Start Business Verification
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Verification History */}
        {verificationsData?.verifications && verificationsData.verifications.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Verification History</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-[var(--background-secondary)] text-[var(--text-secondary)] uppercase text-xs">
                    <th className="py-3 px-4 text-left rounded-tl-lg">Date</th>
                    <th className="py-3 px-4 text-left">Level</th>
                    <th className="py-3 px-4 text-left">Provider</th>
                    <th className="py-3 px-4 text-left rounded-tr-lg">Status</th>
                  </tr>
                </thead>
                <tbody className="text-[var(--text-primary)]">
                  {verificationsData.verifications.map((verification, index) => (
                    <tr key={verification.id} className={index === verificationsData.verifications.length - 1 ? "" : "border-b border-[var(--border-color)]"}>
                      <td className="py-3 px-4">{new Date(verification.submitted_at).toLocaleDateString()}</td>
                      <td className="py-3 px-4">{verification.verification_level}</td>
                      <td className="py-3 px-4">{verification.provider}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          verification.status === 'APPROVED' || verification.status === 'VERIFIED'
                            ? 'status-indicator status-success'
                            : verification.status === 'PENDING' || verification.status === 'IN_PROGRESS'
                              ? 'status-indicator status-warning'
                              : 'status-indicator status-danger'
                        }`}>
                          {verification.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KycPage;