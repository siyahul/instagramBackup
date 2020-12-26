import React from 'react';

const ProfileContext = React.createContext();
const ProfileUpdateContext = React.createContext();

const reducer = (state,action)=>{
    switch(action.type){
        case 'GET_MY_POSTS':
            return {...state,posts: action.payload};
        default:
            return state;
    }
}



export const ProfileProvider = ({ children }) =>{
    return (
        <ProfileContext.Provider value={React.useReducer(reducer,{posts:[]})}>
            <ProfileUpdateContext.Provider
                value={useUpdatePosts}
                children={children}
            />
        </ProfileContext.Provider>
    )
}

export const useProfile = ()=> React.useContext(ProfileContext);

function useUpdatePosts(){
    const [state,setState] =  useProfile();

    const data = useLazyQuery(GET_MY_POSTS);
}