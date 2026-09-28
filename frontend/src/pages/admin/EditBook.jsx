import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

function EditBook() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    translator: '',
    category: '',
    language: '',
    year: '',
    pages: '',
    summary: '',
    description: '',
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [cover, setCover] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          `http://localhost:5000/api/books/${id}`
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.message || 'Failed to load book'
          )
        }

        const book = data.book

        setFormData({
          title: book.title || '',
          author: book.author || '',
          translator: book.translator || '',
          category: book.category || '',
          language: book.language || '',
          year: book.year || '',
          pages: book.pages || '',
          summary: book.summary || '',
          description: data.book.description || '',
        })
      } catch (error) {
        console.error('Failed to load book:', error)

        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBook()
  }, [id])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }))
  }
const handleCoverChange = (event) => {
  setCover(event.target.files[0])
}
  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setSaving(true)
      setError('')

      const token = localStorage.getItem('token')

      if (!token) {
        throw new Error('Please login as an admin')
      }

      const response = await fetch(
        `http://localhost:5000/api/books/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            year: Number(formData.year),
            pages: Number(formData.pages),
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to update book'
        )
      }


      // Upload new cover if one was selected
      if (cover) {
        const coverData = new FormData()

        coverData.append('cover', cover)

        const coverResponse = await fetch(
          `http://localhost:5000/api/books/${id}/cover`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: coverData,
          }
        )

        const coverResult = await coverResponse.json()

        if (!coverResponse.ok) {
          throw new Error(
            coverResult.message || 'Failed to upload cover'
          )
        }
      }

      alert('Book updated successfully')

      navigate('/admin/books')

    } catch (error) {
      console.error('Update book error:', error)

      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-600">
          Loading book...
        </p>
      </div>
    )
  }

  if (error && !formData.title) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-red-600">
          {error}
        </h1>

        <Link
          to="/admin/books"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          Back to Manage Books
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">

      {/* Header */}
      <div className="mb-8">
        <Link
          to="/admin/books"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Manage Books
        </Link>

        <h1 className="mt-5 text-4xl font-bold text-gray-900">
          Edit Book
        </h1>

        <p className="mt-2 text-gray-600">
          Update the information for this book.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-700">
            {error}
          </p>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >

        {/* Title */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Title
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Author */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Author
          </label>

          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Translator */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Translator
          </label>

          <input
            type="text"
            name="translator"
            value={formData.translator}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Category */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Category
          </label>

          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Language */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Language
          </label>

          <input
            type="text"
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Year and Pages */}
        <div className="grid gap-6 sm:grid-cols-2">

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Publication Year
            </label>

            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Pages
            </label>

            <input
              type="number"
              name="pages"
              value={formData.pages}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

        </div>
        
        {/* Cover Image */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Change Cover Image
          </label>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleCoverChange}
            className="block w-full rounded-lg border border-gray-300 px-4 py-3"
          />

          <p className="mt-2 text-sm text-gray-500">
            Leave empty to keep the current cover.
          </p>
        </div>


        {/* Summary */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Summary
          </label>

          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            rows="6"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
        
        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="6"
            placeholder="Enter a detailed description of the book..."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 pt-4">

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

          <Link
            to="/admin/books"
            className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </Link>

        </div>

      </form>
    </div>
  )
}

export default EditBook
