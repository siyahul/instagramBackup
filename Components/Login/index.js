import { gql, useMutation, useQuery } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, TextInput, Image, Button, SafeAreaView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { userSignin as signIn } from "../../Redux/Actions/userActions";
import {
  USER_SIGNIN_FAIL,
  USER_SIGNIN_REQUEST,
} from "../../Redux/Constants/userConstants";
import Loading from "../Loading";
import { styles } from "./style";

const LOGIN = gql`
  mutation Login($userName: String!, $password: String!) {
    login(userName: $userName, password: $password) {
      token
      id
      email
      userName
      createdAt
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginInfo, setLoginInfo] = useState(null);
  const [errors, setErrors] = useState(null);
  const [loginReq, { loading }] = useMutation(LOGIN, {
    update(proxy, result) {
      console.log(result);
      setLoginInfo(result);
    },
    onError: (error) => {
      if (error?.graphQLErrors[0]?.extensions?.errors)
        setErrors(error.graphQLErrors[0].extensions.errors);
      if (error.networkError) {
        setErrors({networkError:"network error"});
      }
    },
    variables: { userName: email, password: password },
  });

  const dispatch = useDispatch();
  const userSignIn = useSelector((state) => state.userSignIn);

  useEffect(() => {
    if (loading) {
      dispatch({
        type: USER_SIGNIN_REQUEST,
      });
    }
    if (errors) {
      console.log(errors);
      dispatch({
        type: USER_SIGNIN_FAIL,
        payload: errors,
      });
    }
    if (loginInfo) {
      const {data:{login}} = loginInfo;
      dispatch(signIn(login));
      
      setErrors(null);
    }
  }, [loginInfo, loading, errors]);
  console.log(loginInfo);
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
          <Button title="Login" onPress={()=>loginReq()} disabled={userSignIn.loading} />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Login;
