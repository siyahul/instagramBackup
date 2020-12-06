import AsyncStorage from "@react-native-async-storage/async-storage";
import { createStackNavigator } from "@react-navigation/stack";
import jwtDecode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Login from "../Components/Login";
import UserStory from "../Components/UserStory";
import { userSignOut } from "../Redux/Actions/userActions";
import BottomHomeNavigator from "./BottomHomeNavigator";

const Stack = createStackNavigator();

const Routes = () => {
  const { userInfo } = useSelector((state) => state.userSignIn);
  const dispatch = useDispatch();

  useEffect(() => {
    AsyncStorage.getItem("token").then((res) => {
      const token = JSON.parse(res);
      if (token) {
        const user = jwtDecode(token);
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
    });
  }, []);

  return (
    <Stack.Navigator>
      {/* home screen */}
      {userInfo ? (
        <>
          <Stack.Screen
            name="Home"
            component={BottomHomeNavigator}
            options={{
              headerShown: false,
            }}
          />
          {/* Story View Screen */}
          <Stack.Screen
            name="UserStory"
            component={UserStory}
            options={{
              headerShown: false,
            }}
          />
        </>
      ) : (
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
      )}
    </Stack.Navigator>
  );
};

export default Routes;
