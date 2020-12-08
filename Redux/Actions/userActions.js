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
import axios from "axios";

export const userSignin = (userName, password) => async (dispatch) => {
  axios
    .post("http://192.168.1.12:5000", {
      query:
        "mutation Login($userName: String!, $password: String!){login(userName:$userName,password:$password){id token userName} }",
      variables: {
        userName,
        password,
      },
    })
    .then(({ data }) => {
      const token = data.data.login.token;
      const user = jwtDecode(token);
      user.token = token;
      AsyncStorage.setItem("token",token)
        .then(() => {
          dispatch({
            type: USER_SIGNIN_SUCCESS,
            payload: user,
          });
        })
        .catch((err) => {
          dispatch({
            type: USER_SIGNIN_FAIL,
            payload: err,
          });
        });
    })
    .catch((err) => {
      dispatch({ type: USER_SIGNIN_FAIL, payload: err });
    });
};

export const userSignOut = () => (dispatch) => {
  AsyncStorage.removeItem("token")
    .then(() => {
      const data = null;
      dispatch(postUpdate(data));
      dispatch({
        type: "USER_LOGOUT",
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
