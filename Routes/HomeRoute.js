import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Image, View } from "react-native";
import HomeScreen from "../Screens/HomeScreen";
import Ionicons from "react-native-vector-icons/Ionicons";
import Message from "../Screens/Message";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import Discovery from "../Components/Discovery";

const Stack = createStackNavigator();
const HomeRoute = () => {
  const navigation = useNavigation();
  const goToMessages = () => {
    navigation.navigate("Messages")
  }
  const goToDiscovery = () => {
    navigation.navigate("Discovery")
  }
  return (
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          options={{
            headerTitle: () => (
              <Image
                source={{
                  uri:
                    "https://i.pinimg.com/originals/57/6c/dd/576cdd470fdc0b88f4ca0207d2b471d5.png",
                }}
                style={{
                  width: 90,
                  height: 25,
                  resizeMode: "contain",
                  marginLeft: 0,
                }}
              />
            ),
            headerRight: () => (
              <View style={{ flexDirection: "row" }}>
                <TouchableWithoutFeedback onPress={goToDiscovery} style={{ paddingHorizontal: 10 }}>
                  <Ionicons name="md-search" size={24} color="black" />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={goToMessages} style={{ paddingHorizontal: 10 }}>
                  <Ionicons name="ios-paper-plane" size={24} color="black" />
                </TouchableWithoutFeedback>
              </View>
            ),
          }}
          component={HomeScreen}
        />
        <Stack.Screen
        name="Messages"
        component={Message}
        />
        <Stack.Screen
        name="Discovery"
        component={Discovery}
        />
      </Stack.Navigator>
    );
  };
export default HomeRoute;
