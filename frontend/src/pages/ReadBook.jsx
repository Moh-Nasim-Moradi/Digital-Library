
import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getBookById } from '../api/bookApi'

function ReadBook() {
  const { id } = useParams()

  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await getBookById(id)

        setBook(data.book)
      } catch (error) {
        console.error('Failed to load book:', error)

        setError('Failed to load book')
      } finally {
        setLoading(false)
      }
    }

    fetchBook()
  }, [id])

  if (loading) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-600">
          Loading book...
        </p>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Book Not Found
        </h1>

        <p className="mt-4 text-gray-600">
          {error || 'The requested book does not exist.'}
        </p>

        <Link
          to="/books"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          Browse Books
        </Link>
      </div>
    )
  }


  return (
    <div className="mx-auto max-w-7xl px-6 py-10">

      {/* Back */}
      <Link
        to={`/book/${book._id}`}
        className="text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        ← Back to Book
      </Link>

      {/* Reader Header */}
      <div className="mt-6 flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">

        {/* Book Info */}
        <div className="flex items-center gap-4">

          {/* Cover */}
          <div className="h-24 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {book.title}
            </h1>

            <p className="mt-1 text-gray-600">
              By {book.author}
            </p>
          </div>

        </div>

        {/* Download */}
        {book.pdfUrl && (
          <a
            href={`http://localhost:5000${book.pdfUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-lg bg-blue-600 px-5 py-3 text-center font-medium text-white transition hover:bg-blue-700"
          >
            Open PDF
          </a>
        )}

      </div>

      {/* PDF Reader */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-sm">

        {book.pdfUrl ? (
          <iframe
            src={`http://localhost:5000${book.pdfUrl}`}
            title={book.title}
            className="h-[800px] w-full"
          />
        ) : (
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="px-6 text-center">

              <div className="text-6xl">
                📖
              </div>

              <h2 className="mt-5 text-2xl font-semibold text-gray-900">
                PDF Not Available
              </h2>

              <p className="mx-auto mt-2 max-w-md text-gray-600">
                The PDF for this book is not available yet.
                Please check again later.
              </p>

              <Link
                to={`/book/${book._id}`}
                className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
              >
                Back to Book
              </Link>

            </div>
          </div>
        )}

      </div>

    </div>
  )

}

export default ReadBook