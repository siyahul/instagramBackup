import React, { useContext } from "react";

const WSContext = React.createContext();

export function useWSContext() {
  return useContext(WSContext);
}

export default function ({ children, value }) {
  return <WSContext.Provider children={children} value={value} />;
}
