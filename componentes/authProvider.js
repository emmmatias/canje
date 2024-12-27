'use client'
import React, { createContext, useContext, useState } from 'react'

const authContext = createContext()

const MyProvider = ({ children }) => {
    const [user_loged, setUser_loged] = useState(null)
    const [token, setToken] = useState(null)
    const [user_data, setUser_data] = useState({})
    const [isAutenticated, setIsAutenticated] = useState(false)
    return (
        <authContext.Provider value={{ user_loged, token, user_data, isAutenticated, setUser_loged, setUser_data, setToken, setIsAutenticated}}>
            {children}
        </authContext.Provider>
    )
}

export { authContext, MyProvider };