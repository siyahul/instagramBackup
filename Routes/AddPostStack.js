import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import AddPostScreen from "../Screens/AddPostScreen";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Alert, Text, TouchableNativeFeedback, View } from "react-native";
import { useSelectImage } from "../Providers/UploadProvider";
import Upload from "../Screens/Upload";
import Loading from "../Components/Loading";
import { CREATE_POST } from "../queries";
import { useMutation } from "@apollo/client";
import serverAddress from "../serverAddress";

const Stack = createStackNavigator();
const AddPostStack = () => {
  const navigation = useNavigation();
  const [selectedImage] = useSelectImage();
  const [loading, setLoading] = useState(false);

  //ReadStream.open() is deprecated.
  /* const [uploadImage] = useMutation(UPLOAD_MUTATION, {
    onCompleted: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  }); */

  const [postImage] = useMutation(CREATE_POST, {
    onCompleted: (data) => {
      setLoading(false);
      navigation.goBack();
    },
    onError: (error) => {
      console.log(error);
      setLoading(false);
    },
  });
  async function upload() {
    const filename = selectedImage.uri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;
    /* const file = new ReactNativeFile({
      uri: selectedImage.uri,
      type,
      name: filename,
    });
    uploadImage({ variables: { file } }); */
    // Upload the image using the fetch and FormData APIs

    const formData = new FormData();
    formData.append("file", { uri: selectedImage.uri, name: filename, type });
    if (selectedImage.caption) {
      setLoading(true);
      const response = await fetch(`http://${serverAddress}/upload`, {
        method: "POST",
        body: formData,
        headers: {
          "content-type": "multipart/form-data",
        },
      });
      response.json().then((data) => {
        postImage({
          variables: { caption: selectedImage.caption, image: data.url },
        });
      });
    } else {
      Alert.alert("Caption is not provided");
    }
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="NewPost"
        component={AddPostScreen}
        options={{
          title: "New Post",
          headerLeft: () => (
            <TouchableNativeFeedback onPress={() => navigation.goBack()}>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  marginLeft: 10,
                  width: "100%",
                }}
              >
                <FontAwesomeIcon
                  icon={faTimes}
                  size={24}
                  style={{ alignItems: "center", justifyContent: "center" }}
                />
              </View>
            </TouchableNativeFeedback>
          ),
          headerRight: () => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginRight: 10,
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => navigation.navigate("Upload")}
              >
                <Text style={{ fontSize: 20, color: "dodgerblue" }}>Next</Text>
              </TouchableWithoutFeedback>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="Upload"
        component={Upload}
        options={{
          headerRight: () => {
            return (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 10,
                }}
              >
                {loading ? (
                  <Loading />
                ) : (
                  <TouchableWithoutFeedback onPress={upload}>
                    <Text style={{ fontSize: 20, color: "dodgerblue" }}>
                      Share
                    </Text>
                  </TouchableWithoutFeedback>
                )}
              </View>
            );
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default AddPostStack;
