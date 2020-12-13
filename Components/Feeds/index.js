import React, { memo, useEffect, useState } from "react";
import { FlatList, Text } from "react-native";
import Post from "../Post";
import Stories from "../Stories";
import { postUpdate, fetchPosts } from "../../Redux/Actions/postActions.js";
import Loading from "../Loading";
import { useDispatch, useSelector } from "react-redux";
import {
  FETCH_NEWS_QUERY,
  GET_NEWS_SUBSCRIPTION,
  LIKE_MUTATION,
  UNLIKE_MUTATION,
} from "../../queries";
import { useMutation, useSubscription, useQuery } from "@apollo/client";
import {
  LIST_POSTS_FAIL,
  LIST_POSTS_REQUESTS,
} from "../../Redux/Constants/postConstants";

const Feeds = () => {
  const [indexOfPost, setIndexOfPost] = useState(0);
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const {
    userSignIn: { userInfo },
    posts,
  } = state;

  const [lastPostId, setLastPostId] = useState("");

  const { client, loading } = useQuery(FETCH_NEWS_QUERY, {
    variables: { no: 5, lastPostId: "" },
    onCompleted: ({ getNews }) => {
      const { id } = getNews[getNews.length - 1];
      setLastPostId(id);
      dispatch(fetchPosts(getNews));
    },
    onError: (err) => {
      dispatch({ type: LIST_POSTS_FAIL, payload: err });
    },
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    if (loading) {
      dispatch({ type: LIST_POSTS_REQUESTS });
    }
  }, [loading]);

  const [like] = useMutation(LIKE_MUTATION, {
    onError: () => {
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
    onError: () => {
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

  const subscribe = useSubscription(GET_NEWS_SUBSCRIPTION, {
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    if (subscribe.data) {
      console.log(subscribe.data);
      refetch();
    }
  }, [subscribe.loading, subscribe.data, subscribe.error]);

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
  console.log(posts);
  return (
    <>
      <FlatList
        data={posts.data}
        renderItem={({ item, index }) => (
          <Post post={item} index={index} handleLike={handleLike} />
        )}
        keyExtractor={(item, index) => String(index)}
        ListHeaderComponent={Stories}
        ListFooterComponent={
          posts.loading || loading ? (
            Loading
          ) : posts.error ? (
            <Text>{posts.error}</Text>
          ) : null
        }
        onEndReachedThreshold={0.1}
        onEndReached={() => {
          if (!posts.error) {
            dispatch({
              type: LIST_POSTS_REQUESTS,
            });
            client
              .query({
                query: FETCH_NEWS_QUERY,
                fetchPolicy: "no-cache",
                variables: { no: 5, lastPostId },
              })
              .then(({ data }) => {
                const { getNews } = data;
                if (getNews.length > 0) {
                  const id = getNews[getNews.length - 1].id;
                  setLastPostId(id);
                  const updatePosts = [...posts.data, ...getNews];
                  dispatch(fetchPosts(updatePosts));
                } else {
                  dispatch({
                    type: LIST_POSTS_FAIL,
                    payload: "no more posts",
                  });
                }
              });
          }
        }}
      />
    </>
  );
};

export default memo(Feeds);
