import React, {createContext, useState} from 'react';

const UserContext = createContext();

export const UserProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [userPass, setuserPass] = useState("");
  return (
    <UserContext.Provider value={{user, userPass, setUser}}> {children} </UserContext.Provider>
  );
};

export default UserContext;
