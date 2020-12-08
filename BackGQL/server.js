const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require("mongoose");
const typeDefs = require("./GraphQL/typedefs");
const resolvers = require("./GraphQL/Resolvers");
const { MONGODB } = require("./config");
const checkAuth = require("./utils/auth-verify");

mongoose
  .connect(MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log(err);
  });
const pubSub = new PubSub();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, connection }) => ({ req, pubSub, connection }),
  subscriptions: {
    onConnect: ({authorization}) => {
      const context = {
        req: {
          headers: {
            authorization,
          },
        },
      };
      const user = checkAuth(context);
      console.log(user);
      return {
        currentUser: user,
      };
    },
  },
});

server
  .listen({ port: 5000 })
  .then((res) => console.log(`server started ${res.url}`));
