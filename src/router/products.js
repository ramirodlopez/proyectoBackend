import express from "express";
import fs from "fs";
import { isAdmin } from "../database/funciones.js";

const router = express.Router();

router.get("/:pid?", async (req, res) => {
  const content = await fs.promises.readFile(
    "./src/database/products.txt",
    "utf-8"
  );
  let parseado = JSON.parse(content);
  if (req.params.pid) {
    parseado = parseado.find((p) => p.id == req.params.pid);
  }

  res.send({ items: parseado, cantidad: parseado.length });
});

router.post("", async (req, res) => {
  if (isAdmin(req.headers.admin)) {
    const content = await fs.promises.readFile(
      "./src/database/products.txt",
      "utf-8"
    );
    let parseado = JSON.parse(content);
    let newProduct = req.body;
    newProduct.id = parseado.length + 1;
    parseado = [...parseado, newProduct]; // IGUAL PUSH
    //meter dentro del archivo productos.txt
    await fs.promises.writeFile(
      "./src/database/products.txt",
      JSON.stringify(parseado)
    );
    res.send(newProduct);
  } else {
    res.send({
      status: "Error",
      message: "No posee los permisos necesarios",
    });
  }
});

router.delete("/:pid", async (req, res) => {
  if (isAdmin(req.headers.admin)) {
    const content = await fs.promises.readFile(
      "./src/database/products.txt",
      "utf-8"
    );
    let parseado = JSON.parse(content);
    if (req.params.pid) {
      parseado = parseado.filter((p) => p.id != req.params.pid);
    }
    //meter dentro del archivo productos.txt
    await fs.promises.writeFile(
      "./src/database/products.txt",
      JSON.stringify(parseado)
    );
    res.send("Se borro");
  } else {
    res.send({
      status: "Error",
      message: "No posee los permisos necesarios",
    });
  }
});

router.put("/:pid", async (req, res) => {
  if (isAdmin(req.headers.admin)) {
    const content = await fs.promises.readFile(
      "./src/database/products.txt",
      "utf-8"
    );
    let parseado = JSON.parse(content);
    if (req.params.pid) {
      let modificado = parseado.find((p) => p.id == req.params.pid);
      let pos = parseado.indexOf(modificado);
      let actProduct = req.body;
      parseado[pos].title = actProduct.title;
      parseado[pos].price = actProduct.price; //VER COMO DECTECTAR SOLO LO Q SE PASA POR BODY
      parseado[pos].thumbnail = actProduct.thumbnail;
    }
    //meter dentro del archivo productos.txt
    await fs.promises.writeFile(
      "./src/database/products.txt",
      JSON.stringify(parseado)
    );

    res.send("Se actualizo");
  } else {
    res.send({
      status: "Error",
      message: "No posee los permisos necesarios",
    });
  }
});

export default router;
