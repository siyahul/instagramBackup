import React, { memo, useEffect, useState } from "react";
import { FlatList } from "react-native";
import Post from "../Post";
import Stories from "../Stories";
import { postUpdate } from "../../Redux/Actions/postActions.js";
import Loading from "../Loading";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../Redux/Actions/postActions";

const Feeds = () => {
  const [indexOfPost, setIndexOfPost] = useState(0);
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  const {
    userSignIn: { userInfo },
    posts,
  } = state;

  useEffect(() => {
    dispatch(fetchPosts());
  }, []);

  const handleLike = (id, value) => {
    setIndexOfPost(id);
    const oldPosts = posts.data;
    const newData = [...oldPosts];
    const uid = userInfo.id;
    newData[id].liked = value;
    if (value) {
      newData[id].likes.unshift(uid);
    } else {
      const positionOfLike = newData[id].likes.indexOf(uid);
      newData[id].likes.splice(positionOfLike, 1);
    }
    dispatch(postUpdate(newData));
  };

  return (
    <FlatList
      data={posts.data}
      renderItem={({ item, index }) => (
        <Post post={item} index={index} handleLike={handleLike} />
      )}
      keyExtractor={(item, index) => String(index)}
      ListHeaderComponent={Stories}
      ListFooterComponent={Loading}
    />
  );
};

export default memo(Feeds);
