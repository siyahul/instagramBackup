import React from "react";

const UploadContext = React.createContext();

const reducer = (state, action) => {
  return action.payload;
};

export const UploadProvider = ({ children }) => {
  return (
    <UploadContext.Provider
      value={React.useReducer(reducer, {})}
      children={children}
    />
  );
};

export const useSelectImage = () => React.useContext(UploadContext);
