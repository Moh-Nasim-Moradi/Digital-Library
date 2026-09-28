import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import BookCard from '../components/BookCard'

function Books() {
  const [searchParams, setSearchParams] = useSearchParams()

  const initialSearch = searchParams.get('search') || ''

  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchBooks = async (search = '') => {
    try {
      setLoading(true)
      setError('')

      const url = search
        ? `http://localhost:5000/api/books?search=${encodeURIComponent(search)}`
        : 'http://localhost:5000/api/books'

      const response = await fetch(url)

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
    fetchBooks(initialSearch)
  }, [initialSearch])

  const handleSearch = (event) => {
    event.preventDefault()

    const trimmedSearch = searchTerm.trim()

    if (trimmedSearch) {
      setSearchParams({
        search: trimmedSearch,
      })
    } else {
      setSearchParams({})
    }
  }

  const handleClearSearch = () => {
    setSearchTerm('')
    setSearchParams({})
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          Digital Library
        </h1>

        <p className="mt-2 text-gray-600">
          Search and explore books in our digital collection.
        </p>
      </div>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="mt-8 flex flex-col gap-3 sm:flex-row"
      >

        <div className="relative flex-1">

          <input
            type="text"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Search by title, author, or translator..."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              ×
            </button>
          )}

        </div>

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          Search
        </button>

      </form>

      {/* Search Result Information */}
      {!loading && !error && (
        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-gray-600">
            {searchTerm.trim()
              ? `Search results for "${searchTerm}"`
              : 'All Books'}
          </p>

          <p className="text-sm text-gray-500">
            {books.length}{' '}
            {books.length === 1 ? 'book' : 'books'} found
          </p>

        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="py-20 text-center">
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

      {/* No Books */}
      {!loading && !error && books.length === 0 && (
        <div className="mt-10 rounded-xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">

          <div className="text-5xl">
            📚
          </div>

          <h2 className="mt-5 text-2xl font-semibold text-gray-900">
            No books found
          </h2>

          <p className="mt-2 text-gray-600">
            Try searching with a different title, author,
            or translator.
          </p>

          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
            >
              View All Books
            </button>
          )}

        </div>
      )}

      {/* Books Grid */}
      {!loading && !error && books.length > 0 && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {books.map((book) => (
            <BookCard
              key={book._id}
              id={book._id}
              title={book.title}
              author={book.author}
              cover={book.cover}
            />
          ))}

        </div>
      )}

    </div>
  )
}

export default Books