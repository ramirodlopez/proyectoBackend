import express from "express";
import fs from "fs";
import CartDAO from "../database/daos/cartDAO.js";
import ProductDAO from "../database/daos/productDAO.js";

const router = express.Router();

router.post("", async (req, res) => {
  const cart = new CartDAO();
  await cart.save(req.body);
  res.send(req.body);
});

router.delete("/:cid", async (req, res) => {
  const cart = new CartDAO();
  const carrito = await cart.getAll(req.params.cid);
  let cartExiste = await cart.getById(carrito);
  if (cartExiste != undefined) {
    const borrar = await cart.deleteById(req.params.cid);
    res.send(`Se borro ${borrar}`);
  } else {
    res.send("Carrito erroneo");
  }
});

router.get("/:cid/products", async (req, res) => {
  const cart = new CartDAO();
  const carrito = await cart.getAll(req.params.cid);
  let cartExiste = await cart.getById(carrito);
  console.log(cartExiste);
  if (cartExiste != undefined) {
    res.send({ cart: carrito });
  } else {
    res.send("Carrito erroneo");
  }
});

router.post("/:cid/products", async (req, res) => {
  let idsProduct = req.body.id;
  const prod = new ProductDAO();
  const items = await prod.getAll(idsProduct);
  const itemElegido = await prod.getById(items[0]._id);
  if (itemElegido.stock > 0) {
    itemElegido.stock--;
    await prod.changeById(itemElegido.id, itemElegido);
    const cart = new CartDAO();
    let carrito = await cart.getAll(req.params.cid);
    let cartExiste = await cart.getById(carrito);
    if (cartExiste != undefined) {
      let carritoNew = carrito[0].producto.find((p) => p.id == idsProduct);
      if (carritoNew != undefined) {
        carritoNew.quantity = carritoNew.quantity + 1;
        let carritoMod = carrito[0].producto.filter((p) => p.id != idsProduct);
        carritoMod.push(carritoNew);
        carritoNew = carritoMod;

        await cart.updateProduct(req.params.cid, carritoNew);
      } else {
        delete itemElegido._doc.stock;
        await cart.saveProduct(itemElegido, req.params.cid);
      }
      res.send("se agrego");
    } else {
      res.send("Carrito erroneo");
    }
  } else {
    res.send(`No hay stock de ${itemElegido.id}`);
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  let idProduct = req.params.pid;
  const prod = new ProductDAO();
  const items = await prod.getAll(idProduct);
  let itemElegido = items[0];
  const cart = new CartDAO();
  let carrito = await cart.getAll(req.params.cid);
  let cartExiste = await cart.getById(carrito);
  if (cartExiste != undefined) {
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
      } else {
        carritoNew = carrito[0].producto.filter((p) => p.id != req.params.pid);
      }
    }
    await cart.deleteUpdateProduct(req.params.cid, carritoNew);
    res.send("se borro");
  } else {
    res.send("Carrito erroneo");
  }
});

export default router;
