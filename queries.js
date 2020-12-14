import { gql } from "@apollo/client";

export const FETCH_NEWS_QUERY = gql`
  query GetNews($first: Int!, $offset: Int!) {
    getNews(first: $first, offset: $offset) {
      news {
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
      totalCount
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
export const SIGNUP_MUTATION = gql`
  mutation Login(
    $userName: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        userName: $userName
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
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
