import React, { createContext,useContext, useState } from "react";
import { getApiUrl } from "../api";

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUser = async id => {
    try {
      const response = await fetch(`${getApiUrl('backend')}/getchitietuser/${id}`)
      console.log(response)
      const data = await response.json()
      if (response.ok) {
        setUser(data)
      }
    } catch (error) {
      console.error('Lỗi fetch user:', error)
    }
  }

  return (
    <UserContext.Provider value={{ user, fetchUser}}>
      {children}
    </UserContext.Provider>
  );
};
export const useUser = () => useContext(UserContext)