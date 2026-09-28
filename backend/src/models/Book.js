const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      required: true,
      trim: true,
    },

    translator: {
      type: String,
      default: '',
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    language: {
      type: String,
      required: true,
      trim: true,
    },

    year: {
      type: Number,
    },

    pages: {
      type: Number,
    },

    summary: {
      type: String,
      default: '',
    },

    description: {
      type: String,
      default: '',
    },

    cover: {
      type: String,
      default: null,
    },

    pdf: {
      type: String,
      default: null,
    },
    pdfUrl: String,
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Book', bookSchema)