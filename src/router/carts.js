import express from "express";
import fs from "fs";
import { crear } from "../database/funciones.js";

const router = express.Router();

router.post("", async (req, res) => {
  let carrito = { title: req.body.title };
  let id = crear(carrito);

  console.log(`carritoAgregadoConId: ${id}`);
  res.json({ carritoAgregadoConId: `${id}` });
});
router.delete("/:cid", async (req, res) => {
  const content = await fs.promises.readFile(
    "./src/database/carts.txt",
    "utf-8"
  );
  let parseado = JSON.parse(content);
  if (req.params.cid) {
    parseado = parseado.filter((p) => p.id != req.params.cid);
  }
  //meter dentro del archivo productos.txt
  await fs.promises.writeFile(
    "./src/database/carts.txt",
    JSON.stringify(parseado)
  );
  res.send("Se borro");
});

router.get("/:cid/products", async (req, res) => {
  const content = await fs.promises.readFile(
    "./src/database/carts.txt",
    "utf-8"
  );
  let parseado = JSON.parse(content);
  if (req.params.cid) {
    parseado = parseado.find((p) => p.id == req.params.cid);
  }
  res.send({ productos: parseado.producto });
});

router.post("/:cid/products", async (req, res) => {
  //CARRITO
  const content = await fs.promises.readFile(
    "./src/database/carts.txt",
    "utf-8"
  );
  let parseadoc = JSON.parse(content);
  let carritoMod;
  if (req.params.cid) {
    carritoMod = parseadoc.find((p) => p.id == req.params.cid);
  }

  //PRODUCTO
  const contente = await fs.promises.readFile(
    "./src/database/products.txt",
    "utf-8"
  );
  let parseadop = JSON.parse(contente);
  let idsProduct = req.body.id;
  console.log(idsProduct);
  let newProduct;
  let newProducts = [];

  for (let i = 0; i < idsProduct.length; i++) {
    newProduct = parseadop.find((p) => p.id == idsProduct[i]);
    if (newProduct != undefined) {
      newProducts.push(newProduct);
    }
  }

  if (carritoMod != undefined) {
    carritoMod.producto.push(...newProducts);
  }

  //meter dentro del producto dentro de carrito.txt
  await fs.promises.writeFile(
    "./src/database/carts.txt",
    JSON.stringify(parseadoc)
  );

  res.send("Se agregaron los productos al carrito");
});

router.delete("/:cid/products/:pid", async (req, res) => {
  //CARRITO
  const content = await fs.promises.readFile(
    "./src/database/carts.txt",
    "utf-8"
  );
  let parseadoc = JSON.parse(content);
  if (req.params.cid) {
    parseadoc = parseadoc.find((p) => p.id == req.params.cid);
  }

  //PRODUCTO
  const contente = await fs.promises.readFile(
    "./src/database/products.txt",
    "utf-8"
  );
  let parseadop = JSON.parse(contente);
  if (req.params.pid) {
    parseadop = parseadop.find((p) => p.id == req.params.pid);
  }

  let parseadoGlobalCarrito = JSON.parse(content);
  for (let i = 0; i < parseadoGlobalCarrito.length; i++) {
    if (parseadoGlobalCarrito[i].id == parseadoc.id) {
      parseadoGlobalCarrito[i].producto = parseadoGlobalCarrito[
        i
      ].producto.filter((p) => p.id != parseadop.id);
    }
  }
  //meter dentro del producto dentro de carrito.txt
  await fs.promises.writeFile(
    "./src/database/carts.txt",
    JSON.stringify(parseadoGlobalCarrito)
  );

  res.send("Se saco el producto al carrito");
});

export default router;
