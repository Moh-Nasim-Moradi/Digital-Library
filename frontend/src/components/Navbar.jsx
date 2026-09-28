  
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold text-gray-900"
        >
          Digital Library
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6">

          {/* Home */}
          <Link
            to="/"
            className="text-gray-700 transition hover:text-blue-600"
          >
            Home
          </Link>

          {/* Books */}
          <Link
            to="/books"
            className="text-gray-700 transition hover:text-blue-600"
          >
            Books
          </Link>

          {!isAuthenticated ? (
            <>
              {/* Login */}
              <Link
                to="/login"
                className="text-gray-700 transition hover:text-blue-600"
              >
                Login
              </Link>

              {/* Register */}
              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {/* Admin Dashboard */}
              {user?.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  className="font-medium text-purple-600 transition hover:text-purple-700"
                >
                  Admin Dashboard
                </Link>
              )}

              {/* Profile */}
              <Link
                to="/profile"
                className="font-medium text-gray-700 transition hover:text-blue-600"
              >
                Profile
              </Link>

              {/* Welcome */}
              <span className="hidden text-sm text-gray-600 sm:block">
                Welcome, {user?.name}
              </span>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          )}

        </div>

      </div>
    </nav>
  )
}

export default Navbar