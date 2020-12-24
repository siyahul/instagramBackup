import React from "react";

const SearchContext = React.createContext();

const reducer = (state, action) => {

  let index,newState;
  
  switch (action.type) {
    case "search":
      return {
        ...state,
        users: action.payload,
      };
    case "loading":
      return { ...state, loading: action.payload };
    case "follow":
      index = state.users.findIndex((user) => user.id === action.payload);
      newState = { ...state };
      newState.users[index].isFollowing = true;
      return newState;
    case "unFollow":
      index = state.users.findIndex((user) => user.id === action.payload);
      newState = { ...state };
      newState.users[index].isFollowing = false;
      return newState;
    default:
      return state;
  }
};

export const SearchProvider = ({ children }) => {
  return (
    <SearchContext.Provider value={React.useReducer(reducer, { users: [] })}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  return React.useContext(SearchContext);
};
