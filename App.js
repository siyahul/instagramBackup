import React from 'react';
import { SafeAreaView, StyleSheet } from "react-native";
import { AppLoading } from "expo";
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import { useFonts } from "expo-font";
import "react-native-gesture-handler";

import { NavigationContainer } from "@react-navigation/native";
import Routes from "./Routes";
import store from "./Redux/store";
import { Provider } from "react-redux";
import AsyncStorage from '@react-native-async-storage/async-storage';

const httpLink = createHttpLink({
  uri: "http://192.168.1.12:5000",
});

const authLink = setContext(async(_,{headers}) => {
  // get the authentication token from local storage if it exists
  const userInfo = await AsyncStorage.getItem('userInfo')
  const token = userInfo? JSON.parse(userInfo).token:"";
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}`:"",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default function App() {
  //importing fonts with expo
  let [fontsLoaded] = useFonts({
    "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <Provider store={store}>
        {/* Redux Provider */}
        <ApolloProvider client={client}>
          <NavigationContainer>
            <SafeAreaView style={styles.container}>
              <Routes />
            </SafeAreaView>
          </NavigationContainer>
        </ApolloProvider>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
