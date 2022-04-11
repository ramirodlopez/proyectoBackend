import express from "express";
import productsRouter from "./router/products.js";
import cartsRouter from "./router/carts.js";

const app = express();
const PORT = 8080;
app.use(express.json());
app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});

//ROUTER
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
