import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Books from './pages/Books'
import Login from './pages/Login'
import Register from './pages/Register'
import BookDetails from './pages/BookDetails'
import ReadBook from './pages/ReadBook'
import Profile from './pages/Profile'
import UserManagement from './pages/UserManagement'

import AddBook from './pages/admin/AddBook'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageBooks from './pages/admin/ManageBooks'
import EditBook from './pages/admin/EditBook'

import MainLayout from './layouts/MainLayout'

import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<MainLayout />}>

          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/book/:id" element={<BookDetails />} />

          {/* Protected User Routes */}
          <Route
            path="/book/:id/read"
            element={
              <ProtectedRoute>
                <ReadBook />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/books"
            element={
              <AdminRoute>
                <ManageBooks />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/books/add"
            element={
              <AdminRoute>
                <AddBook />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/books/edit/:id"
            element={
              <AdminRoute>
                <EditBook />
              </AdminRoute>
            }
          />
          
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            }
          />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App