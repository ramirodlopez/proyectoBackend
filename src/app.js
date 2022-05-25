import express from "express";
import productsRouter from "./router/products.js";
import cartsRouter from "./router/carts.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import path from "path";
const advancedOptions = { useNewUrlParser: true, useUniFiedTopology: true };

const app = express();
const PORT = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  if (req.method != "GET" && req.path.includes("/api/products")) {
    if (req.headers.admin == "true") {
      console.log(req.headers.admin);
      next();
    } else {
      res.send({
        status: "Error",
        message: "No posee los permisos necesarios",
      });
    }
  } else {
    next();
  }
});

app.use(cookieParser());
app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://ramiro:ramiro12345@cluster0.so7yn.mongodb.net/coder?retryWrites=true&w=majority",
      mongoOptions: advancedOptions,
      ttl: 30,
    }),
    secret: "secreto",
    resave: true,
    saveUninitialized: true,
  })
);

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
let user;
app.get("/logeo", (req, res) => {
  console.log("session", req.session);
  if (req.session["user"])
    return res.sendFile(path.resolve("./src/views/index.html"));
  console.log("session", req.session);
  res.sendFile(path.resolve("./src/views/login.html"));
});

app.get("/deslogeo", (req, res) => {
  console.log("session", req.session);
  delete req.session["user"];
  console.log("session", req.session);
  res.sendFile(path.resolve("./src/views/logout.html"));
});

app.get("/index", (req, res) => {
  if (req.session["user"]) {
    return res.sendFile(path.resolve("./src/views/index.html"));
  }
  res.sendFile(path.resolve("./src/views/login.html"));
});

app.post("/logeouser", (req, res) => {
  console.log("session", req.session);
  user = req.body.user;
  console.log(user);
  if (user !== "") {
    req.session["user"] = user;
    req.session.cookie.maxAge = 10 * 60 * 1000;
    res.redirect("/index");
  } else {
    res.sendFile(path.resolve("./src/views/login.html"));
  }
  console.log("session", req.session);
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (!err) res.redirect("/deslogeo");
    else res.send({ status: "desLogeo Error", error: err });
  });
});

//ROUTER
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
