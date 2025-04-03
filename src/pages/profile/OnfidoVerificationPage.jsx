import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import onfidoService from '../../services/onfidoService';
import '../../styles/dark-theme.css';

// Add error boundary around SDK loading
const withErrorBoundary = (WrappedComponent) => {
  return class extends React.Component {
    state = { hasError: false, errorMessage: null };
    
    static getDerivedStateFromError(error) {
      return { hasError: true, errorMessage: error.message };
    }
    
    componentDidCatch(error, info) {
      console.error('SDK Error Boundary caught error:', error, info);
    }
    
    render() {
      if (this.state.hasError) {
        return (
          <div className="dark-card glass-effect">
            <h3 className="text-red-400 font-medium mb-2">SDK Loading Error</h3>
            <p className="text-gray-300 mb-4">{this.state.errorMessage || 'Failed to load SDK'}</p>
            <button 
              onClick={() => window.location.reload()}
              className="dark-button"
            >
              Refresh Page
            </button>
          </div>
        );
      }
      return <WrappedComponent {...this.props} />;
    }
  };
};

const OnfidoVerificationPage = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationData, setVerificationData] = useState(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user) || {};
  const containerRef = useRef(null);
  const sdkInitializedRef = useRef(false);
  const maxRetries = 3;
  const retryDelayMs = 1000;
  const verificationInitialized = useRef(false);

  // Effect to load Onfido SDK script
  useEffect(() => {
    let retryCount = 0;
    let scriptElement = null;
    let loadingAttempted = false;

    const loadSDK = () => {
      // Check if SDK is already loaded
      if (window.Onfido) {
        console.log('Onfido SDK already loaded');
        setSdkLoaded(true);
        return;
      }

      // Prevent exceeding max retries
      if (retryCount >= maxRetries) {
        console.error(`Failed to load Onfido SDK after ${maxRetries} attempts`);
        setError('Failed to load verification SDK. Please refresh the page and try again.');
        setIsLoading(false);
        return;
      }

      // Track this attempt
      console.log(`Loading Onfido SDK (attempt ${retryCount + 1}/${maxRetries})`);
      
      // Remove any existing failed script/style elements
      const existingScript = document.querySelector('script[src*="onfido"]');
      const existingStyle = document.querySelector('link[href*="onfido"]');
      if (existingScript) existingScript.remove();
      if (existingStyle) existingStyle.remove();
      
      // Load JavaScript with new CDN URL format
      scriptElement = document.createElement('script');
      scriptElement.src = 'https://sdk.onfido.com/v14.43.0';
      scriptElement.crossOrigin = 'anonymous';
      scriptElement.async = true;
      scriptElement.type = 'text/javascript';
      scriptElement.charset = 'utf-8';

      scriptElement.onload = () => {
        console.log('Onfido SDK loaded successfully');
        setSdkLoaded(true);
      };

      scriptElement.onerror = () => {
        console.error(`Failed to load Onfido SDK (attempt ${retryCount + 1}/${maxRetries})`);
        if (retryCount < maxRetries - 1) {
          retryCount++;
          setTimeout(loadSDK, retryDelayMs);
        } else {
          setError('Failed to load verification SDK. Please refresh the page and try again.');
          setIsLoading(false);
        }
      };

      document.head.appendChild(scriptElement);
    };

    if (!loadingAttempted) {
      loadingAttempted = true;
      loadSDK();
    }

    return () => {
      // Cleanup function
      if (scriptElement) scriptElement.remove();
      if (sdkInitializedRef.current) {
        onfidoService.tearDown();
        sdkInitializedRef.current = false;
      }
    };
  }, []);

  // Check when the container element is ready
  useEffect(() => {
    const checkContainer = () => {
      const container = document.getElementById('onfido-mount');
      if (container) {
        console.log('Onfido mount container is now available in the DOM');
        setSdkReady(true);
        return true;
      }
      return false;
    };

    // Check immediately
    if (!checkContainer()) {
      // If not ready, set up a polling mechanism
      const intervalId = setInterval(() => {
        if (checkContainer()) {
          clearInterval(intervalId);
        }
      }, 100); // Check every 100ms

      // Clean up interval
      return () => clearInterval(intervalId);
    }
  }, []);

  // Effect to initialize verification when SDK is loaded AND container is ready
  useEffect(() => {
    const initializeVerification = async () => {
      // Only proceed if SDK is loaded, container is ready, and we haven't already initialized
      if (!sdkLoaded || !sdkReady || verificationInitialized.current) {
        return;
      }

      verificationInitialized.current = true;
      console.log('Initializing verification with SDK and container ready');

      try {
        setIsLoading(true);
        const response = await fetch('/api/kyc/init-verification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            firstName: user?.firstName || 'Test',
            lastName: user?.lastName || 'User',
            email: user?.email || 'test@example.com'
          })
        });

        if (!response.ok) {
          throw new Error('Failed to initialize verification');
        }

        const data = await response.json();
        console.log('Verification data received:', data);
        
        if (!data.sdkToken || !data.workflowRunId) {
          throw new Error('Invalid response from server: missing required data');
        }

        setVerificationData(data);

        // Double check the mount element exists
        const mountElement = document.getElementById('onfido-mount');
        console.log('Mount element exists before SDK init:', !!mountElement);
        
        if (!mountElement) {
          throw new Error('Mount element not found in DOM');
        }

        // Initialize Onfido SDK
        try {
          sdkInitializedRef.current = true;
          onfidoService.initialize(
            data.sdkToken,
            data.workflowRunId,
            {
              containerId: 'onfido-mount',
              useModal: true,
              onComplete: (data) => {
                console.log('Verification completed:', data);
                navigate('/kyc', { 
                  state: { 
                    verificationComplete: true,
                    applicantId: data.applicantId
                  }
                });
              },
              onError: (error) => {
                console.error('Verification error:', error);
                setError(error.message || 'Error during verification process');
                sdkInitializedRef.current = false;
              },
              onModalRequestClose: () => {
                navigate('/kyc');
              }
            }
          );
          console.log('Onfido SDK initialized successfully');
        } catch (error) {
          console.error('SDK initialization error:', error);
          setError(error.message || 'Failed to initialize SDK');
          sdkInitializedRef.current = false;
        } finally {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Verification initialization error:', error);
        setError(error.message || 'Failed to initialize verification');
        setIsLoading(false);
      }
    };

    initializeVerification();
  }, [sdkLoaded, sdkReady, navigate, user]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="glass-effect max-w-md w-full p-8 rounded-xl">
          <h2 className="text-[var(--text-primary)] text-xl font-semibold mb-4">Verification Error</h2>
          <p className="text-[var(--text-secondary)] mb-6">{error}</p>
          <button
            onClick={() => navigate('/kyc')}
            className="dark-button w-full"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !sdkLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="loading-spinner mb-4"></div>
        <p className="text-[var(--text-secondary)]">
          {!sdkLoaded ? 'Loading verification SDK...' : 'Initializing verification...'}
        </p>
      </div>
    );
  }

  // Make sure we render the container with the ID before trying to use it
  return (
    <div className="min-h-screen flex justify-center items-center p-6">
      <div 
        id="onfido-mount" 
        ref={containerRef}
        className="w-full max-w-4xl glass-effect"
        style={{ 
          minHeight: '600px',
          background: 'var(--background-secondary)',
          borderRadius: '1rem',
          overflow: 'hidden'
        }}
      />
    </div>
  );
};

// Wrap component with error boundary
export default withErrorBoundary(OnfidoVerificationPage);