const dotenv = require('dotenv')
const mongoose = require('mongoose')
const Book = require('../models/Book')

dotenv.config()

const books = [
  {
    title: 'The Great Book',
    author: 'Author One',
    translator: 'Translator One',
    category: 'Literature',
    language: 'English',
    year: 2020,
    pages: 250,
    summary:
      'This is a sample summary of the first book. Later this information will come from our database.',
    description:
      'A sample literature book for our Digital Library.',
    cover: null,
    pdf: null,
  },

  {
    title: 'History of Afghanistan',
    author: 'Author Two',
    translator: 'Translator Two',
    category: 'History',
    language: 'Dari',
    year: 2022,
    pages: 340,
    summary:
      'This is a sample summary of a book about the history of Afghanistan.',
    description:
      'A sample book about the history and development of Afghanistan.',
    cover: null,
    pdf: null,
  },

  {
    title: 'Introduction to Psychology',
    author: 'Author Three',
    translator: 'Translator Three',
    category: 'Psychology',
    language: 'Dari',
    year: 2021,
    pages: 280,
    summary:
      'This book introduces important concepts and ideas in psychology.',
    description:
      'An introductory psychology book covering important psychological concepts.',
    cover: null,
    pdf: null,
  },

  {
    title: 'Modern Science in Afghanistan',
    author: 'Author Four',
    translator: 'Translator Four',
    category: 'Science',
    language: 'English',
    year: 2023,
    pages: 310,
    summary:
      'A sample book covering several important topics in modern science.',
    description:
      'A sample science book covering several important topics in modern science.',
    cover: null,
    pdf: null,
  },
]

const seedBooks = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    console.log('MongoDB connected')

    await Book.deleteMany()

    console.log('Existing books deleted')

    await Book.insertMany(books)

    console.log(`${books.length} books imported successfully`)

    await mongoose.connection.close()

    console.log('MongoDB connection closed')

    process.exit(0)
  } catch (error) {
    console.error('Import failed:', error.message)

    await mongoose.connection.close()

    process.exit(1)
  }
}

seedBooks()