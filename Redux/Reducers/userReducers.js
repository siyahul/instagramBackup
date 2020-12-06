import {
    USER_LOGOUT,
    USER_SIGNIN_FAIL,
    USER_SIGNIN_REQUEST,
    USER_SIGNIN_SUCCESS,
    USER_SIGNUP_FAILED,
    USER_SIGNUP_REQUEST,
    USER_SIGNUP_SUCCESS,
    USER_SIGN_LOGOUT,
  } from "../Constants/userConstants";

  export const userSignInReducer = (state = {}, action) => {
    switch (action.type) {
      case USER_SIGNIN_REQUEST:
        return { ...state, loading: true };
      case USER_SIGNIN_SUCCESS:
        return { ...state, loading: false, userInfo: action.payload };
      case USER_SIGNIN_FAIL:
        return { ...state, loading: false, error: action.payload };
      case 'USER_FROM_LOCALSTORAGE':
        return { ...state, loading: false, userInfo: action.payload };
      case USER_LOGOUT:
        return {};
      default:
        return { ...state };
    }
  };

  export const userSignUpReducer = (state = {}, action) => {
    switch (action.type) {
      case USER_SIGNUP_REQUEST:
        return { ...state, loading: true };
      case USER_SIGNUP_SUCCESS:
        return { ...state, loading: false, userInfo: action.payload,error:null };
      case USER_SIGNUP_FAILED:
        return { ...state, loading: false, error: action.payload };
      case USER_SIGN_LOGOUT:
        return {};
      default:
        return { ...state };
    }
};