import { createContext, useState } from "react";



export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("user")
        return saved ? JSON.parse(saved) : null
    })


    const register = (name,email, password) => {
        const newUser = { name,email, password}
        localStorage.setItem("user", JSON.stringify(newUser))
        setUser(newUser)
    }

    const login = (email,password) => {
        const savedUser = JSON.parse(localStorage.getItem("user"))
        if (savedUser && savedUser.email === email && savedUser.password === password ) {
            setUser(savedUser)
            return true
        }
        return false
    }

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user,register, login, logout }}>
            {children}
        </AuthContext.Provider>
    )

}