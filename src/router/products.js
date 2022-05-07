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
  //const content = await leerArchivoProductos();
  //let parseado = JSON.parse(content);
  //if (req.params.pid) {
  // let modificado = parseado.find((p) => p.id == req.params.pid);
  //let pos = parseado.indexOf(modificado);
  //let actProduct = req.body;
  // parseado[pos].title = actProduct.title;
  //parseado[pos].price = actProduct.price; //VER COMO DECTECTAR SOLO LO Q SE PASA POR BODY
  //parseado[pos].thumbnail = actProduct.thumbnail;
  //parseado[pos].stock = actProduct.stock;
  // }
  //meter dentro del archivo productos.txt
  // await fs.promises.writeFile(
  // "./src/database/products.txt",
  // JSON.stringify(parseado)
  //);
  const prod = new ProductDAO();
  const cambio = req.body;
  const cambiado = await prod.changeById(req.params.pid, cambio);

  res.send("Se actualizo");
});

export default router;
