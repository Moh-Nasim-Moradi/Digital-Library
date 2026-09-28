import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import BookCard from '../components/BookCard'

function Home() {
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState('')
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          'http://localhost:5000/api/books'
        )

        const data = await response.json()

        if (response.ok) {
          setBooks(data.books || [])
        }
      } catch (error) {
        console.error('Failed to load books:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  const handleSearch = (event) => {
    event.preventDefault()

    const search = searchTerm.trim()

    if (!search) {
      navigate('/books')
      return
    }

    navigate(
      `/books?search=${encodeURIComponent(search)}`
    )
  }

  // Get unique categories
  const categories = [
    ...new Set(
      books
        .map((book) => book.category)
        .filter(Boolean)
    ),
  ]

  // Show latest 8 books
  const recentBooks = books.slice(-8).reverse()

  return (
    <div>

      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white">

        <div className="mx-auto max-w-7xl px-6 py-24">

          <div className="mx-auto max-w-3xl text-center">

            <p className="text-sm font-semibold uppercase tracking-wider text-blue-200">
              Digital Library
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Discover Your Next Great Book
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-100">
              Explore our growing collection of digital books,
              discover new authors, and read books online.
            </p>

            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row"
            >

              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search by title, author, or translator..."
                className="flex-1 rounded-lg border-0 bg-white px-5 py-4 text-gray-900 outline-none placeholder:text-gray-400 focus:ring-4 focus:ring-blue-300"
              />

              <button
                type="submit"
                className="rounded-lg bg-gray-900 px-7 py-4 font-medium text-white transition hover:bg-gray-800"
              >
                Search
              </button>

            </form>

          </div>

        </div>

      </section>


      {/* ================= CATEGORIES ================= */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-12">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Browse by Category
              </h2>

              <p className="mt-1 text-gray-600">
                Explore books by subject.
              </p>
            </div>

            <Link
              to="/books"
              className="hidden font-medium text-blue-600 hover:text-blue-700 sm:block"
            >
              View All →
            </Link>

          </div>

          <div className="mt-6 flex flex-wrap gap-3">

            {categories.map((category) => (
              <button
                key={category}
                onClick={() =>
                  navigate(
                    `/books?search=${encodeURIComponent(category)}`
                  )
                }
                className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              >
                {category}
              </button>
            ))}

          </div>

        </section>
      )}


      {/* ================= RECENT BOOKS ================= */}
      <section className="bg-gray-50">

        <div className="mx-auto max-w-7xl px-6 py-16">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Recently Added Books
              </h2>

              <p className="mt-2 text-gray-600">
                Discover the latest additions to our library.
              </p>
            </div>

            <Link
              to="/books"
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              Browse All Books →
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


          {/* No books */}
          {!loading && recentBooks.length === 0 && (
            <div className="mt-8 rounded-xl border border-gray-200 bg-white p-12 text-center">

              <div className="text-5xl">
                📚
              </div>

              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                No books available yet
              </h3>

              <p className="mt-2 text-gray-600">
                Books will appear here once they are added
                to the library.
              </p>

            </div>
          )}


          {/* Books */}
          {!loading && recentBooks.length > 0 && (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {recentBooks.map((book) => (
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

      </section>


      {/* ================= CTA ================= */}
      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="overflow-hidden rounded-2xl bg-gray-900 px-6 py-14 text-center sm:px-12">

          <h2 className="text-3xl font-bold text-white">
            Explore the Complete Library
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-300">
            Find books by title, author, translator, or category
            and discover something new to read.
          </p>

          <Link
            to="/books"
            className="mt-8 inline-block rounded-lg bg-white px-7 py-3 font-semibold text-gray-900 transition hover:bg-gray-100"
          >
            Browse All Books
          </Link>

        </div>

      </section>

    </div>
  )
}

export default Home