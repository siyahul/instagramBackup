import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import { USER_SIGNIN_SUCCESS } from "../Constants/userConstants";
import { postUpdate } from "./postActions";

export const userSignin = ({ login }, client) => async (dispatch) => {
  const token = login.token;
  await AsyncStorage.setItem("token", token);
  await client?.resetStore();
  const user = jwtDecode(token);
  user.token = token;
  dispatch({ type: USER_SIGNIN_SUCCESS, payload: user });
};

export const userSignOut = (client, wsCLient) => async (dispatch) => {
  await client?.stop();
  await client?.resetStore();
  await wsCLient?.close(true, true);
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
