import { gql } from "@apollo/client";

export const FETCH_NEWS_QUERY = gql`
query GetNews($no:Int!,$lastPostId:String!){
  getNews(no:$no,lastPostId:$lastPostId) {
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

export const LIKE_MUTATION = gql`
mutation LikePost($postId: ID!) {
  likePost(postId: $postId) {
    user {
      id
    }
  }
}
`;

export const UNLIKE_MUTATION = gql`
mutation LikePost($postId: ID!) {
  unLikePost(postId: $postId) {
    user {
      id
    }
  }
}
`;

export const GET_NEWS_SUBSCRIPTION = gql`
subscription {
  newPostFromFollowings {
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

export const LOGIN_MUTATION = gql`
  mutation Login($userName: String!, $password: String!) {
    login(userName: $userName, password: $password) {
      token
      id
      email
      userName
      createdAt
    }
  }
`;
 

export const UPDATE_NETWORK_STATUS = gql`
  mutation updateNetworkStatus($isConnected: Boolean) {
    updateNetworkStatus(isConnected: $isConnected) @client
  }
`;