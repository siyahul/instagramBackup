import React, { memo, useEffect, useState } from "react";
import { FlatList } from "react-native";
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
  mutation LikePost($postId: ID!){
    likePost(postId:$postId){
      user{
        id
      }
    }
  }
`;

const UNLIKE_MUTATION = gql`
  mutation LikePost($postId: ID!){
    unLikePost(postId:$postId){
      user{
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
  const { loading, data, error } = useQuery(FETCH_NEWS_QUERY, {
    fetchPolicy: "no-cache",
    onError: (errors) => {
      console.log(errors);
    },
  });

  const [like,ldng] = useMutation(LIKE_MUTATION,{
    onError:(err)=>{
      console.log(err.stack);
    },
    update(proxy,result){
      console.log(result);
    }
  })

  const [unLike] = useMutation(UNLIKE_MUTATION,{
    onError:(err)=>{
      console.log(err.stack);
    },
    update(proxy,result){
      console.log(result);
    }
  })

  const likeLoading = ldng.loading;

  useEffect(() => {
    console.log(loading);
    if (error?.graphQLErrors) console.log(error?.graphQLErrors);
    if (error?.networkError) {
      console.log("network error");
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
    const postsCollection = posts.data;
    const newData = [...postsCollection];
    const uid = userInfo.id;
    newData[id].liked = value;
    if (value) {
      like({variables:{postId: String(newData[id].id)}});
      newData[id].likes.unshift(uid);
    }else{
      unLike({variables:{postId: String(newData[id].id)}});
      const index = newData[id].likes.indexOf(uid);
      newData[id].likes.splice(index, 1);
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
