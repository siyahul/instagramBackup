import React from "react";
import {
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Dimensions,
  TextInput,
  View,
} from "react-native";
import { useSelectImage } from "../../Providers/UploadProvider";

const Upload = () => {
  const [selectedImage, setSelectedImage] = useSelectImage();

  const changeText = (text) => {
    const newSelectImage = {
      ...selectedImage,
      caption: text,
    };
    setSelectedImage({
      payload: newSelectImage,
    });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="position">
      <Image source={{ uri: selectedImage.uri }} style={styles.image} />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Write a caption..."
          style={styles.caption}
          onChangeText={changeText}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default Upload;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "lightgray",
  },
  image: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").width,
  },
  caption: {
    borderWidth: 1,
    borderColor: "lightgray",
    padding: 10,
    margin: 10,
  },
  inputContainer: {
    width: Dimensions.get("window").width,
  },
});
