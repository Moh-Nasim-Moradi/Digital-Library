import { useState } from 'react'

function AddBook() {
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

    const [pdf, setPdf] = useState(null)
    const [cover, setCover] = useState(null)

    const handleChange = (event) => {
        const { name, value } = event.target

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }))
    }

    const handlePdfChange = (event) => {
        setPdf(event.target.files[0])
    }

    
    const handleCoverChange = (event) => {
        setCover(event.target.files[0])
    }


    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            const token = localStorage.getItem('token')

            if (!token) {
                alert('Please login as an admin')
                return
            }

            if (!pdf) {
                alert('Please select a PDF file')
                return
            }

            if (!cover) {
                alert('Please select a cover image')
                return
            }

            const bookResponse = await fetch(
                'http://localhost:5000/api/books',
                {
                    method: 'POST',
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

            const bookData = await bookResponse.json()

            if (!bookResponse.ok) {
                throw new Error(
                    bookData.message || 'Failed to create book'
                )
            }

            const bookId = bookData.book._id

            const pdfData = new FormData()

            pdfData.append('pdf', pdf)

            const pdfResponse = await fetch(
                `http://localhost:5000/api/books/${bookId}/pdf`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: pdfData,
                }
            )

            const pdfResult = await pdfResponse.json()

            if (!pdfResponse.ok) {
                throw new Error(
                    pdfResult.message || 'Failed to upload PDF'
                )
            }
            // Upload cover
            const coverData = new FormData()

            coverData.append('cover', cover)

            const coverResponse = await fetch(
                `http://localhost:5000/api/books/${bookId}/cover`,
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


            alert('Book added successfully')

            setFormData({
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

            setPdf(null)
        } catch (error) {
            console.error('Add book error:', error)

            alert(error.message)
        }
    }

    return (
        <div className="mx-auto max-w-4xl px-6 py-12">
            <h1 className="text-3xl font-bold text-gray-900">
                Add New Book
            </h1>

            <p className="mt-2 text-gray-600">
                Add a new book to the digital library.
            </p>

            <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
                {/* Title */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
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
                    <label className="mb-2 block text-sm font-medium text-gray-700">
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
                    <label className="mb-2 block text-sm font-medium text-gray-700">
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
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Category
                    </label>

                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                </div>

                {/* Language */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Language
                    </label>

                    <input
                        type="text"
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                </div>

                {/* Year */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Publication Year
                    </label>

                    <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                </div>

                {/* Pages */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Pages
                    </label>

                    <input
                        type="number"
                        name="pages"
                        value={formData.pages}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                </div>

                {/* Summary */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Summary
                    </label>

                    <textarea
                        name="summary"
                        value={formData.summary}
                        onChange={handleChange}
                        rows="6"
                        required
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

            
                {/* Cover Image */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Cover Image
                    </label>

                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleCoverChange}
                        required
                        className="block w-full rounded-lg border border-gray-300 px-4 py-3"
                    />

                    <p className="mt-2 text-sm text-gray-500">
                        JPG, PNG, or WEBP. Maximum size: 5 MB.
                    </p>
                </div>

                {/* PDF */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        PDF File
                    </label>

                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handlePdfChange}
                        required
                        className="block w-full rounded-lg border border-gray-300 px-4 py-3"
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
                >
                    Add Book
                </button>
            </form>
        </div>
    )
}
export default AddBook