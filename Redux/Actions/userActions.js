import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  USER_LOGOUT,
  USER_SIGNIN_FAIL,
  USER_SIGNIN_SUCCESS,
  USER_SIGNUP_FAILED,
  USER_SIGNUP_REQUEST,
  USER_SIGNUP_SUCCESS,
  USER_SIGN_LOGOUT,
} from "../Constants/userConstants";
import jwtDecode from "jwt-decode";
import { postUpdate } from "./postActions";

export const userSignin = ({token}) => async (dispatch) => {
    const user = jwtDecode(token);
    user.token = token;
    AsyncStorage.setItem('token',token).then(() => dispatch({
      type: USER_SIGNIN_SUCCESS,
      payload: user,
    })).catch((err) => {
      throw new Error(err);
    })
};

export const userSignOut = () => (dispatch) => {
  AsyncStorage.removeItem('token').then(() => {
    const data= null;
    dispatch(postUpdate(data));
    dispatch({
      type: "USER_LOGOUT",
    });
  }).catch((error) => {
    console.log(error);
  })
};

