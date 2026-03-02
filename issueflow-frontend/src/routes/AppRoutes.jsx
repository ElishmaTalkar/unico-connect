import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';

import { Login } from '../pages/Auth/Login';
import { Signup } from '../pages/Auth/Signup';
import { Layout } from '../components/layout/Layout';
import { Dashboard } from '../pages/Dashboard/Dashboard';
import { IssuesBoard } from '../pages/Issues/IssuesBoard';

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/" element={
                <ProtectedRoute>
                    <Layout>
                        <Dashboard />
                    </Layout>
                </ProtectedRoute>
            } />
            <Route path="/workspace/:wsId/issues" element={
                <ProtectedRoute>
                    <Layout>
                        <IssuesBoard />
                    </Layout>
                </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};
