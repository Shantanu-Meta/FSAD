import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';

import Login from './pages/Login';
import Forbidden from './pages/Forbidden';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import CourseManagement from './pages/CourseManagement';
import FeeStructure from './pages/FeeStructure';
import NewApplication from './pages/NewApplication';
import ApplicationList from './pages/ApplicationList';
import ApplicationDetail from './pages/ApplicationDetail';
import Admissions from './pages/Admissions';
import AdmissionDetail from './pages/AdmissionDetail';
import FeeCollection from './pages/FeeCollection';
import InvoicePrint from './pages/InvoicePrint';
import Reports from './pages/Reports';
import ChangePassword from './pages/ChangePassword';

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/403" element={<Forbidden />} />

      {/* Authenticated area with shared layout */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* Both roles */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/admissions/:id" element={<AdmissionDetail />} />
        <Route path="/change-password" element={<ChangePassword />} />

        {/* Admin only */}
        <Route path="/users" element={<ProtectedRoute roles={['ADMIN']}><UserManagement /></ProtectedRoute>} />
        <Route path="/courses" element={<ProtectedRoute roles={['ADMIN']}><CourseManagement /></ProtectedRoute>} />
        <Route path="/fees" element={<ProtectedRoute roles={['ADMIN']}><FeeStructure /></ProtectedRoute>} />
        <Route path="/applications" element={<ProtectedRoute roles={['ADMIN']}><ApplicationList /></ProtectedRoute>} />
        <Route path="/applications/:id" element={<ProtectedRoute roles={['ADMIN']}><ApplicationDetail /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute roles={['ADMIN']}><Reports /></ProtectedRoute>} />

        {/* Clerk only */}
        <Route path="/applications/new" element={<ProtectedRoute roles={['CLERK']}><NewApplication /></ProtectedRoute>} />
        <Route path="/fee-collection" element={<ProtectedRoute roles={['CLERK']}><FeeCollection /></ProtectedRoute>} />
        <Route path="/invoice/:id" element={<InvoicePrint />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
