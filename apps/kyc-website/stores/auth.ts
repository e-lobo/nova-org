import { defineStore } from 'pinia'

interface User {
  id: string
  email: string
}

// Dummy users for testing
const DUMMY_USERS = new Map([
  ['test@example.com', { password: 'password123', id: '1' }],
  ['admin@example.com', { password: 'admin123', id: '2' }]
])

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loading: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.user
  },

  actions: {
    async initialize() {
      // Simulate checking local storage for session
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        this.user = JSON.parse(storedUser)
      }
      this.loading = false
    },

    async login(email: string, password: string) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      const userCredentials = DUMMY_USERS.get(email)
      
      if (!userCredentials || userCredentials.password !== password) {
        throw new Error('Invalid email or password')
      }

      const user = {
        id: userCredentials.id,
        email: email
      }

      this.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },

    async signup(email: string, password: string) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (DUMMY_USERS.has(email)) {
        throw new Error('Email already exists')
      }

      const newUser = {
        id: (DUMMY_USERS.size + 1).toString(),
        email: email
      }

      DUMMY_USERS.set(email, {
        password: password,
        id: newUser.id
      })

      this.user = newUser
      localStorage.setItem('user', JSON.stringify(newUser))
    },

    async logout() {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      this.user = null
      localStorage.removeItem('user')
    }
  }
})