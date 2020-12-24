const http = require("http");
const { ApolloServer, PubSub } = require("apollo-server-express");
const mongoose = require("mongoose");
const typeDefs = require("./GraphQL/typedefs");
const resolvers = require("./GraphQL/Resolvers");
//const { MONGODB } = require("./config");
const checkAuth = require("./utils/auth-verify");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const fileupload = require("express-fileupload");
const serverAddress = require("./serverAddress");

mongoose
  .connect(
    "mongodb+srv://admin:QsZaW1508@cluster0.sd3ae.mongodb.net/Instagram?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
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
    onDisconnect: () => {
      console.log("disconnected");
    },
    onConnect: (con) => {
      console.log(con);
      const {
        headers: { authorization },
      } = con;
      const context = {
        req: {
          headers: {
            authorization,
          },
        },
      };
      const user = checkAuth(context);
      console.log(user.email, "connected");
      return {
        currentUser: user,
      };
    },
  },
});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);
server.applyMiddleware({ app });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileupload());
app.post("/upload", (req, res) => {
  const image = req.files.file;
  console.log(image);
  const ext = image.mimetype.split("/").pop();
  const fileTarget = "images/" + Date.now() + "." + ext;
  image.mv("public/" + fileTarget, (err, done) => {
    if (!err) {
      res.status(201).json({url: `http://${serverAddress}:5000/`+fileTarget});
    } else {
      res.status(401).json({ error: "File upload error"});
    }
  });
});

app.use(express.static("public"));

httpServer.listen({ port: 5000 }, () => {
  console.log(`server started on 5000`);
});
