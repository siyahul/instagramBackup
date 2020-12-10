import React from "react";
import { Button, SafeAreaView, Text } from "react-native";
import { userSignOut } from "../../Redux/Actions/userActions";
import { styles } from "./style";
import { useDispatch } from "react-redux";

import { useApolloClient } from "@apollo/client";

const Profile = () => {
  const dispatch = useDispatch();
  const client = useApolloClient();

  const logout = () => {
    dispatch(userSignOut(client));
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text>Profile</Text>
      <Button onPress={logout} title="Logout" />
    </SafeAreaView>
  );
};

export default Profile;
