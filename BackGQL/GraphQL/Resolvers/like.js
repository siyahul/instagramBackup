const Post = require("../../Models/postModel");
const checkAuth = require("../../utils/auth-verify");
const User = require("../../Models/userModel");

module.exports = {
  Mutation: {
    async likePost(_, { postId }, context) {
      const user = checkAuth(context);
      const post = await Post.findById(postId);
      console.log(user.id);
      if (post) {
        const alreadyLiked = post.likes.find(
          (like) => like.userId === user.id
        );
        if (!alreadyLiked) {
          post.likes.unshift({
            userId: user.id,
            userName: user.userName,
            createdAt: new Date().toISOString(),
          });
          const newPost = await post.save();
          const postUser = await User.findById(post.user);
          const {
            id,
            caption,
            createdAt,
            comments,
            image,
            likes,
            likesCount,
            commentsCount,
          } = newPost;
          return {
            id,
            caption,
            createdAt,
            comments,
            likes,
            image,
            likesCount,
            commentsCount,
            user:postUser,
          };
        } else {
          throw new Error("you are already liked");
        }
      } else {
        throw new Error("Post not found");
      }
    },
    async unLikePost(_, { postId }, context) {
      const user = checkAuth(context);
      const post = await Post.findById(postId);
      if (post) {
        const likeIndex = post.likes.indexOf(
          post.likes.find((like) => like.userId === user.id)
        );
        if (likeIndex >= 0) {
          post.likes.splice(likeIndex, 1);
          const newPost = await post.save();
          const postUser = await User.findById(post.user);
          const {
            id,
            caption,
            createdAt,
            comments,
            image,
            likes,
            likesCount,
            commentsCount,
          } = newPost;
          return {
            id,
            caption,
            createdAt,
            comments,
            likes,
            image,
            likesCount,
            commentsCount,
            user:postUser,
          };
        } else {
          throw new Error("you are not liked this post");
        }
      } else {
        throw new Error("Post not found");
      }
    },
  },
};
