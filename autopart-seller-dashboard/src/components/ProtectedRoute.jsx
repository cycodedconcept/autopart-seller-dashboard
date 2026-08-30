import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function ProtectedRoute() {
  const { token, sellerProfile, loading } = useSelector(state => state.auth)
  const location = useLocation()

  if (!token) return <Navigate to="/login" replace />

  // DEV ONLY — bypass the verification gate so you can test the app before the
  // backend approves the account. Stripped from production builds (DEV is false there).
  if (import.meta.env.DEV) return <Outlet />

  if (loading && !sellerProfile) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>
  }

  if (!sellerProfile) {
    return <Outlet />
  }

  const status = sellerProfile?.verificationStatus
  const isPendingRoute = location.pathname === '/pending-verification'

  if (status === 'approved' || status === 'verified') {
    if (isPendingRoute) return <Navigate to="/dashboard" replace />
    return <Outlet />
  }

  if (status === 'pending' || status === 'rejected') {
    if (!isPendingRoute) return <Navigate to="/pending-verification" replace />
    return <Outlet />
  }

  return <Outlet />
}
