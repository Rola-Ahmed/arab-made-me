import React, { createContext, useState, useMemo } from "react";

// Create the user context
export const GlobalMsgContext = createContext(null);

export function GlobalMessage({ children }) {
  // State for user data
  const [globalMsg, setGlobalMsg] = useState("");

  const contextValue = useMemo(() => ({
    globalMsg,
    setGlobalMsg
  }), [globalMsg, setGlobalMsg]);


  return (
    <GlobalMsgContext.Provider value={contextValue}>
      {children}
    </GlobalMsgContext.Provider>
  );
}
