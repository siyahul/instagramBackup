import React, { memo, useEffect } from "react";
import { FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Post from "../Post";
import Stories from "../Stories";
import { fetchPosts, postUpdate } from "../../Redux/Actions/postActions.js";
import Loading from "../Loading";
import { useQuery, gql } from "@apollo/client";

const FETCH_NEWS_QUERY = gql`
  query {
    getNews {
      id
      createdAt
      image
      comments {
        _id
        createdAt
        userName
        body
      }
      caption
      user {
        id
        email
        userName
        photoUrl
        createdAt
      }
      likes {
        _id
        userName
        userId
        createdAt
      }
      likesCount
      commentsCount
    }
  }
`;

const Feeds = () => {
  const { posts, userSignIn } = useSelector((state) => state);
  //const { data } = posts;
  const dispatch = useDispatch();
  const { userInfo } = userSignIn;

  const { loading, data, error } = useQuery(FETCH_NEWS_QUERY, {
    onError: (errors) => {
      console.log(errors);
    },
  });

  useEffect(() => {
    console.log(loading);
    if (error?.graphQLErrors) console.log(error?.graphQLErrors);
    if (error?.networkError) {
      console.log("network error");
    }
    console.log(data?.getNews);
    if (data) {
      dispatch(fetchPosts(data));
    }
  }, [loading, data, error]);

  console.log(posts.data);

  const handleLike = (id, value) => {
    const newPosts = [...data];
    newPosts[id].image.liked = value;
    const indexOfCurrentUser = newPosts[id].image.likesCount.indexOf(
      userInfo._id
    );
    data[id].image.liked
      ? newPosts[id].image.likesCount.push(userInfo._id)
      : newPosts[id].image.likesCount.splice(indexOfCurrentUser, 1);
    dispatch(postUpdate(newPosts));
  };
  return (
    <FlatList
      data={posts.data}
      renderItem={
        ({ item, index }) => (
        <Post post={item} index={index} handleLike={handleLike} />
      )
      }
      keyExtractor={(item, index) => String(index)}
      ListHeaderComponent={Stories}
      ListFooterComponent={Loading}
    />
  );
};

export default memo(Feeds);
