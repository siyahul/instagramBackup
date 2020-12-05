const postsResolvers = require("./posts");
const commentResolvers = require("./comment");
const likeResolvers = require("./like");
const usersResolvers = require("./users");
module.exports = {
  Post: {
    likesCount: (parent) => parent.likes.length,
    commentsCount: (parent) => parent.comments.length,
  },
  Query: {
    ...usersResolvers.Query,
    ...postsResolvers.Query
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentResolvers.Mutation,
    ...likeResolvers.Mutation,
  },
  Subscription: {
    ...postsResolvers.Subscription,
  },
};
