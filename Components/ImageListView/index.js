import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useProfile } from "../../Providers/ProfileProvider";


const renderItem = ({ item }) => {
  return (
    <View>
      <Image
        source={{
          uri:
            item.image,
        }}
        style={{
          width: Dimensions.get("window").width / 3,
          height: Dimensions.get("window").width / 3,
          margin: 2,
        }}
      />
    </View>
  );
};

const ImageListView = ({posts,refreshing,onRefresh}) => {
  const route = useRoute();
  console.log(route.name);

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      numColumns={3}
      keyExtractor={(item, index) => String(index)}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
};

export default ImageListView;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
});
