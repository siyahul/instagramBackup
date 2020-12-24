import { createStore, compose, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { postsReducer } from "./Reducers/postReducer";
import { storiesReducer } from "./Reducers/storyReducer";
import { userSignInReducer, userSignUpReducer } from "./Reducers/userReducers";
import { data } from "../Datas/story";
import jwtDecode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userSignOut } from "./Actions/userActions";
import serverAddress from "../serverAddress";
import { GET_USER_QUERY } from "../queries";

const initialState = {
  userSignIn: {
    userInfo: null,
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

async function getToken() {
  const { dispatch } = store;
  const token = await AsyncStorage.getItem("token");
  if (token) {
    const user = jwtDecode(token);
    const jsonRes = await fetch(`http://${serverAddress}/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
        query GetUser($userId:ID!) {
          getUser(userId:$userId){
            id
            email
            userName
            createdAt
            followers
            followings
          }
        }
      `,
        variables: { userId: user.id },
      }),
    });
    const {
      data: { getUser },
    } = await jsonRes.json();

    getUser.token = token;

    user.token = token;
    if (user.exp * 1000 > Date.now()) {
      dispatch({
        type: "USER_SIGNIN_SUCCESS",
        payload: getUser,
      });
    } else {
      console.log("expired token user Logout");
      dispatch(userSignOut());
    }
  }
}
getToken();

export default store;
