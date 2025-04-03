// src/routes/ProfileRoutes.jsx (replacing your Profile.jsx file)

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import RequireAuth from '../../components/auth/RequireAuth';
import DashboardPage from './DashboardPage';
import CreateIdentityPage from './CreateIdentityPage';
import CredentialDetailPage from './CredentialDetailPage';
import CredentialsPage from './CredentialPage';
import KycPage from './KycPage';
import OnfidoVerificationPage from './OnfidoVerificationPage';
import BridgePage from './BridgePage';

const ProfileRoutes = () => (
  <Routes>
    <Route path="/" element={<AppLayout />}>
      <Route element={<RequireAuth />}>
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="identity/create" element={<CreateIdentityPage />} />
        <Route path="credentials" element={<CredentialsPage />} />
        <Route path="credentials/:credentialHash" element={<CredentialDetailPage />} />
        <Route path="kyc" element={<KycPage />} />
        <Route path="kyc/verify" element={<OnfidoVerificationPage />} />
        <Route path="bridge" element={<BridgePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
);

export default ProfileRoutes;
