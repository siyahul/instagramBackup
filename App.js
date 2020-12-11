import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { AppLoading } from "expo";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import Routes from "./Routes";
import store from "./Redux/store";
import { Provider } from "react-redux";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SubscriptionClient } from "subscriptions-transport-ws";
import WSProvider from "./WSProvider";

const serverAddress = "192.168.1.12:5000";

const httpLink = new HttpLink({
  uri: `http://${serverAddress}/`,
});

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const wsCLient = new SubscriptionClient(`ws://${serverAddress}/graphql`, {
  reconnect: true,
  lazy: true,
  connectionParams: async () => {
    const token = await AsyncStorage.getItem("token");
    return {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
  },
});

wsCLient.onConnecting(() => {
  console.log(`Connecting to ws://${serverAddress}/graphql`);
});

wsCLient.onConnected(() => {
  console.log("Connected");
});

wsCLient.onDisconnected(() => {
  console.log("disconnected");
});

const wsLink = new WebSocketLink(wsCLient);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  connectToDevTools: true,
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
        <ApolloProvider client={client}>
          <WSProvider value={wsCLient}>
            <NavigationContainer>
              <SafeAreaView style={styles.container}>
                <Routes />
              </SafeAreaView>
            </NavigationContainer>
          </WSProvider>
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
