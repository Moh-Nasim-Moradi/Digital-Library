import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../api/authApi'
import { useAuth } from '../context/AuthContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')

    try {
      setLoading(true)

      const data = await loginUser({
        email,
        password,
      })

      console.log('Login successful:', data)

      login(data.user, data.token)

      navigate('/')
    } catch (error) {
      console.error('Login failed:', error)

      if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else {
        setError('Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-160px)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome Back
          </h1>

          <p className="mt-3 text-gray-600">
            Login to access your digital library.
          </p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
        >

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
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
              placeholder="Enter your password"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-7 w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

        </form>

      </div>
    </div>
  )
}

export default Login