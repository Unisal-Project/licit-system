import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";

import Dashboard from "../pages/dashboard/Dashboard.jsx";

import ProcurementList from "../pages/procurements/ProcurementList";
import CreateProcurements from "../pages/procurements/CreateProcurements.jsx";
import EditProcurements from "../pages/procurements/EditProcurements.jsx";
import DetailsProcurements from "../pages/procurements/DetailsProcurements.jsx";

import RemoteAccess from "../pages/remote-access/RemoteAccess.jsx";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />

                <Route path="/procurements" element={<ProcurementList />} />
                <Route path="/procurements/create" element={<CreateProcurements />} />
                <Route path="/procurements/edit/:id" element={<EditProcurements />} />
                <Route path="/procurements/:id" element={<DetailsProcurements />} />

                <Route path="/remote-access" element={<RemoteAccess />} />

                <Route path="*" element={<Navigate to="/procurements" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;