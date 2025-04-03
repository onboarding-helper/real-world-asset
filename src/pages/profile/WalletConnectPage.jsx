// WalletConnectPage.jsx
import React from 'react';
import WalletConnect from '../../components/WalletConnect';

const WalletConnectPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background-primary)]">
      <div className="max-w-md w-full">
        <div className="dark-card glass-effect p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-light text-[var(--text-primary)] mb-3">
              Copy<span className="text-[var(--accent-primary)]">m</span>
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mb-1">
              super app decentralized
            </p>
            <div className="h-px w-24 bg-[var(--border-color)] mb-8"></div>
          </div>
          
          <h2 className="text-2xl font-light text-[var(--text-primary)] mb-6">IDENTITY BRIDGE</h2>
          <p className="text-[var(--text-secondary)] mb-8">
            Connect your wallet to get started with decentralized identity management
          </p>
          <WalletConnect />
        </div>
      </div>
    </div>
  );
};

export default WalletConnectPage;