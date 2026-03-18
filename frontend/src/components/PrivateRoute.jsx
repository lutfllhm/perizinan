import React from 'react';
import { Navigate } from 'react-router-dom';

function decodeJwtPayload(token) {
  try {
    const part = token.split('.')[1];
    if (!part) return null;
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const userRoleRaw = localStorage.getItem('role') || sessionStorage.getItem('role');
  const userRole = (userRoleRaw || '').trim().toLowerCase();
  const requiredRoles = Array.isArray(role)
    ? role.map((r) => String(r).trim().toLowerCase()).filter(Boolean)
    : [(role || '').trim().toLowerCase()].filter(Boolean);

  if (!token) {
    return <Navigate to="/login" />;
  }

  // If role is missing in localStorage, try to infer it from JWT payload
  const payload = userRole ? null : decodeJwtPayload(token);
  const inferredRole = (payload?.role || '').trim().toLowerCase();

  // If role is missing, default to 'hrd' (keeps app usable with legacy/dirty DB rows)
  const normalizedUserRole = userRole || inferredRole || 'hrd';

  if (requiredRoles.length > 0 && !requiredRoles.includes(normalizedUserRole)) {
    // If user is logged in but tries to open the wrong dashboard,
    // redirect them to the correct one instead of bouncing to home.
    if (normalizedUserRole === 'superadmin') return <Navigate to="/admin" replace />;
    if (normalizedUserRole === 'admin') return <Navigate to="/admin" replace />;
    if (normalizedUserRole === 'hrd') return <Navigate to="/hrd" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
