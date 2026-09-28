import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function AdminRoute({ children }) {
  const { user, isAuthenticated } = useAuth()

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Logged in but not admin
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute