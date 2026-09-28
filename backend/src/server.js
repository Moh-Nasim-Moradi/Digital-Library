
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

const bookRoutes = require('./routes/BookRoutes')
const authRoutes = require('./routes/authRoutes')
const connectDB = require('./config/db')
const authMiddleware = require('./middleware/authMiddleware')
const adminMiddleware = require('./middleware/adminMiddleware')


dotenv.config()

connectDB()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))

// Routes
app.use('/api/books', bookRoutes)
app.use('/api/auth', authRoutes)

// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'Digital Book API is running',
  })
})

app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API connection is working',
  })
})

app.get('/api/test/protected', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Protected route is working',
    user: req.user,
  })
})
app.get(
  '/api/test/admin',
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    res.json({
      success: true,
      message: 'Admin route is working',
      user: req.user,
    })
  }
)

// Server
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
