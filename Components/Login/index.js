import React, { useEffect, useState } from "react";
import { View, TextInput, Image, Button, SafeAreaView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../Loading";
import { userSignin } from "../../Redux/Actions/userActions";
import { styles } from "./style";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "../../queries";
import {
  USER_SIGNIN_FAIL,
  USER_SIGNIN_REQUEST,
} from "../../Redux/Constants/userConstants";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const userSignIn = useSelector((state) => state.userSignIn);
  const [signIn, { data, loading, error, client }] = useMutation(
    LOGIN_MUTATION,
    {
      fetchPolicy: "no-cache",
      variables: { userName: email, password: password },
    }
  );

  useEffect(() => {
    if (loading) {
      dispatch({
        type: USER_SIGNIN_REQUEST,
      });
    }
    if (data) {
      dispatch(userSignin(data,client));
    }
    if (error) {
      dispatch({
        type: USER_SIGNIN_FAIL,
        payload: error,
      });
    }
  }, [data, loading, error]);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Image
          style={styles.logo}
          source={{
            uri:
              "https://i.pinimg.com/originals/57/6c/dd/576cdd470fdc0b88f4ca0207d2b471d5.png",
          }}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your email address"
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          textContentType="password"
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
        />
        {userSignIn.loading ? (
          <Loading color="gray" />
        ) : (
          <Button
            title="Login"
            onPress={() => signIn()}
            disabled={userSignIn.loading}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Login;
