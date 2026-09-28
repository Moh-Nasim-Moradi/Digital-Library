import axios from 'axios'

const API_URL = 'http://localhost:5000/api/auth'

// ==========================================
// REGISTER
// ==========================================
export const registerUser = async (formData) => {
  const response = await axios.post(
    `${API_URL}/register`,
    formData
  )

  return response.data
}

// ==========================================
// LOGIN
// ==========================================
export const loginUser = async (credentials) => {
  const response = await axios.post(
    `${API_URL}/login`,
    credentials
  )

  return response.data
}

// ==========================================
// GET PROFILE
// ==========================================
export const getProfile = async () => {
  const token = localStorage.getItem('token')

  const response = await axios.get(
    `${API_URL}/profile`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return response.data
}

// ==========================================
// UPDATE PROFILE IMAGE
// ==========================================
export const updateProfileImage = async (image) => {
  const token = localStorage.getItem('token')

  const formData = new FormData()

  formData.append('profileImage', image)

  const response = await axios.post(
    `${API_URL}/profile/image`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return response.data
}
