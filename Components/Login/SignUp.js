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
import { SIGNUP_MUTATION } from "../../queries";
import {
  USER_SIGNIN_FAIL,
  USER_SIGNIN_REQUEST,
} from "../../Redux/Constants/userConstants";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const SignUp = ({ navigation }) => {
  const [state, setState] = useState({
    email: "",
    password: "",
    userName: "",
    confirmPassword: "",
  });
  const dispatch = useDispatch();
  const [errors, setErrors] = useState([]);
  const userSignIn = useSelector((state) => state.userSignIn);
  const [signUp, { data, loading, error, client }] = useMutation(
    SIGNUP_MUTATION,
    {
      fetchPolicy: "no-cache",
      variables: {
        userName: state.userName,
        email: state.email,
        password: state.password,
        confirmPassword: state.confirmPassword,
      },
      onError: (err) => {
        console.log(err.graphQLErrors);
        const errorObj = err?.graphQLErrors[0]?.extensions?.errors;
        const arrayOfErrors = Object.values(errorObj);
        setErrors(arrayOfErrors);
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
            placeholder="Enter a Username"
            onChangeText={(text) => setState({ ...state, userName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your Email Address"
            onChangeText={(text) => setState({ ...state, email: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            textContentType="password"
            secureTextEntry={true}
            onChangeText={(text) => setState({ ...state, password: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            textContentType="password"
            secureTextEntry={true}
            onChangeText={(text) =>
              setState({ ...state, confirmPassword: text })
            }
          />
          {userSignIn.loading ? (
            <Loading color="gray" />
          ) : (
            <Button
              title={"Create an Account"}
              onPress={() => {
                if (
                  state.password === state.confirmPassword &&
                  state.userName !== "" &&
                  state.email !== "" &&
                  state.password !== "" &&
                  state.confirmPassword !== ""
                ) {
                  signUp();
                } else if (state.password !== state.confirmPassword) {
                  setErrors(["Password Must match"]);
                } else {
                  setErrors(["Input fileds must not be empty"]);
                }
              }}
              disabled={userSignIn.loading}
            />
          )}
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.goBack();
            }}
          >
            <View style={styles.signUpPrompt}>
              <Text>Already have an account? </Text>
              <Text style={styles.link}>Login</Text>
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

export default SignUp;
