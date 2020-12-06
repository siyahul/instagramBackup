import { createStore, compose, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { postsReducer } from "./Reducers/postReducer";
import { storiesReducer } from "./Reducers/storyReducer";
import { userSignInReducer, userSignUpReducer } from "./Reducers/userReducers";
import { data } from "../Datas/story";

const initialState = {
  userSignIn: {
    userInfo: null,
  },
  userSignUp: {
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

export default store;
