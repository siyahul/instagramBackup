import React, { memo } from "react";
import { Image, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "./styles";

const ProfilePicture = ({ uri, size, visited }) => {
  const url = uri.trim()  == ""
  ? "https://thumbs.dreamstime.com/b/default-avatar-photo-placeholder-profile-icon-eps-file-easy-to-edit-default-avatar-photo-placeholder-profile-icon-124557887.jpg"
  : uri;
  const image = (
    <Image
      style={
        size === "small"
          ? styles.small
          : size === "medium"
          ? styles.medium
          : styles.image
      }
      source={{
        uri:url
      }}
    />
  );

  return (
    <View style={styles.container}>
      {!visited ? (
        <LinearGradient
          colors={["#F58529", "#FEDA77", "#DD2A7B", "#8134AF", "#515BD4"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={
            size === "small"
              ? styles.gradientSmall
              : size === "medium"
              ? styles.gradientMedium
              : styles.gradient
          }
        >
          {image}
        </LinearGradient>
      ) : (
        <View
          style={
            size === "small"
              ? styles.viewSmall
              : size === "medium"
              ? styles.viewMedium
              : styles.view
          }
        >
          {image}
        </View>
      )}
    </View>
  );
};

export default memo(ProfilePicture);
