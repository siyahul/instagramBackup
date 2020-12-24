const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../Models/userModel");
const checkAuth = require("../../utils/auth-verify");
const { UserInputError } = require("apollo-server-express");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../utils/validators");
const { SECRET_KEY } = require("../../config");
const authVerify = require("../../utils/auth-verify");

const genarateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      userName: user.userName,
    },
    SECRET_KEY,
    { expiresIn: 60 * 60 }
  );
};

const usersResolvers = {
  Query: {
    async getUser(_,{userId}){
      try {
        const user = await User.findById(userId);
        if(user) {
          return user
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    async searchUsers(_, { keyWord }) {
      try {
        if (keyWord.trim() !== "") {
          keyWord = keyWord.toLowerCase();
          const users = await User.find();
          const usersFromName = users.filter((user) =>
            user.userName.includes(keyWord)
          );
          if (usersFromName.length <= 0) {
            const userFromEmail = users.filter((user) =>
              user.email.includes(keyWord)
            );
            return userFromEmail;
          }
          return usersFromName;
        }else{
          throw new UserInputError("Keyword must be provided")
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async getUsers() {
      try {
        const users = await User.find();
        return users;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getFollowingUsers(_, __, context) {
      const { id } = authVerify(context);
      const user = await User.findById(id);
      const { followings } = user;
      const users = await User.find({ _id: followings });
      return users;
    },
  },
  Mutation: {
    async followUser(_, { userId }, context) {
      console.log(context.req.headers);
      const { id } = checkAuth(context);
      const user = await User.findById(id);
      const followUser = await User.findById(userId);
      if (user && followUser) {
        const isFollowing =
          user.followings.find(
            (following) => String(following) === String(userId)
          ) &&
          followUser.followers.find(
            (follower) => String(follower) === String(user._id)
          );
        if (!isFollowing) {
          user.followings.unshift(followUser._id);
          followUser.followers.unshift(user._id);
          await followUser.save();
          await user.save();
          return "followed user successfully";
        } else {
          throw new Error("You are already following");
        }
      } else {
        throw new Error("User not found");
      }
    },
    async unFollowUser(_, { userId }, context) {
      const { id } = checkAuth(context);
      const user = await User.findById(id);
      const followUser = await User.findById(userId);
      if (user && followUser) {
        const isFollowing =
          user.followings.find(
            (following) => String(following) === String(userId)
          ) &&
          followUser.followers.find(
            (follower) => String(follower) === String(user._id)
          );
        if (isFollowing) {
          const index = user.followings.indexOf(userId);
          user.followings.splice(index, 1);

          const index2 = followUser.followers.indexOf(user._id);
          followUser.followers.splice(index2, 1);

          await user.save();
          await followUser.save();

          return "unFollowed user successfully";
        } else {
          throw new Error("You are not following");
        }
      } else {
        throw new Error("User not found");
      }
    },
    async login(_, { userName, password }) {
      userName = userName.toLowerCase();
      const { errors, valid } = validateLoginInput(userName, password);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      let user;
      const regex = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
      if (userName.match(regex)) {
        user = await User.findOne({ email: userName });
      } else {
        user = await User.findOne({ userName });
      }
      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }
      const matchPassword = await bcrypt.compareSync(password, user.password);
      if (!matchPassword) {
        errors.general = "Password incorrect";
        throw new UserInputError("Wrong Credentials", { errors });
      }
      const token = genarateToken(user);
      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },

    async register(
      _,
      { registerInput: { userName, email, password, confirmPassword } },
      context,
      info
    ) {
      userName = userName.toLowerCase();
      email = email.toLowerCase();
      const { valid, errors } = validateRegisterInput(
        userName,
        email,
        password,
        confirmPassword
      );
      const name = await User.findOne({ userName });
      const emailAddress = await User.findOne({ email });
      if (!valid) {
        throw new UserInputError("Error", { errors });
      }
      if (name) {
        throw new UserInputError("userName is Taken", {
          errors: {
            userName: "user name is taken",
          },
        });
      }
      if (emailAddress) {
        throw new UserInputError("Email is Taken", {
          errors: {
            email: "Email is taken",
          },
        });
      }

      password = await bcrypt.hashSync(password, 12);

      const newUser = new User({
        email,
        userName,
        password,
        photoUrl: "",
        createdAt: new Date().toISOString(),
        followers: [],
        followings: [],
      });
      try {
        var res = await newUser.save();
      } catch (err) {
        throw new Error(err);
      }
      const token = genarateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};

module.exports = usersResolvers;
