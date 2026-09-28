import { useEffect, useState } from 'react'

function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingUserId, setUpdatingUserId] = useState(null)

  const currentUser = JSON.parse(
    localStorage.getItem('user')
  )

  const token = localStorage.getItem('token')

  // GET ALL USERS
  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(
        'http://localhost:5000/api/auth/users',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to load users'
        )
      }

      setUsers(data.users)
    } catch (error) {
      console.error('Fetch users error:', error)

      setError(
        error.message || 'Failed to load users'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // CHANGE USER ROLE
  const handleRoleChange = async (
    userId,
    currentRole
  ) => {
    const newRole =
      currentRole === 'admin'
        ? 'user'
        : 'admin'

    const confirmed = window.confirm(
      `Are you sure you want to change this user's role from ${currentRole} to ${newRole}?`
    )

    if (!confirmed) {
      return
    }

    try {
      setUpdatingUserId(userId)
      setError('')

      const response = await fetch(
        `http://localhost:5000/api/auth/users/${userId}/role`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            role: newRole,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to change user role'
        )
      }

      // Update the user in the table
      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user._id === userId
            ? data.user
            : user
        )
      )
    } catch (error) {
      console.error(
        'Change role error:',
        error
      )

      setError(
        error.message ||
          'Failed to change user role'
      )
    } finally {
      setUpdatingUserId(null)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          User Management
        </h1>

        <p className="mt-3 text-gray-600">
          Manage registered users and change their roles.
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="mt-10 text-center text-gray-600">
          Loading users...
        </div>
      ) : users.length === 0 ? (
        <div className="mt-10 rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-600">
          No users found.
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Name
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Email
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Role
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {users.map((user) => {
                  const isCurrentUser =
                    currentUser?.id === user._id

                  const isUpdating =
                    updatingUserId === user._id

                  return (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50"
                    >
                      {/* NAME */}
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {user.name}
                        </div>

                        {isCurrentUser && (
                          <div className="mt-1 text-xs text-blue-600">
                            You
                          </div>
                        )}
                      </td>

                      {/* EMAIL */}
                      <td className="px-6 py-4 text-gray-600">
                        {user.email}
                      </td>

                      {/* ROLE */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      {/* ACTION */}
                      <td className="px-6 py-4">
                        {isCurrentUser ? (
                          <span className="text-sm text-gray-400">
                            Cannot change own role
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              handleRoleChange(
                                user._id,
                                user.role
                              )
                            }
                            disabled={isUpdating}
                            className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition ${
                              user.role === 'admin'
                                ? 'bg-orange-600 hover:bg-orange-700'
                                : 'bg-blue-600 hover:bg-blue-700'
                            } ${
                              isUpdating
                                ? 'cursor-not-allowed opacity-50'
                                : ''
                            }`}
                          >
                            {isUpdating
                              ? 'Updating...'
                              : user.role === 'admin'
                              ? 'Make User'
                              : 'Make Admin'}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement