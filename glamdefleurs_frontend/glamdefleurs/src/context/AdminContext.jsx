import React, { createContext, useEffect, useState } from 'react';

export const AdminContext = createContext(null);

export function AdminContextProvider(props) {
    const [ isStaff, setIsStaff ] = useState(false);

    const contextValue = { isStaff, setIsStaff };

    return (
        <AdminContext.Provider value={contextValue}>{props.children}</AdminContext.Provider>
    )
}
