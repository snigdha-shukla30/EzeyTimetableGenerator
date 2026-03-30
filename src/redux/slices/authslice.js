import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  isLoggedIn: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload
      state.isLoggedIn = true
    },

    logout: (state) => {
      state.user = null
      state.isLoggedIn = false
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer