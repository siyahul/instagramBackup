import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import AddPostScreen from "../Screens/AddPostScreen";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Text, TouchableNativeFeedback, View } from "react-native";
import { useSelectImage } from "../Providers/UploadProvider";
import Upload from "../Screens/Upload";

const Stack = createStackNavigator();
const AddPostStack = () => {
  const navigation = useNavigation();
  const [selectedImage] = useSelectImage();
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
                <TouchableWithoutFeedback
                  onPress={() => console.log(selectedImage)}
                >
                  <Text style={{ fontSize: 20, color: "dodgerblue" }}>
                    Share
                  </Text>
                </TouchableWithoutFeedback>
              </View>
            );
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default AddPostStack;
