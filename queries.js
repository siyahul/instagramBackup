
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