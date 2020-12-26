import React from "react";
import { View, Text } from "react-native";
import {
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import styles from "./styles";
import ProfilePicture from "../ProfilePicture";
import Gallery from "../Gallery";

const bio = `bio
is
bio
`;
const Profile = ({
  uri,
  buttons,
  buttonPress,
  followers,
  followings,
  posts,
  tags,
  refresh,
  refreshing,
}) => {
  return (
    <>
      <ScrollView>
        <View style={styles.profileHeader}>
          <ProfilePicture uri={uri} />
          <View style={styles.profileInfos}>
            <Text style={styles.infoText}>{posts?.length}</Text>
            <Text style={styles.infoTextFoot}>Posts</Text>
          </View>
          <View style={styles.profileInfos}>
            <Text style={styles.infoText}>{followers}</Text>
            <Text style={styles.infoTextFoot}>Followers</Text>
          </View>
          <View style={styles.profileInfos}>
            <Text style={styles.infoText}>{followings}</Text>
            <Text style={styles.infoTextFoot}>Followings</Text>
          </View>
        </View>
        <View style={styles.ProfileBio}>
          <Text>{bio}</Text>
        </View>
        <View style={styles.btnContainer}>
          {buttons.map((button) => (
            <View style={{ flex: 1, marginHorizontal: 3 }} key={button.title}>
              <TouchableWithoutFeedback
                onPress={() => buttonPress(button.title)}
              >
                <View style={styles.btn}>
                  <Text style={styles.btnText}>{button.title}</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          ))}
        </View>
        <Gallery
          posts={posts}
          tags={tags}
          refresh={refresh}
          refreshing={refreshing}
        />
      </ScrollView>
    </>
  );
};

export default Profile;
