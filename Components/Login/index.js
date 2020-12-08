import React, { useState } from "react";
import { View, TextInput, Image, Button, SafeAreaView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../Loading";
import {userSignin} from "../../Redux/Actions/userActions";
import { styles } from "./style";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch()
  const userSignIn = useSelector((state) => state.userSignIn);

  const loginReq = () => {
    dispatch(userSignin(email,password));
  };

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
            onPress={() => loginReq()}
            disabled={userSignIn.loading}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Login;
