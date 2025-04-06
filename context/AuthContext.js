"use client"

import { createContext, useState, useContext } from "react"

// Create the context
const AuthContext = createContext()

export function AuthProvider({ children }) {
  // State for social accounts
  const [googleUser, setGoogleUser] = useState(null)
  const [facebookUser, setFacebookUser] = useState(null)
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false)
  const [isLoadingFacebook, setIsLoadingFacebook] = useState(false)

  // Mock functions for OAuth (until packages are installed)
  const connectGoogle = async () => {
    setIsLoadingGoogle(true)
    // Simulate API delay
    setTimeout(() => {
      setGoogleUser({
        id: "123456789",
        name: "John Doe",
        email: "john.doe@gmail.com",
        picture: "https://randomuser.me/api/portraits/men/1.jpg",
      })
      setIsLoadingGoogle(false)
    }, 1500)
  }

  const connectFacebook = async () => {
    setIsLoadingFacebook(true)
    // Simulate API delay
    setTimeout(() => {
      setFacebookUser({
        id: "987654321",
        name: "John Doe",
        email: "john.doe@facebook.com",
        picture: {
          data: {
            url: "https://randomuser.me/api/portraits/men/1.jpg",
          },
        },
      })
      setIsLoadingFacebook(false)
    }, 1500)
  }

  const disconnectGoogle = () => {
    setGoogleUser(null)
  }

  const disconnectFacebook = () => {
    setFacebookUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        googleUser,
        facebookUser,
        isLoadingGoogle,
        isLoadingFacebook,
        connectGoogle,
        connectFacebook,
        disconnectGoogle,
        disconnectFacebook,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

