import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProfile, updateProfileImage } from '../api/authApi'

function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await getProfile()

        setUser(data.user)

        // Keep localStorage user information updated
        localStorage.setItem(
          'user',
          JSON.stringify({
            id: data.user._id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            profileImage: data.user.profileImage || '',
          })
        )
      } catch (error) {
        console.error('Failed to load profile:', error)

        setError(
          error.response?.data?.message ||
            'Failed to load profile'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleImageChange = async (event) => {
    const file = event.target.files[0]

    if (!file) {
      return
    }

    // Check file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ]

    if (!allowedTypes.includes(file.type)) {
      setError(
        'Please select a JPG, PNG, or WEBP image.'
      )
      return
    }

    // Check file size
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5 MB.')
      return
    }

    try {
      setUploading(true)
      setError('')

      const data = await updateProfileImage(file)

      setUser(data.user)

      // Update localStorage
      localStorage.setItem(
        'user',
        JSON.stringify(data.user)
      )

      alert('Profile image updated successfully')
    } catch (error) {
      console.error(
        'Failed to update profile image:',
        error
      )

      setError(
        error.response?.data?.message ||
          'Failed to update profile image'
      )
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="text-gray-600">
          Loading profile...
        </p>
      </div>
    )
  }

  if (error && !user) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-red-600">
          {error}
        </h1>

        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">
          My Profile
        </h1>

        <p className="mt-2 text-gray-600">
          Manage your account information.
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

      {/* Profile Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">

        {/* Profile Image */}
        <div className="flex flex-col items-center">

          {user?.profileImage ? (
            <img
              src={`http://localhost:5000${user.profileImage}`}
              alt={user.name}
              className="h-32 w-32 rounded-full object-cover shadow-md"
            />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gray-200 text-4xl font-bold text-gray-500">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
          )}

          {/* Change Image */}
          <label
            htmlFor="profileImage"
            className="mt-5 cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
          >
            {uploading
              ? 'Uploading...'
              : 'Change Profile Photo'}
          </label>

          <input
            id="profileImage"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            disabled={uploading}
            className="hidden"
          />
        </div>

        {/* User Information */}
        <div className="mt-10 space-y-5">

          {/* Name */}
          <div className="rounded-lg bg-gray-50 p-5">
            <p className="text-sm text-gray-500">
              Full Name
            </p>

            <p className="mt-1 text-lg font-medium text-gray-900">
              {user?.name}
            </p>
          </div>

          {/* Email */}
          <div className="rounded-lg bg-gray-50 p-5">
            <p className="text-sm text-gray-500">
              Email Address
            </p>

            <p className="mt-1 text-lg font-medium text-gray-900">
              {user?.email}
            </p>
          </div>

          {/* Role */}
          <div className="rounded-lg bg-gray-50 p-5">
            <p className="text-sm text-gray-500">
              Account Type
            </p>

            <p className="mt-1 text-lg font-medium capitalize text-gray-900">
              {user?.role}
            </p>
          </div>

        </div>

        {/* Admin Dashboard */}
        {user?.role === 'admin' && (
          <div className="mt-8">
            <Link
              to="/admin/dashboard"
              className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Go to Admin Dashboard
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}

export default Profile
