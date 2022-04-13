import express from "express";
import productsRouter from "./router/products.js";
import cartsRouter from "./router/carts.js";

const app = express();
const PORT = 8080;

app.use(express.json());

app.use(function (req, res, next) {
  if (req.method != "GET" && req.path == "/api/products") {
    if (req.headers.admin) {
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

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});

//ROUTER
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
