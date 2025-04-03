import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import { setCredentials, setWalletAddress, setChainId, setLoading, setError } from '../features/auth/authSlice';
import { useGetChallengeMutation, useVerifySignatureMutation } from '../features/auth/authApiSlice';

const WalletConnect = () => {
    const [provider, setProvider] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [getChallenge] = useGetChallengeMutation();
    const [verifySignature] = useVerifySignatureMutation();

    // Check if MetaMask is installed
    useEffect(() => {
        const checkProvider = async () => {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                setProvider(provider);

                // Listen for chain changes
                window.ethereum.on('chainChanged', (chainId) => {
                    dispatch(setChainId(parseInt(chainId, 16)));
                });

                // Listen for account changes
                window.ethereum.on('accountsChanged', (accounts) => {
                    if (accounts.length > 0) {
                        dispatch(setWalletAddress(accounts[0]));
                    } else {
                        dispatch(setWalletAddress(null));
                    }
                });
            }
        };

        checkProvider();

        return () => {
            // Clean up listeners
            if (window.ethereum) {
                window.ethereum.removeAllListeners('chainChanged');
                window.ethereum.removeAllListeners('accountsChanged');
            }
        };
    }, [dispatch]);

    const connectWallet = async () => {
        if (!provider) {
            alert('MetaMask is not installed!');
            return;
        }

        try {
            dispatch(setLoading(true));

            // Request account access
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const walletAddress = accounts[0];

            // Get the chain ID
            const { chainId } = await provider.getNetwork();

            // Set wallet address and chain ID in state
            dispatch(setWalletAddress(walletAddress));
            dispatch(setChainId(chainId));

            // Get the challenge
            const chainName = chainId === 80002 ? 'polygon' : 'polygon';
            const challengeResponse = await getChallenge({
                walletAddress,
                chain: chainName
            }).unwrap();

            // Sign the challenge
            const signer = provider.getSigner();
            const signature = await signer.signMessage(challengeResponse.challenge);

            // Verify the signature
            const verifyResponse = await verifySignature({
                walletAddress,
                signature,
                chain: chainName
            }).unwrap();

            if (verifyResponse.success) {
                // Set the credentials in state
                dispatch(setCredentials({
                    user: verifyResponse.user,
                    token: verifyResponse.token
                }));

                // Navigate to dashboard
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Error connecting wallet:', error);
            dispatch(setError(error.message || 'Failed to connect wallet'));
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <button
            onClick={connectWallet}
            className="dark-button flex items-center justify-center w-full px-6 py-3"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1.5l-1.8-1.8A2 2 0 0010.9 2H9.1a2 2 0 00-1.7.8L5.5 4H4zm7 5a1 1 0 10-2 0v.5H8a1 1 0 100 2h1v.5a1 1 0 102 0v-.5h1a1 1 0 100-2h-1V9z" />
            </svg>
            Connect Wallet
        </button>
    );
};

export default WalletConnect;