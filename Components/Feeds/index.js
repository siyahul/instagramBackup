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
  const [totalCount, setTotalCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const state = useSelector((state) => state);
  const {
    userSignIn: { userInfo },
    posts,
  } = state;
  const { loading, fetchMore, refetch } = useQuery(FETCH_NEWS_QUERY, {
    onCompleted: ({ getNews }) => {
      setTotalCount(getNews.totalCount);
      dispatch(fetchPosts(getNews.news));
    },
    onError: (err) => {
      dispatch({ type: LIST_POSTS_FAIL, payload: err });
    },
    fetchPolicy: "no-cache",
    variables: { first: 5, offset: 0 },
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
      setTotalCount(totalCount + 1);
      const { newPostFromFollowings } = subscribe.data;
      const newPost = { ...newPostFromFollowings, liked: false };
      if (posts.data) {
        const updatePosts = [newPost, ...posts.data];
        dispatch(postUpdate(updatePosts));
      } else {
        const updatePosts = [newPost];
        dispatch(postUpdate(updatePosts));
      }
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

  const refresh = () => {
    setRefreshing(true);
    fetchMore({
      variables: { first: 5, offset: 0 },
    }).then(
      ({
        data: {
          getNews: { news },
        },
      }) => {
        const update = news.map((post) => {
          const liked = post.likes.find(
            (like) => like?.userId === userInfo?.id
          );
          const likes = post.likes.map((like) => like?.userId);

          if (liked) {
            return { ...post, liked: true, likes };
          } else {
            return { ...post, liked: false, likes };
          }
        });
        dispatch(postUpdate(update));
        setRefreshing(false);
      }
    );
  };

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
            <Text
              style={{
                textAlign: "center",
                fontSize: 14,
                color: "gray",
                margin: 10,
              }}
            ></Text>
          ) : null
        }
        refreshing={refreshing}
        onRefresh={refresh}
        onEndReachedThreshold={0.1}
        onEndReached={() => {
          if (totalCount > posts.data.length) {
            dispatch({
              type: LIST_POSTS_REQUESTS,
            });
            fetchMore({
              variables: { first: 5, offset: posts.data.length },
            }).then(({ data: { getNews } }) => {
              const newValue = getNews.news.map((post) => {
                const liked = post.likes.find(
                  (like) => like?.userId === userInfo?.id
                );
                const likes = post.likes.map((like) => like?.userId);

                if (liked) {
                  return { ...post, liked: true, likes };
                } else {
                  return { ...post, liked: false, likes };
                }
              });
              const update = [...posts.data, ...newValue];
              dispatch(postUpdate(update));
            });
          }
        }}
      />
    </>
  );
};

export default memo(Feeds);
