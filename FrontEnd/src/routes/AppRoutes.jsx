import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register.jsx";

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
    getCurrentUserRole,
} from "../utils/permissions.js";

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

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route path="/login" element={<PlatformRoute><Login /></PlatformRoute>} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<PlatformRoute><Dashboard /></PlatformRoute>} />

                <Route path="/procurements" element={<PlatformRoute><ProcurementList /></PlatformRoute>} />
                <Route path="/procurements/create" element={<PlatformRoute><PermissionRoute canAccess={canManageProcurements}><CreateProcurements /></PermissionRoute></PlatformRoute>} />
                <Route path="/procurements/edit/:id" element={<PlatformRoute><PermissionRoute canAccess={canManageProcurements}><EditProcurements /></PermissionRoute></PlatformRoute>} />
                <Route path="/procurements/:id" element={<PlatformRoute><DetailsProcurements /></PlatformRoute>} />

                <Route path="/remote-access" element={<PlatformRoute><PermissionRoute canAccess={canManageRemoteAccess}><RemoteAccess /></PermissionRoute></PlatformRoute>} />
                <Route path="/users" element={<PlatformRoute><PermissionRoute canAccess={canManageUsers}><UsersManagement /></PermissionRoute></PlatformRoute>} />
                <Route path="/settings" element={<PlatformRoute><Settings /></PlatformRoute>} />

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
