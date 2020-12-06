import React, { memo, useEffect, useState } from "react";
import { Alert, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Post from "../Post";
import Stories from "../Stories";
import { fetchPosts, postUpdate } from "../../Redux/Actions/postActions.js";
import Loading from "../Loading";
import { useQuery, gql, useMutation } from "@apollo/client";

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

const LIKE_MUTATION = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
      user {
        id
      }
    }
  }
`;

const UNLIKE_MUTATION = gql`
  mutation LikePost($postId: ID!) {
    unLikePost(postId: $postId) {
      user {
        id
      }
    }
  }
`;

const Feeds = () => {
  const {
    posts,
    userSignIn: { userInfo },
  } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [datas, setDatas] = useState(null);
  const { loading, data, error, startPolling, stopPolling } = useQuery(
    FETCH_NEWS_QUERY,
    {
      fetchPolicy: "no-cache",
      onError: (errors) => {
        startPolling(1000);
        
      },
    }
  );
  const [index, setIndex] = useState(0);
  const [like, likeStatus] = useMutation(LIKE_MUTATION, {
    onError: (err) => {
      console.log(err);
      const postsCollection = posts.data;
      const newData = [...postsCollection];
      newData[index].liked = false;
      const positionOfLike = newData[index].likes.indexOf(userInfo.id);
      newData[id].likes.splice(positionOfLike,1);
      setTimeout(() => {
        dispatch(postUpdate(newData));
      }, 1000);
    },
    update(proxy, result) {
      stopPolling();
    },
    fetchPolicy: "no-cache",
  });

  const [unLike, unlikeStatus] = useMutation(UNLIKE_MUTATION, {
    onError: (err) => {
      console.log(err);
    },
    update(proxy, result) {
      console.log(result);
    },
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    if (error?.graphQLErrors) console.log(error?.graphQLErrors);
    if (error?.networkError) {
      Alert.alert(error?.networkError.message);
    }
    if (data) {
      setDatas(data);
    }
  }, [loading, data, error]);

  useEffect(() => {
    if (datas) {
      dispatch(fetchPosts(datas));
      setDatas(null);
    }
  }, [datas]);

  const handleLike = (id, value) => {
    setIndex(id);
    const postsCollection = posts.data;
    const newData = [...postsCollection];
    const uid = userInfo.id;
    newData[id].liked = value;
    if (value) {
      like({ variables: { postId: String(newData[id].id) } });
      newData[id].likes.unshift(uid);
    } else {
      unLike({ variables: { postId: String(newData[id].id) } });
      const positionOfLike = newData[id].likes.indexOf(uid);
      newData[id].likes.splice(positionOfLike,1);
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
