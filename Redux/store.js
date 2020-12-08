import { createStore, compose, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { postsReducer } from "./Reducers/postReducer";
import { storiesReducer } from "./Reducers/storyReducer";
import { userSignInReducer, userSignUpReducer } from "./Reducers/userReducers";
import { data } from "../Datas/story";
import jwtDecode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userSignOut } from "./Actions/userActions";


const initialState = {
  userSignIn: {
    userInfo: null,
  },
  userSignUp: {
    userInfo: AsyncStorage.getItem('token'),
  },
  posts: {
    data: null,
  },
  stories: {
    data: data,
  },
};
const reducer = combineReducers({
  userSignIn: userSignInReducer,
  userSignUp: userSignUpReducer,
  posts: postsReducer,
  stories: storiesReducer,
});


let composeEnhancer = compose;
if (__DEV__) {
  composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

const store = createStore(
  reducer,
  initialState,
  composeEnhancer(applyMiddleware(thunk))
);

async function getToken(){
  const {dispatch} = store;
  const token = await AsyncStorage.getItem('token');
  if (token) {
    const user = jwtDecode(token);
    user.token = token;
    if (user.exp * 1000 > Date.now()) {
      dispatch({
        type: "USER_SIGNIN_SUCCESS",
        payload: user,
      });
    }else{
      console.log("expired token user Logout")
      dispatch(userSignOut());
    }
  }
}
getToken();

export default store;
