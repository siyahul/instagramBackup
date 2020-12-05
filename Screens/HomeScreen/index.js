import { StatusBar } from "expo-status-bar";
import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import Feeds from "../../Components/Feeds";

const HomeScreen = () => {
  return (
    <View style={style.homeScreen}>
      <StatusBar style="dark" backgroundColor='#ddd'/>
      <Feeds />
    </View>
  );
};

export default memo(HomeScreen);

const style = StyleSheet.create({
  homeScreen: {
    flex: 1,
  },
});
