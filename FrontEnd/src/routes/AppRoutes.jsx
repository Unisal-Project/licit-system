import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register.jsx";
import ForgotPassword from "../pages/auth/ForgotPassword.jsx";
import ResetPassword from "../pages/auth/ResetPassword.jsx";

import Dashboard from "../pages/dashboard/Dashboard.jsx";

import ProcurementList from "../pages/procurements/ProcurementList";
import CreateProcurements from "../pages/procurements/CreateProcurements.jsx";
import EditProcurements from "../pages/procurements/EditProcurements.jsx";
import DetailsProcurements from "../pages/procurements/DetailsProcurements.jsx";

import RemoteAccess from "../pages/remote-access/RemoteAccess.jsx";
import Settings from "../pages/settings/Settings.jsx";
import UsersManagement from "../pages/users/UsersManagement.jsx";
import UnsupportedPlatform from "../pages/unsupported/UnsupportedPlatform.jsx";
import {
    canManageProcurements,
    canManageRemoteAccess,
    canManageUsers,
    canAccessSettings,
    getCurrentUserRole,
} from "../utils/permissions.js";
import { isAuthenticated } from "../services/authService.js";

function useUnsupportedPlatform() {
    const getIsUnsupported = () => {
        if (typeof window === "undefined") {
            return false;
        }

        return window.matchMedia(
            "(max-width: 1180px), (pointer: coarse)"
        ).matches;
    };

    const [isUnsupported, setIsUnsupported] = useState(getIsUnsupported);

    useEffect(() => {
        const mediaQuery = window.matchMedia(
            "(max-width: 1180px), (pointer: coarse)"
        );

        const updatePlatform = () => setIsUnsupported(mediaQuery.matches);

        updatePlatform();
        mediaQuery.addEventListener("change", updatePlatform);

        return () => mediaQuery.removeEventListener("change", updatePlatform);
    }, []);

    return isUnsupported;
}

function PlatformRoute({ children }) {
    const isUnsupported = useUnsupportedPlatform();

    if (isUnsupported) {
        return <UnsupportedPlatform />;
    }

    return children;
}

function PermissionRoute({ children, canAccess, fallback = "/procurements" }) {
    const currentRole = getCurrentUserRole();

    if (!canAccess(currentRole)) {
        return <Navigate to={fallback} replace />;
    }

    return children;
}

function ProtectedRoute({ children }) {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route path="/login" element={<PlatformRoute><Login /></PlatformRoute>} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<PlatformRoute><ForgotPassword /></PlatformRoute>} />
                <Route path="/reset-password" element={<PlatformRoute><ResetPassword /></PlatformRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><PlatformRoute><Dashboard /></PlatformRoute></ProtectedRoute>} />

                <Route path="/procurements" element={<ProtectedRoute><PlatformRoute><ProcurementList /></PlatformRoute></ProtectedRoute>} />
                <Route path="/procurements/create" element={<ProtectedRoute><PlatformRoute><PermissionRoute canAccess={canManageProcurements}><CreateProcurements /></PermissionRoute></PlatformRoute></ProtectedRoute>} />
                <Route path="/procurements/edit/:id" element={<ProtectedRoute><PlatformRoute><PermissionRoute canAccess={canManageProcurements}><EditProcurements /></PermissionRoute></PlatformRoute></ProtectedRoute>} />
                <Route path="/procurements/:id" element={<ProtectedRoute><PlatformRoute><DetailsProcurements /></PlatformRoute></ProtectedRoute>} />

                <Route path="/remote-access" element={<ProtectedRoute><PlatformRoute><PermissionRoute canAccess={canManageRemoteAccess}><RemoteAccess /></PermissionRoute></PlatformRoute></ProtectedRoute>} />
                <Route path="/users" element={<ProtectedRoute><PlatformRoute><PermissionRoute canAccess={canManageUsers}><UsersManagement /></PermissionRoute></PlatformRoute></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><PlatformRoute><PermissionRoute canAccess={canAccessSettings}><Settings /></PermissionRoute></PlatformRoute></ProtectedRoute>} />

                <Route path="*" element={<Navigate to="/procurements" replace />} />

            </Routes>
            
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                theme="light"
            />
        </BrowserRouter>
    );
}

export default AppRoutes;
