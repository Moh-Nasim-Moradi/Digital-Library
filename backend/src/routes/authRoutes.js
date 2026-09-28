
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')

const User = require('../models/User')
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')
const profileUpload = require('../middleware/profileUploadMiddleware')

const router = express.Router()


// ======================================================
// REGISTER
// ======================================================

router.post('/register', profileUpload.single('profileImage'), async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
    } = req.body || {}

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    )

    // Only allow valid roles
    const userRole =
      role === 'admin' ? 'admin' : 'user'

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: userRole,
      profileImage: req.file
        ? `/uploads/profiles/${req.file.filename}`
        : '',
    })

    // Create JWT
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    )

    res.status(201).json({
      success: true,
      message: 'User registered successfully',

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage || '',
      },
    })
  } catch (error) {
    console.error(
      'Registration error:',
      error
    )

    res.status(500).json({
      success: false,
      message: 'Registration failed',
    })
  }
})


// ======================================================
// LOGIN
// ======================================================

router.post('/login', async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body

    // Validate fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      })
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase(),
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    // Check password
    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      )

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    // Create JWT
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    )

    res.json({
      success: true,
      message: 'Login successful',

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage || '',
      },
    })
  } catch (error) {
    console.error(
      'Login error:',
      error
    )

    res.status(500).json({
      success: false,
      message: 'Login failed',
    })
  }
})


// ======================================================
// GET CURRENT USER PROFILE
// ======================================================

router.get(
  '/profile',
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findById(
        req.user.userId
      ).select('-password')

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        })
      }

      res.json({
        success: true,
        user,
      })
    } catch (error) {
      console.error(
        'Get profile error:',
        error
      )

      res.status(500).json({
        success: false,
        message: 'Failed to load profile',
      })
    }
  }
)


// ======================================================
// UPLOAD / CHANGE PROFILE IMAGE
// ======================================================

router.post(
  '/profile/image',
  authMiddleware,
  profileUpload.single('profileImage'),

  async (req, res) => {
    try {

      // Check uploaded file
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Profile image is required',
        })
      }


      // Find current user
      const user = await User.findById(
        req.user.userId
      )


      if (!user) {

        // Delete newly uploaded image
        const newImagePath = path.join(
          process.cwd(),
          'uploads',
          'profiles',
          req.file.filename
        )

        if (fs.existsSync(newImagePath)) {
          fs.unlinkSync(newImagePath)
        }

        return res.status(404).json({
          success: false,
          message: 'User not found',
        })
      }


      // ==================================================
      // DELETE OLD PROFILE IMAGE
      // ==================================================

      if (user.profileImage) {

        const oldImagePath = path.join(
          process.cwd(),
          user.profileImage.replace(
            /^[/\\]+/,
            ''
          )
        )

        console.log(
          'Old profile image:',
          oldImagePath
        )

        if (fs.existsSync(oldImagePath)) {

          fs.unlinkSync(oldImagePath)

          console.log(
            'Old profile image deleted'
          )
        }
      }


      // ==================================================
      // SAVE NEW PROFILE IMAGE
      // ==================================================

      user.profileImage =
        `/uploads/profiles/${req.file.filename}`

      await user.save()


      // ==================================================
      // RESPONSE
      // ==================================================

      res.json({
        success: true,
        message:
          'Profile image updated successfully',

        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage:
            user.profileImage,
        },
      })

    } catch (error) {

      console.error(
        'Profile image update error:',
        error
      )


      // ==================================================
      // DELETE NEW IMAGE IF DATABASE UPDATE FAILS
      // ==================================================

      if (req.file) {

        const uploadedImagePath =
          path.join(
            process.cwd(),
            'uploads',
            'profiles',
            req.file.filename
          )

        if (
          fs.existsSync(
            uploadedImagePath
          )
        ) {
          fs.unlinkSync(
            uploadedImagePath
          )
        }
      }


      res.status(500).json({
        success: false,
        message:
          'Failed to update profile image',
      })
    }
  }
)

// GET ALL USERS - ADMIN ONLY
router.get(
  '/users',
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const users = await User.find()
        .select('-password')
        .sort({ createdAt: -1 })

      res.json({
        success: true,
        users,
      })
    } catch (error) {
      console.error(
        'Get users error:',
        error
      )

      res.status(500).json({
        success: false,
        message: 'Failed to load users',
      })
    }
  }
)

// CHANGE USER ROLE - ADMIN ONLY
router.put(
  '/users/:id/role',
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { role } = req.body
      const userId = req.params.id

      // Validate role
      if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Role must be either user or admin',
        })
      }

      // Prevent admin from changing their own role
      if (userId === req.user.userId.toString()) {
        return res.status(400).json({
          success: false,
          message: 'You cannot change your own role',
        })
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { role },
        {
          new: true,
          runValidators: true,
        }
      ).select('-password')

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        })
      }

      res.json({
        success: true,
        message: `User role changed to ${role}`,
        user,
      })
    } catch (error) {
      console.error(
        'Change user role error:',
        error
      )

      res.status(500).json({
        success: false,
        message: 'Failed to change user role',
      })
    }
  }
)

module.exports = router
