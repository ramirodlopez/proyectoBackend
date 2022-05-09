import express from "express";
import fs from "fs";
import { leerArchivoProductos } from "../database/funciones.js";
import ProductDAO from "../database/daos/productDAO.js";

const router = express.Router();

router.get("/:pid?", async (req, res) => {
  const prod = new ProductDAO();
  const items = await prod.getAll(req.params.pid);
  res.send({ items: items, cantidad: items.length });
});

router.post("", async (req, res) => {
  const prod = new ProductDAO();
  await prod.save(req.body);
  res.send(req.body);
});

router.delete("/:pid", async (req, res) => {
  const prod = new ProductDAO();
  const borrar = await prod.deleteById(req.params.pid);
  res.send(`Se borro ${borrar}`);
});

router.put("/:pid", async (req, res) => {
  const prod = new ProductDAO();
  const cambio = req.body;
  const cambiado = await prod.changeById(req.params.pid, cambio);

  res.send("Se actualizo");
});

export default router;
