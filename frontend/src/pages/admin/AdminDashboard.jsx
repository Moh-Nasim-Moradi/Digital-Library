import { Link } from 'react-router-dom'

function AdminDashboard() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          Admin Dashboard
        </h1>

        <p className="mt-3 text-gray-600">
          Manage your digital library from here.
        </p>
      </div>

      {/* DASHBOARD CARDS */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

        {/* ADD BOOK */}
        <Link
          to="/admin/books/add"
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-2xl">
            +
          </div>

          <h2 className="mt-5 text-xl font-semibold text-gray-900">
            Add New Book
          </h2>

          <p className="mt-2 text-gray-600">
            Add a new book, its information, and PDF file to the library.
          </p>

          <div className="mt-5 font-medium text-blue-600">
            Add Book →
          </div>
        </Link>

        {/* MANAGE BOOKS */}
        <Link
          to="/admin/books"
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-2xl">
            📚
          </div>

          <h2 className="mt-5 text-xl font-semibold text-gray-900">
            Manage Books
          </h2>

          <p className="mt-2 text-gray-600">
            Manage the books currently available in the digital library.
          </p>

          <div className="mt-5 font-medium text-blue-600">
            Manage Books →
          </div>
        </Link>

        {/* USER MANAGEMENT */}
        <Link
          to="/admin/users"
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-2xl">
            👥
          </div>

          <h2 className="mt-5 text-xl font-semibold text-gray-900">
            User Management
          </h2>

          <p className="mt-2 text-gray-600">
            Manage registered users and change their roles between user and admin.
          </p>

          <div className="mt-5 font-medium text-blue-600">
            Manage Users →
          </div>
        </Link>

      </div>
    </div>
  )
}

export default AdminDashboard