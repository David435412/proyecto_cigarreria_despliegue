import React, { createContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [role, setRole] = useState('');
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        const storedUserId = localStorage.getItem('userId');

        setRole(storedRole || '');
        setUserId(storedUserId || '');
    }, []);

    const login = (userData) => {
        localStorage.setItem('role', userData.role);
        localStorage.setItem('userId', userData.id);
        setRole(userData.role);
        setUserId(userData.id);
    };

    const logout = () => {
        localStorage.removeItem('role');
        localStorage.removeItem('userId');  // Eliminamos también el ID del usuario
        setRole('');
        setUserId('');
    };

    return (
        <UserContext.Provider value={{ role, userId, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;