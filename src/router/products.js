import express from "express";
import fs from "fs";
import ProductDAO from "../database/daos/productDAO.js";

const router = express.Router();

router.get("/:pid?", async (req, res) => {
  const prod = new ProductDAO();
  const items = await prod.getAll(req.params.pid);
  let prodExiste = await prod.getById(items);
  if (prodExiste != undefined) {
    res.send({ items: items, cantidad: items.length });
  } else {
    res.send("Producto erroneo");
  }
});

router.post("", async (req, res) => {
  const prod = new ProductDAO();
  await prod.save(req.body);
  res.send(req.body);
});

router.delete("/:pid", async (req, res) => {
  const prod = new ProductDAO();
  const items = await prod.getAll(req.params.pid);
  let prodExiste = await prod.getById(items);
  if (prodExiste != undefined) {
    const borrar = await prod.deleteById(req.params.pid);
    res.send(`Se borro ${borrar}`);
  } else {
    res.send("Producto erroneo");
  }
});

router.put("/:pid", async (req, res) => {
  const prod = new ProductDAO();
  const items = await prod.getAll(req.params.pid);
  let prodExiste = await prod.getById(items);
  if (prodExiste != undefined) {
    const cambio = req.body;
    const cambiado = await prod.changeById(req.params.pid, cambio);
    res.send("Se actualizo");
  } else {
    res.send("Producto erroneo");
  }
});

export default router;
