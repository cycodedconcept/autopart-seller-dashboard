import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../utils/axios'

const toErrorString = (err) => {
  if (typeof err === 'string') return err
  if (err?.message) return err.message
  if (err?.response?.data?.message) return err.response.data.message
  try { return JSON.stringify(err) } catch { return 'Something went wrong' }
}

// API wraps every response: { success: true, data: {...} } / { success: false, error: {...} }.
// The axios interceptor already returns response.data (the body), so `res` is the body.
// Normalize to the inner `data` object whether the API returns it wrapped or flat.
const unwrap = (res) => (res && res.data !== undefined ? res.data : res)

export const sellerLogin = createAsyncThunk('auth/sellerLogin', async (credentials, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    })
    const data = unwrap(res)
    localStorage.setItem('token', data.token)
    return data
  } catch (err) {
    return rejectWithValue(toErrorString(err))
  }
})

export const sellerRegister = createAsyncThunk('auth/sellerRegister', async (formData, { rejectWithValue }) => {
  try {
    // Ensure phone numbers are properly formatted
    const formatPhone = (phone) => {
      if (!phone) return phone
      // Remove any non-digit characters
      const digits = phone.replace(/\D/g, '')
      // If it starts with 234 (Nigeria country code), keep it; otherwise prepend 234
      if (digits.startsWith('234')) return '+' + digits
      if (digits.startsWith('0')) return '+234' + digits.slice(1)
      return '+234' + digits
    }
    
    const res = await api.post('/seller/register', {
      fullName: formData.fullName,
      email: formData.email,
      phone: formatPhone(formData.phone),
      password: formData.password,
      businessName: formData.businessName,
      contactEmail: formData.contactEmail,
      contactPhone: formatPhone(formData.contactPhone),
      address: formData.address,
      cacNumber: formData.cacNumber,
    })
    const data = unwrap(res)
    localStorage.setItem('token', data.token)
    return data
  } catch (err) {
    return rejectWithValue(toErrorString(err))
  }
})

export const getSellerProfile = createAsyncThunk('auth/getSellerProfile', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/seller/me')
    return unwrap(res)
  } catch (err) {
    return rejectWithValue(toErrorString(err))
  }
})

export const uploadSellerDocuments = createAsyncThunk('auth/uploadSellerDocuments', async (formData, { rejectWithValue }) => {
  try {
    const res = await api.post('/seller/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return unwrap(res)
  } catch (err) {
    return rejectWithValue(toErrorString(err))
  }
})

export const retryCacVerification = createAsyncThunk('auth/retryCacVerification', async (_, { rejectWithValue }) => {
  try {
    const res = await api.post('/seller/cac-verification/retry', {})
    return unwrap(res)
  } catch (err) {
    return rejectWithValue(toErrorString(err))
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: (() => {
      try {
        const user = localStorage.getItem('user')
        return user ? JSON.parse(user) : null
      } catch {
        return null
      }
    })(),
    sellerProfile: (() => {
      try {
        const profile = localStorage.getItem('sellerProfile')
        return profile ? JSON.parse(profile) : null
      } catch {
        return null
      }
    })(),
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null
      state.sellerProfile = null
      state.token = null
      state.error = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('sellerProfile')
    },
    clearAuthError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sellerLogin.pending, (state) => { state.loading = true; state.error = null })
      .addCase(sellerLogin.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.sellerProfile = action.payload.sellerProfile || null
        localStorage.setItem('user', JSON.stringify(action.payload.user))
        if (action.payload.sellerProfile) {
          localStorage.setItem('sellerProfile', JSON.stringify(action.payload.sellerProfile))
        }
      })
      .addCase(sellerLogin.rejected, (state, action) => {
        state.loading = false
        state.error = toErrorString(action.payload)
      })
      .addCase(sellerRegister.pending, (state) => { state.loading = true; state.error = null })
      .addCase(sellerRegister.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user || null
        state.token = action.payload.token || null
        state.sellerProfile = action.payload.sellerProfile || null
        if (action.payload.user) {
          localStorage.setItem('user', JSON.stringify(action.payload.user))
        }
        if (action.payload.sellerProfile) {
          localStorage.setItem('sellerProfile', JSON.stringify(action.payload.sellerProfile))
        }
      })
      .addCase(sellerRegister.rejected, (state, action) => {
        state.loading = false
        state.error = toErrorString(action.payload)
      })
      .addCase(getSellerProfile.pending, (state) => { state.loading = true })
      .addCase(getSellerProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user || null
        state.sellerProfile = action.payload.sellerProfile || null
        if (action.payload.user) {
          localStorage.setItem('user', JSON.stringify(action.payload.user))
        }
        if (action.payload.sellerProfile) {
          localStorage.setItem('sellerProfile', JSON.stringify(action.payload.sellerProfile))
        }
      })
      .addCase(getSellerProfile.rejected, (state, action) => {
        state.loading = false
        state.error = toErrorString(action.payload)
      })
      .addCase(uploadSellerDocuments.pending, (state) => { state.loading = true })
      .addCase(uploadSellerDocuments.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user || null
        state.sellerProfile = action.payload.sellerProfile || null
        if (action.payload.sellerProfile) {
          localStorage.setItem('sellerProfile', JSON.stringify(action.payload.sellerProfile))
        }
      })
      .addCase(uploadSellerDocuments.rejected, (state, action) => {
        state.loading = false
        state.error = toErrorString(action.payload)
      })
      .addCase(retryCacVerification.pending, (state) => { state.loading = true })
      .addCase(retryCacVerification.fulfilled, (state, action) => {
        state.loading = false
        state.sellerProfile = action.payload.sellerProfile || null
        if (action.payload.sellerProfile) {
          localStorage.setItem('sellerProfile', JSON.stringify(action.payload.sellerProfile))
        }
      })
      .addCase(retryCacVerification.rejected, (state, action) => {
        state.loading = false
        state.error = toErrorString(action.payload)
      })
  },
})

export const { logout, clearAuthError } = authSlice.actions

export default authSlice.reducer
