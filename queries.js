/* 
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

const GET_NEWS_SUBSCRIPTION = gql`
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

const LOGIN = gql`
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
 */

const query = {
  query: `
 mutation Login($userName: String!, $password: String!) {
   login(userName: $userName, password: $password) {
     token
     id
     email
     userName
     createdAt
   }
 }
 `,
  variables: {
    userName: "siyahulhaq",
    password: "123456",
  },
};

console.log(JSON.stringify(query))