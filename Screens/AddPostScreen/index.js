import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { View, StyleSheet, Image, Dimensions, Text } from "react-native";
import * as MediaLibrary from "expo-media-library";
import {
  FlatList,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { faPlusSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import * as ImagePicker from "expo-image-picker";
import { useSelectImage } from "../../Providers/UploadProvider";

const compressImage = async (uri, format = SaveFormat.JPEG) => {
  const result = await manipulateAsync(
    uri,
    [{ resize: { width: 250, height: 250 } }],
    { compress: 0.7, format }
  );

  return {
    name: `${Date.now()}.${format}`,
    type: `image/${format}`,
    ...result,
  };
  // return: { name, type, width, height, uri }
};

class ThumpNails extends React.PureComponent {
  render() {
    const { item, index, handlePress } = this.props;
    return (
      <TouchableWithoutFeedback onPress={() => handlePress(index)}>
        <Image
          source={{
            uri: item.compressImage,
          }}
          style={{
            width: Dimensions.get("window").width / 4,
            height: Dimensions.get("window").width / 4,
          }}
        />
      </TouchableWithoutFeedback>
    );
  }
}

const selectImage = ({ selectImageFromGallery }) => {
  return (
    <TouchableWithoutFeedback onPress={selectImageFromGallery}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          margin: 10,
        }}
      >
        <Text style={{ fontSize: 24 }}>Add From Gallery </Text>
        <FontAwesomeIcon icon={faPlusSquare} size={24} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const MemorizedSelectImage = memo(selectImage);

const AddPostScreen = () => {
  const [permissions, setPermissions] = useState(null);
  const [medias, setMedias] = useState([]);
  const [selectedImage, setSelectedImage] = useSelectImage();
  async function getMedia(options, isSetSelected) {
    try {
      const media = await MediaLibrary.getAssetsAsync(options);
      const newAsset = await Promise.all(
        media.assets.map(async (asset) => {
          const compressedImage = await compressImage(asset.uri);
          asset.compressImage = compressedImage.uri;
          return asset;
        })
      );
      setMedias({
        ...media,
        assets: newAsset,
      });
      if (isSetSelected) {
        setSelectedImage({payload:media?.assets[0]});
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  const memorizedValue = useMemo(() => renderItems, [medias.assets]);
  useEffect(() => {
    return () => {
      console.log("Add post unmounted");
    };
  }, []);
  useEffect(() => {
    MediaLibrary.requestPermissionsAsync().then((permission) =>
      setPermissions(permission)
    );
    if (permissions?.status === "granted") {
      const options = {
        first: 40,
        mediaType: ["photo"],
        sortBy: [[MediaLibrary.SortBy.creationTime, false]],
      };
      getMedia(options, true);
    }
  }, [permissions?.status]);

  const handlePress = useCallback(
    function (item) {
      setSelectedImage({payload:medias?.assets[item]});
    },
    [medias?.assets]
  );

  function renderItems({ item, index }) {
    return <ThumpNails item={item} index={index} handlePress={handlePress} />;
  }

  async function selectImageFunction() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
      exif: true,
    });

    if (!result.cancelled) {
      setSelectedImage({
        payload: result,
      });
    }
  }

  const selectImageFromGallery = useCallback(selectImageFunction, [
    selectedImage,
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.previewImage}
          source={{ uri: selectedImage?.uri }}
        />
      </View>
      <FlatList
        removeClippedSubviews={true}
        maxToRenderPerBatch={50}
        windowSize={41}
        style={{ flexDirection: "column" }}
        numColumns={4}
        data={medias?.assets}
        keyExtractor={(item) => item.uri}
        renderItem={memorizedValue}
        ListFooterComponent={() => (
          <MemorizedSelectImage
            selectImageFromGallery={selectImageFromGallery}
          />
        )}
      />
    </View>
  );
};

export default memo(AddPostScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  imageContainer: {
    width: "100%",
    height: Dimensions.get("window").width,
  },
  previewImage: {
    width: "100%",
    height: Dimensions.get("window").width,
  },
});
