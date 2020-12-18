import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Image,
  Button,
  SafeAreaView,
  Text,
  Keyboard,
} from "react-native";
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
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const Login = ({ navigation }) => {
  const [state, setState] = useState({
    userName: "",
    password: "",
  });
  const dispatch = useDispatch();
  const [errors, setErrors] = useState([]);
  const userSignIn = useSelector((state) => state.userSignIn);
  const [signIn, { data, loading, error, client }] = useMutation(
    LOGIN_MUTATION,
    {
      fetchPolicy: "no-cache",
      variables: { userName: state.userName, password: state.password },
      onError: (err) => {
        const errArray = Object.values(err.graphQLErrors[0].extensions.errors);
        setErrors(errArray);
      },
    }
  );
  useEffect(() => {
    if (loading) {
      dispatch({
        type: USER_SIGNIN_REQUEST,
      });
    }
    if (data) {
      dispatch(userSignin(data, client));
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
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
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
            placeholder="Enter your Username or Email"
            onChangeText={(text) => setState({ ...state, userName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            textContentType="password"
            secureTextEntry={true}
            onChangeText={(text) => setState({ ...state, password: text })}
          />
          {userSignIn.loading ? (
            <Loading color="gray" />
          ) : (
            <Button
              title={"Login"}
              onPress={() => signIn()}
              disabled={userSignIn.loading}
            />
          )}
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.navigate("SignUp");
            }}
          >
            <View style={styles.signUpPrompt}>
              <Text>Don't have an account? </Text>
              <Text style={styles.link}>Create One</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        {errors.length > 0 && (
          <View style={styles.error}>
            {errors.map((err) => (
              <Text style={styles.errorText} key={err}>
                {err}
              </Text>
            ))}
          </View>
        )}
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Login;
