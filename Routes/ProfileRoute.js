import { faBars, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import ProfileScreen from "../Screens/ProfileScreen";

const Stack = createStackNavigator();
const ProfileRoute = () => {
  const { userInfo } = useSelector((state) => state.userSignIn);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: userInfo.userName,
          headerLeft: () => (
            <View style={styles.profileHeader}>
              <FontAwesomeIcon icon={faPlus} size={24} color={"gray"} />
            </View>
          ),
          headerRight: () => (
            <View style={styles.profileHeaderRight}>
              <FontAwesomeIcon icon={faBars} size={24} color={"gray"} />
            </View>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileRoute;

const styles = StyleSheet.create({
  profileHeader: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 10,
  },
  profileHeaderRight: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 10,
  },
});
