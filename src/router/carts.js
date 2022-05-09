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
  await cart.save(req.body);
  res.send(req.body);
});

router.delete("/:cid", async (req, res) => {
  const cart = new CartDAO();
  const borrar = await cart.deleteById(req.params.cid);
  res.send(`Se borro ${borrar}`);
});

router.get("/:cid/products", async (req, res) => {
  const cart = new CartDAO();
  const carrito = await cart.getAll(req.params.cid);
  res.send({ cart: carrito });
});

router.post("/:cid/products", async (req, res) => {
  let idsProduct = req.body.id;
  const prod = new ProductDAO();
  for (let idProducto of idsProduct) {
    const items = await prod.getAll(idProducto);
    const itemElegido = items[0];
    if (itemElegido.stock > 0) {
      itemElegido.stock--;
      await prod.changeById(itemElegido.id, itemElegido);

      const cart = new CartDAO();
      let carrito = await cart.getAll(req.params.cid);
      let carritoNew = carrito[0].producto.find((p) => p.id == idProducto);
      if (carritoNew != undefined) {
        carritoNew.quantity = carritoNew.quantity + 1;
        let carritoMod = carrito[0].producto.filter((p) => p.id != idProducto);
        carritoMod.push(carritoNew);
        carritoNew = carritoMod;

        await cart.updateProduct(req.params.cid, carritoNew);
      } else {
        delete itemElegido._doc.stock;
        await cart.saveProduct(itemElegido, req.params.cid);
      }
    } else {
      res.send(`No hay stock de ${itemElegido.id}`);
    }
  }
  res.send("se agrego");
});

router.delete("/:cid/products/:pid", async (req, res) => {
  let idProduct = req.params.pid;
  const prod = new ProductDAO();
  const items = await prod.getAll(idProduct);
  let itemElegido = items[0];
  const cart = new CartDAO();
  let carrito = await cart.getAll(req.params.cid);
  let carritoNew = carrito[0].producto.find((p) => p.id == req.params.pid);
  if (carritoNew != undefined) {
    itemElegido.stock++;
    await prod.changeById(itemElegido.id, itemElegido);

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
