import { useApolloClient, useQuery } from "@apollo/client";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Profile from "../../Components/Profile";
import { GET_MY_POSTS } from "../../queries";
import { userSignOut } from "../../Redux/Actions/userActions";
import { useWSContext } from "../../WSProvider";

const buttons = [
  {
    title: "Edit profile",
  },
  {
    title: "Logout",
  },
];
const ProfileScreen = () => {
  const { userInfo } = useSelector((state) => state.userSignIn);
  const followers = userInfo?.followers?.length;
  const followings = userInfo?.followings?.length;
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState();
  const dispatch = useDispatch();
  const client = useApolloClient();
  const wsCLient = useWSContext();
  const logout = () => {
    dispatch(userSignOut(client,wsCLient));
  };
  function editProfile() {
    console.log("pressed Edit profile");
  }
  const { data, refetch } = useQuery(GET_MY_POSTS, {
    onCompleted: (data) => {
      const getMyPosts = data?.getMyPosts;
      setPosts(getMyPosts);
      setRefreshing(false);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const refresh = useCallback(() => {
    setRefreshing(true);
    refetch();
  }, []);

  const buttonPress = useCallback((title) => {
    switch (title) {
      case "Edit profile":
        return editProfile();
      case "Logout":
        return logout();
      default:
        return console.log("Invalid Press");
    }
  }, []);

  return (
    <Profile
      uri={userInfo?.photoUrl}
      buttons={buttons}
      buttonPress={buttonPress}
      followers={followers}
      followings={followings}
      refresh={refresh}
      refreshing={refreshing}
      posts={posts}
    />
  );
};

export default ProfileScreen;
