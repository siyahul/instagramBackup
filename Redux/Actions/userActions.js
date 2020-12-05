import axios from "axios";
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

export const userSignin = (data) => async (dispatch) => {
    const user = data;
    AsyncStorage.setItem('userInfo',JSON.stringify(data)).then(() => dispatch({
      type: USER_SIGNIN_SUCCESS,
      payload: user,
    })).catch((err) => {
      throw new Error(err);
    })
};

export const userSignOut = () => (dispatch) => {
  AsyncStorage.removeItem('userInfo').then(() => {
    dispatch({
      type: USER_LOGOUT,
    });
    dispatch({
      type: USER_SIGN_LOGOUT,
    });
  }).catch((error) => {
    console.log(error);
  })
};

export const userSignUp = (name, email, password) => async (dispatch) => {
  dispatch({
    type: USER_SIGNUP_REQUEST,
    payload: { name, email, password },
  });
  axios.post("api/users/signup", {
    name: name,
    email: email,
    password: password,
  })
    .then(({data}) => {
      dispatch({
        type: USER_SIGNUP_SUCCESS,
        payload: data,
      });
    })
    .catch((error) => {
      dispatch({
        type: USER_SIGNUP_FAILED,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
      //clearing signUp failed after 5s
      setTimeout(() => {
        dispatch({
          type: USER_SIGNUP_FAILED,
          payload: null,
        });
      }, 5000);
    });
};
