import { Link } from 'react-router-dom'

function BookCard({ id, title, author, cover }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      
      {/* Book Cover */}
      <div className="flex h-64 items-center justify-center bg-gray-200">
        {cover ? (
          <img
            src={`http://localhost:5000${cover}`}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-gray-500">
            Book Cover
          </span>
        )}
      </div>

      {/* Book Information */}
      <div className="p-4">
        <h3 className="truncate text-lg font-semibold text-gray-900">
          {title}
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          {author}
        </p>

        <Link
          to={`/book/${id}`}
          className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View Book →
        </Link>
      </div>

    </div>
  )
}

export default BookCard