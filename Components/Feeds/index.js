import React, { memo, useEffect, useState } from "react";
import { FlatList } from "react-native";
import Post from "../Post";
import Stories from "../Stories";
import { postUpdate } from "../../Redux/Actions/postActions.js";
import Loading from "../Loading";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../Redux/Actions/postActions";
import {
  FETCH_NEWS_QUERY,
  GET_NEWS_SUBSCRIPTION,
  LIKE_MUTATION,
  UNLIKE_MUTATION,
} from "../../queries";
import {
  useApolloClient,
  useMutation,
  useQuery,
  useSubscription,
} from "@apollo/client";
import {
  LIST_POSTS_FAIL,
  LIST_POSTS_REQUESTS,
} from "../../Redux/Constants/postConstants";

const Feeds = () => {
  const [indexOfPost, setIndexOfPost] = useState(0);
  const dispatch = useDispatch();
  const [fetchedPosts, setFetchedPosts] = useState(null);
  const [newsFetchErrors, setnewsFetchErrors] = useState(null);
  const state = useSelector((state) => state);
  const client = useApolloClient();
  const {
    userSignIn: { userInfo },
    posts,
  } = state;

  const { refetch, loading,data,error, startPolling, stopPolling } = useQuery(
    FETCH_NEWS_QUERY,
    {
      fetchPolicy:"no-cache",
      onCompleted: ({ getNews }) => {
        stopPolling();
        setFetchedPosts(getNews);
      },
      onError: (error) => {
        
      },
      pollInterval: 100,
    }
  );
  const [like] = useMutation(LIKE_MUTATION, {
    onError: (error) => {
      const oldPosts = posts.data;
      const newData = [...oldPosts];
      const uid = userInfo.id;
      newData[indexOfPost].liked = false;
      const positionOfLike = newData[indexOfPost].likes.indexOf(uid);
      newData[indexOfPost].likes.splice(positionOfLike, 1);
      setTimeout(() => {
        dispatch(postUpdate(newData));
      }, 1000);
    },
  });
  const [unlike] = useMutation(UNLIKE_MUTATION, {
    onError: (error) => {
      const oldPosts = posts.data;
      const newData = [...oldPosts];
      const uid = userInfo.id;
      newData[indexOfPost].liked = true;
      newData[indexOfPost].likes.unshift(uid);
      setTimeout(() => {
        dispatch(postUpdate(newData));
      }, 1000);
    },
  });

  const subscribe = useSubscription(GET_NEWS_SUBSCRIPTION,{fetchPolicy:"no-cache"});

  useEffect(() => {
    if (subscribe.data) {
      console.log(subscribe.data);
      refetch();
    }
  }, [subscribe.loading, subscribe.data, subscribe.error]);

  useEffect(() => {
    if (loading) {
      dispatch({
        type: LIST_POSTS_REQUESTS,
      });
    }
    if (data) {
      dispatch(fetchPosts(data.getNews));
    }
    if (error) {
      dispatch({
        type: LIST_POSTS_FAIL,
        payload: error,
      });
    }
  }, [data, error,loading]);

  const handleLike = (id, value) => {
    setIndexOfPost(id);
    const oldPosts = posts.data;
    const newData = [...oldPosts];
    const uid = userInfo.id;
    newData[id].liked = value;
    if (value) {
      newData[id].likes.unshift(uid);
      like({ variables: { postId: newData[id].id } });
    } else {
      unlike({ variables: { postId: newData[id].id } });
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
