import { useState } from 'react'
import { registerUser } from '../api/authApi'


function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [profileImage, setProfileImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')


  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      setLoading(true)

     
      const formData = new FormData()

      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)

      if (profileImage) {
        formData.append('profileImage', profileImage)
      }

      const data = await registerUser(formData)

      console.log('Registration successful:', data)

      setSuccess('Account created successfully!')

      setName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setProfileImage(null)
    } catch (error) {
      console.error('Registration failed:', error)

      if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }
const handleProfileImageChange = (event) => {
  setProfileImage(event.target.files[0])
}

  return (
    <div className="flex min-h-[calc(100vh-160px)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Create an Account
          </h1>

          <p className="mt-3 text-gray-600">
            Join our digital library and discover new books.
          </p>
        </div>

        {/* Register Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
        >

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your name"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>

          {/* Email */}
          <div className="mt-5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>

          {/* Password */}
          <div className="mt-5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Create a password"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="mt-5">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              placeholder="Confirm your password"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
        
          {/* Profile Photo */}
          <div className="mt-5">
            <label
              htmlFor="profileImage"
              className="block text-sm font-medium text-gray-700"
            >
              Profile Photo
            </label>

            <input
              id="profileImage"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleProfileImageChange}
              className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3"
            />

            <p className="mt-2 text-sm text-gray-500">
              JPG, PNG, or WEBP. Maximum size: 5 MB.
            </p>
          </div>

          {/* Submit */}
        
          <button
            type="submit"
            disabled={loading}
            className="mt-7 w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>


        </form>

      </div>
    </div>
  )
}

export default Register