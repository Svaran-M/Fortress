"use client"

import { createContext, useState, useContext } from "react"


const UserContext = createContext()


export function UserProvider({ children }) {
  const [users, setUsers] = useState([])


  const registerUser = (name, email, password) => {
    const newUser = { name, email, password }
    setUsers([...users, newUser])
    return newUser
  }
  const loginUser = (email, password) => {
    const user = users.find((user) => user.email === email && user.password === password)
    return user || null
  }

  return <UserContext.Provider value={{ users, registerUser, loginUser }}>{children}</UserContext.Provider>
}


export function useUser() {
  return useContext(UserContext)
}

