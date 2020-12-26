import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ImageListView from "../ImageListView";

const Tab = createMaterialTopTabNavigator();

const Gallery = ({ posts, tags = [], refreshing, refresh }) => {
  const postsScreen = () => (
    <ImageListView posts={posts} refresh={refreshing} onRefresh={refresh} />
  );
  const tagScreen = () => (
    <ImageListView posts={tags} />
  );

  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: "#000",
        indicatorStyle: { backgroundColor: "#000" },
      }}
    >
      <Tab.Screen name="Posts" children={postsScreen} />
      <Tab.Screen name="Tags" children={tagScreen} />
    </Tab.Navigator>
  );
};

export default React.memo(Gallery);

const styles = StyleSheet.create({});
