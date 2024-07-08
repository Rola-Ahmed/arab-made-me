import { createContext, useState, useMemo } from "react";

export let UserToken = createContext(null);

export function UserTokenProvider({ children }) {
  //  initial value from localStorage
  let [isLogin, setIsLogin] = useState(() => {
    // Retrieve the token from localStorage
    const storedToken = localStorage.getItem("userToken");
    // Parse the token from string to boolean (or null if not present)
    // return storedToken
    return storedToken !== null ? storedToken : null;
  });

  // Update the state and localStorage when setIsLogin is called
  const setAndStoreIsLogin = (newValue) => {
    // if(newValue==null){
    //   localStorage.clear();
    // }
    // Update the state
    setIsLogin(newValue);
    // Store the new value in localStorage
    // localStorage.setItem('userToken', JSON.stringify(newValue));
    localStorage.setItem("userToken", newValue);
  };

  // Memoize the context value to avoid unnecessary renders
  const contextValue = useMemo(
    () => ({ isLogin, setIsLogin: setAndStoreIsLogin }),
    [isLogin]
  );
  return (
    <UserToken.Provider value={contextValue}>{children}</UserToken.Provider>
  );

  // return (
  //   <UserToken.Provider value={{ isLogin, setIsLogin: setAndStoreIsLogin }}>
  //     {children}
  //   </UserToken.Provider>
  // );
}
