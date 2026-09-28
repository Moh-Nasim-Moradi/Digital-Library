
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getBookById } from '../api/bookApi'

function BookDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

const handleDownload = () => {
  if (!isAuthenticated) {
    navigate('/login')
    return
  }

  if (!book?.pdfUrl) {
    alert('PDF is not available for this book.')
    return
  }

  const pdfUrl = `http://localhost:5000${book.pdfUrl}`

  window.open(pdfUrl, '_blank')
}

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
        console.error('Failed to fetch book:', error)

        if (error.response && error.response.status === 404) {
          setError('Book Not Found')
        } else {
          setError('Failed to load book')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchBook()
  }, [id])

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <p className="text-gray-600">
          Loading book...
        </p>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {error || 'Book Not Found'}
        </h1>

        <p className="mt-4 text-gray-600">
          The book you are looking for does not exist.
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
    
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">



      {/* Back Button */}
      <Link
        to="/books"
        className="text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        ← Back to Books
      </Link>

      {/* Book Information */}
      
      <div className="mt-8 grid gap-10 lg:grid-cols-[280px_1fr]">

        {/* Cover */}
        <div className="flex h-[420px] overflow-hidden items-center justify-center rounded-xl bg-gray-200 shadow-md">
          {book.cover ? (
            <img src={`http://localhost:5000${book.cover}`} alt={book.title} className="h-full w-full rounded-xl object-contain" />
          ) : (
            <span className="text-gray-500">
              Book Cover
            </span>
          )}
        </div>

        {/* Details */}
        <div>

          <h1 className="text-4xl font-bold text-gray-900">
            {book.title}
          </h1>

          <p className="mt-3 text-lg text-gray-600">
            By {book.author}
          </p>

          
        
          {/* Book Metadata */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">

            {/* Translator */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Translator
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {book.translator || 'Not available'}
              </p>
            </div>

            {/* Category */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Category
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {book.category || 'Not available'}
              </p>
            </div>

            {/* Language */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Language
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {book.language || 'Not available'}
              </p>
            </div>

            {/* Publication Year */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Publication Year
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {book.year || 'Not available'}
              </p>
            </div>

            {/* Pages */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Pages
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {book.pages || 'Not available'}
              </p>
            </div>

          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">

            {book.pdfUrl ? (
              <>
                <button
                  onClick={() => navigate(`/book/${book._id}/read`)}
                  className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
                >
                  📖 Read Preview
                </button>

                <button
                  onClick={handleDownload}
                  className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  ↓ Download PDF
                </button>
              </>
            ) : (
              <div className="rounded-lg bg-gray-100 px-6 py-3 text-gray-500">
                PDF is not available for this book.
              </div>
            )}

          </div>


        </div>
      </div>


     
      {/* Book Content */}
      <div className="mt-16 max-w-4xl space-y-10">

        {/* Summary */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900">
            Summary
          </h2>

          <p className="mt-4 leading-8 text-gray-600">
            {book.summary || 'No summary available for this book.'}
          </p>
        </section>

        {/* Description */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900">
            Description
          </h2>

          <p className="mt-4 leading-8 text-gray-600">
            {book.description || 'No description available for this book.'}
          </p>
        </section>

      </div>
      {/* Bottom Navigation */}
      <div className="mt-12 border-t border-gray-200 pt-8">

        <Link
          to="/books"
          className="inline-flex items-center rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
        >
          ← Back to Books
        </Link>

      </div>


    </div>


  )
}

export default BookDetails