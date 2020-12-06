const { gql } = require("apollo-server");

module.exports = gql`
  type Post {
    id: ID!
    caption: String!
    image: String!
    createdAt: String!
    comments:[Comment]
    user:User!
    likes:[Like]
    likesCount:Int!
    commentsCount: Int!
  }
  type Comment {
    _id: ID!
    createdAt: String!
    userName: String!
    body: String!
  }
  type Like{
    _id:ID!
    userName: String!
    userId:ID!
    createdAt: String!
  }
  type User {
    id: ID!
    email: String!
    token: String!
    userName: String!
    photoUrl: String!
    createdAt: String!
  }
  input RegisterInput {
    userName: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type Query {
    getPosts: [Post]
    getMyPosts: [Post]
    getNews:[Post]
    getPost(postId: ID!): Post
    getFollowingUsers:[User]
    getUsers:[User]
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(userName: String!, password: String!): User!
    createPost(caption: String!,image: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: ID!,body: String!): Post!
    deleteComment(postId: ID!,commentId: ID!): Post!
    likePost(postId: ID!): Post!
    unLikePost(postId: ID!): Post!
    followUser(userId: ID!): String!
    unFollowUser(userId: ID!): String!
  }
  type Subscription{
    newPost:Post!
    newPostFromFollowings:Post!
  }
`;
