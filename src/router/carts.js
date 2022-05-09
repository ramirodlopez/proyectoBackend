import express from "express";
import fs from "fs";
import { crear } from "../database/funciones.js";
import CartDAO from "../database/daos/cartDAO.js";
import ProductDAO from "../database/daos/productDAO.js";
import {
  leerArchivoCarrito,
  leerArchivoProductos,
} from "../database/funciones.js";

const router = express.Router();

router.post("", async (req, res) => {
  const cart = new CartDAO();
  const cartId = await cart.getAll();
  await cart.save(req.body, cartId.length);
  res.send(req.body);
});

router.delete("/:cid", async (req, res) => {
  const cart = new CartDAO();
  const borrar = await cart.deleteById(req.params.cid);
  res.send(`Se borro ${borrar}`);
});

router.get("/:cid/products", async (req, res) => {
  let idid = 123;
  const cart = new CartDAO();
  const carrito = await cart.getAll(req.params.cid);
  //testeos rami
  let carritoNew = carrito[0].producto.find((p) => p.id == idid);
  console.log(carritoNew);
  res.send({ cart: carrito });
});

router.post("/:cid/products", async (req, res) => {
  let idsProduct = req.body.id;
  const prod = new ProductDAO();
  const items = await prod.getAll(idsProduct);
  const itemElegido = await prod.getById(items[0]._id);
  if (itemElegido.stock > 0) {
    itemElegido.stock--;
  } else {
    res.send(`No hay stock de ${itemElegido.id}`);
  }
  await prod.changeById(itemElegido.id, itemElegido);
  console.log(itemElegido.stock);
  const cart = new CartDAO();
  let carrito = await cart.getAll(req.params.cid);
  let carritoNew = carrito[0].producto.find((p) => p.id == req.body.id);
  if (carritoNew != undefined) {
    carritoNew.quantity = carritoNew.quantity + 1;
    let carritoMod = carrito[0].producto.filter((p) => p.id != req.body.id);
    carritoMod.push(carritoNew);
    carritoNew = carritoMod;
    console.log(carritoNew);
    await cart.updateProduct(req.params.cid, carritoNew);
  } else {
    await cart.saveProduct(itemElegido, req.params.cid);
  }

  res.send("se agrego");
});

router.delete("/:cid/products/:pid", async (req, res) => {
  let idProduct = req.params.pid;
  const prod = new ProductDAO();
  const items = await prod.getAll(idProduct);
  const cart = new CartDAO();
  let carrito = await cart.getAll(req.params.cid);
  let carritoNew = carrito[0].producto.find((p) => p.id == req.params.pid);
  if (carritoNew != undefined) {
    if (carritoNew.quantity > 1) {
      carritoNew.quantity = carritoNew.quantity - 1;
      let carritoMod = carrito[0].producto.filter(
        (p) => p.id != req.params.pid
      );
      carritoMod.push(carritoNew);
      carritoNew = carritoMod;
      console.log(carritoNew);
    } else {
      carritoNew = carrito[0].producto.filter((p) => p.id != req.params.pid);
    }
  }
  await cart.deleteUpdateProduct(req.params.cid, carritoNew);
  res.send("se borro");
});

export default router;
