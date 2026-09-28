import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function ManageBooks() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchBooks = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(
        'http://localhost:5000/api/books'
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to load books'
        )
      }

      setBooks(data.books || [])
    } catch (error) {
      console.error('Failed to load books:', error)

      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const handleDelete = async (bookId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this book?'
    )

    if (!confirmed) {
      return
    }

    try {
      const token = localStorage.getItem('token')

      if (!token) {
        alert('Please login as an admin')
        return
      }

      const response = await fetch(
        `http://localhost:5000/api/books/${bookId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to delete book'
        )
      }

      setBooks((previousBooks) =>
        previousBooks.filter(
          (book) => book._id !== bookId
        )
      )

      alert('Book deleted successfully')
    } catch (error) {
      console.error('Delete book error:', error)

      alert(error.message)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Manage Books
          </h1>

          <p className="mt-2 text-gray-600">
            View and manage books in your digital library.
          </p>
        </div>

        <Link
          to="/admin/books/add"
          className="inline-block rounded-lg bg-blue-600 px-5 py-3 text-center font-medium text-white transition hover:bg-blue-700"
        >
          + Add New Book
        </Link>

      </div>

      {/* Loading */}
      {loading && (
        <div className="py-16 text-center">
          <p className="text-gray-600">
            Loading books...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="font-medium text-red-700">
            {error}
          </p>
        </div>
      )}

      {/* Books */}
      {!loading && !error && (
        <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

          {books.length === 0 ? (
            <div className="p-12 text-center">

              <div className="text-5xl">
                📚
              </div>

              <p className="mt-4 text-gray-600">
                No books found.
              </p>

              <Link
                to="/admin/books/add"
                className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
              >
                Add Your First Book
              </Link>

            </div>
          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1100px] text-left">

                <thead className="border-b bg-gray-50">

                  <tr>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Book
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Author
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Category
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      PDF
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Description
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-200">

                  {books.map((book) => (

                    <tr
                      key={book._id}
                      className="transition hover:bg-gray-50"
                    >

                      {/* Book */}
                      <td className="px-6 py-4">

                        <div className="flex items-center gap-4">

                          {/* Cover */}
                          <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded-md bg-gray-200">

                            {book.cover ? (

                              <img
                                src={`http://localhost:5000${book.cover}`}
                                alt={book.title}
                                className="h-full w-full object-cover"
                              />

                            ) : (

                              <div className="flex h-full items-center justify-center text-xs text-gray-500">
                                No Cover
                              </div>

                            )}

                          </div>

                          {/* Title */}
                          <div className="min-w-0">

                            <p className="max-w-[220px] truncate font-medium text-gray-900">
                              {book.title}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              {book.language || 'Language not specified'}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Author */}
                      <td className="px-6 py-4 text-gray-600">
                        {book.author}
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 text-gray-600">
                        {book.category || '-'}
                      </td>

                      {/* PDF */}
                      <td className="px-6 py-4">

                        {book.pdfUrl ? (

                          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                            Available
                          </span>

                        ) : (

                          <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                            Not Available
                          </span>

                        )}

                      </td>

                      {/* Description */}
                      <td className="px-6 py-4">

                        {book.description ? (

                          <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                            Added
                          </span>

                        ) : (

                          <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                            Not Added
                          </span>

                        )}

                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">

                        <div className="flex items-center gap-4">

                          {/* View */}
                          <Link
                            to={`/book/${book._id}`}
                            className="font-medium text-blue-600 hover:text-blue-700"
                          >
                            View
                          </Link>

                          {/* Edit */}
                          <Link
                            to={`/admin/books/edit/${book._id}`}
                            className="font-medium text-green-600 hover:text-green-700"
                          >
                            Edit
                          </Link>

                          {/* Delete */}
                          <button
                            onClick={() =>
                              handleDelete(book._id)
                            }
                            className="font-medium text-red-600 hover:text-red-700"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>
      )}

    </div>
  )
}

export default ManageBooks