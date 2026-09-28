const express = require('express')
const fs = require('fs')
const path = require('path')
const Book = require('../models/Book')
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')
const upload = require('../middleware/uploadMiddleware')
const coverUpload = require('../middleware/coverUploadMiddleware')
const router = express.Router()

// Get all books
router.get('/', async (req, res) => {
  try {
    const { search } = req.query

    let query = {}

    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } },
          { translator: { $regex: search, $options: 'i' } },
        ],
      }
    }

    const books = await Book.find(query)

    res.json({
      success: true,
      count: books.length,
      books,
    })
  } catch (error) {
    console.error('Failed to get books:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to get books',
    })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      })
    }

    res.json({
      success: true,
      book,
    })
  } catch (error) {
    console.error('Failed to get book:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to get book',
    })
  }
})

// Create a book
router.post('/',
  authMiddleware,
  adminMiddleware, 
  async (req, res) => {
  try {
    const book = await Book.create(req.body)

    res.status(201).json({
      success: true,
      book,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

// Upload PDF for a book
router.post(
  '/:id/pdf',
  authMiddleware,
  adminMiddleware,
  upload.single('pdf'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'PDF file is required',
        })
      }

      const book = await Book.findById(req.params.id)

      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book not found',
        })
      }

      book.pdfUrl = `/uploads/books/${req.file.filename}`

      await book.save()

      res.json({
        success: true,
        message: 'PDF uploaded successfully',
        pdfUrl: book.pdfUrl,
        book,
      })
    } catch (error) {
      console.error('PDF upload error:', error)

      res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
)

// Delete a book and its PDF
router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const book = await Book.findById(req.params.id)

      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book not found',
        })
      }

      // Delete the PDF file if it exists
      if (book.pdfUrl) {
        const pdfPath = path.join(
          process.cwd(),
          book.pdfUrl.replace(/^\/+/, '')
        )

        if (fs.existsSync(pdfPath)) {
          fs.unlinkSync(pdfPath)
        }
      }

      // Delete the book from MongoDB
      await Book.findByIdAndDelete(req.params.id)

      res.json({
        success: true,
        message: 'Book and PDF deleted successfully',
      })
    } catch (error) {
      console.error('Failed to delete book:', error)

      res.status(500).json({
        success: false,
        message: 'Failed to delete book',
      })
    }
  }
)

// Update a book
router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const {
        title,
        author,
        translator,
        category,
        language,
        year,
        pages,
        summary,
        description
      } = req.body

      const book = await Book.findById(req.params.id)

      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book not found',
        })
      }

      book.title = title
      book.author = author
      book.translator = translator
      book.category = category
      book.language = language
      book.year = year
      book.pages = pages
      book.summary = summary
      book.description=description

      await book.save()

      res.json({
        success: true,
        message: 'Book updated successfully',
        book,
      })
    } catch (error) {
      console.error('Failed to update book:', error)

      res.status(500).json({
        success: false,
        message: 'Failed to update book',
      })
    }
  }
)

// Upload book cover
router.post(
  '/:id/cover',
  authMiddleware,
  adminMiddleware,
  coverUpload.single('cover'),
  async (req, res) => {
    try {
      const book = await Book.findById(req.params.id)

      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book not found',
        })
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Cover image is required',
        })
      }

      // Delete old cover if it exists
      if (book.cover) {
        const oldCoverPath = path.join(
          process.cwd(),
          book.cover.replace(/^\/+/, '')
        )

        if (fs.existsSync(oldCoverPath)) {
          fs.unlinkSync(oldCoverPath)
        }
      }

      // Save new cover path
      book.cover = `/uploads/covers/${req.file.filename}`

      await book.save()

      res.json({
        success: true,
        message: 'Book cover uploaded successfully',
        cover: book.cover,
        book,
      })
    } catch (error) {
      console.error('Failed to upload book cover:', error)

      // Delete newly uploaded file if database update fails
      if (req.file) {
        const uploadedPath = path.join(
          process.cwd(),
          'uploads/covers',
          req.file.filename
        )

        if (fs.existsSync(uploadedPath)) {
          fs.unlinkSync(uploadedPath)
        }
      }

      res.status(500).json({
        success: false,
        message: 'Failed to upload book cover',
      })
    }
  }
)



module.exports = router