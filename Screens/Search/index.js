import React, { useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

import { useSearch } from "../../Providers/SearchProvider";
import Loading from "../../Components/Loading";
import ProfilePicture from "../../Components/ProfilePicture";
import { FOLLOW_MUTATIONS, UNFOLLOW_MUTATIONS } from "../../queries";
import { useMutation } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";

const Search = () => {
  const [state, setState] = useSearch();
  const [selectedUser, setSelectedUser] = useState("");
  const { userInfo } = useSelector(({ userSignIn }) => userSignIn);
  const dispatch = useDispatch();
  const [followUser] = useMutation(FOLLOW_MUTATIONS, {
    onCompleted: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
      setState({
        type: "unFollow",
        payload: selectedUser,
      });
    },
  });
  const [unFollowUser] = useMutation(UNFOLLOW_MUTATIONS, {
    onCompleted: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
      setState({
        type: "follow",
        payload: selectedUser,
      });
    },
  });

  const follow = (index) => {
    const userId = state.users[index].id;
    setSelectedUser(userId);
    followUser({ variables: { userId } });
    setState({
      type: "follow",
      payload: userId,
    });

    const newUserInfo = {...userInfo};
    newUserInfo.followings.push(userId);
    dispatch({ type: "UPDATE_USER", payload:newUserInfo});
  };
  const unFollow = (index) => {
    const userId = state.users[index].id;
    setSelectedUser(userId);
    unFollowUser({ variables: { userId } });
    setState({
      type: "unFollow",
      payload: userId,
    });
    const newUserInfo = {...userInfo};
    const indexOfId = userInfo.followings.indexOf(userId);
    newUserInfo.followings.splice(indexOfId, 1);
    dispatch({ type: "UPDATE_USER", payload:newUserInfo});
  };
  const userList = ({ item, index }) => (
    <View style={styles.user}>
      <ProfilePicture uri={item.photoUrl} size="medium" />
      <View style={styles.textContainer}>
        <Text style={styles.userName}>{item.userName}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
      {item.isFollowing ? (
        <TouchableOpacity onPress={() => unFollow(index)}>
          <View style={styles.followingButton}>
            <Text style={{ color: "#000" }}>Following</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => follow(index)}>
          <View style={styles.button}>
            <Text style={{ color: "#fff" }}>Follow</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <FlatList
          data={state.users}
          keyExtractor={(item, index) => String(index)}
          renderItem={userList}
          ListFooterComponent={() => <>{state.loading && <Loading />}</>}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  user: {
    width: "100%",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userName: {
    fontSize: 16,
    fontFamily: "Roboto-Bold",
  },
  textContainer: {
    padding: 10,
    flex: 1,
  },
  email: {
    fontFamily: "Roboto-Regular",
  },
  button: {
    paddingHorizontal: 10,
    width: 100,
    paddingVertical: 5,
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2a9df4",
  },
  followingButton: {
    paddingHorizontal: 10,
    width: 100,
    paddingVertical: 5,
    borderRadius: 2,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderColor: "lightgray",
  },
});
