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

export const GET_USER_QUERY = gql`
  query GetUser($id: ID!) {
    getUser(userId: $id) {
      id
      email
      userName
      photoUrl
      createdAt
      followers
      followings
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($caption: String!, $image: String!) {
    createPost(caption: $caption, image: $image) {
      id
      caption
      image
      createdAt
      likesCount
      commentsCount
    }
  }
`;

export const UPLOAD_MUTATION = gql`
  mutation upload($file: Upload!) {
    uploadImage(file: $file) {
      url
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

export const SEARCH_QUERY = gql`
  query SearchUsers($keyWord: String!) {
    searchUsers(keyWord: $keyWord) {
      id
      email
      userName
      photoUrl
      createdAt
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
      followers
      followings
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
      followers
      followings
    }
  }
`;

export const FOLLOW_MUTATIONS = gql`
  mutation follow($userId: ID!) {
    followUser(userId: $userId)
  }
`;
export const UNFOLLOW_MUTATIONS = gql`
  mutation unFollow($userId: ID!) {
    unFollowUser(userId: $userId)
  }
`;

export const UPDATE_NETWORK_STATUS = gql`
  mutation updateNetworkStatus($isConnected: Boolean) {
    updateNetworkStatus(isConnected: $isConnected) @client
  }
`;
