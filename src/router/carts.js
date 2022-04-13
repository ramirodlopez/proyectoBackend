import express from "express";
import fs from "fs";
import { crear } from "../database/funciones.js";
import {
  leerArchivoCarrito,
  leerArchivoProductos,
} from "../database/funciones.js";

const router = express.Router();

router.post("", async (req, res) => {
  let carrito = { title: req.body.title };
  let id = crear(carrito);

  console.log(`carritoAgregadoConId: ${id}`);
  res.json({ carritoAgregadoConId: `${id}` });
});
router.delete("/:cid", async (req, res) => {
  const content = await leerArchivoCarrito();
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
  const content = await leerArchivoCarrito();
  let parseado = JSON.parse(content);
  if (req.params.cid) {
    parseado = parseado.find((p) => p.id == req.params.cid);
  }
  res.send({ productos: parseado.producto });
});

router.post("/:cid/products", async (req, res) => {
  //CARRITO
  const content = await leerArchivoCarrito();
  let parseadoc = JSON.parse(content);
  let carritoMod;
  if (req.params.cid) {
    carritoMod = parseadoc.find((p) => p.id == req.params.cid);
  }

  //PRODUCTO
  const contente = await leerArchivoProductos();
  let parseadop = JSON.parse(contente);
  let idsProduct = req.body.id;
  console.log(idsProduct);
  let newProduct;
  let newProducts = [];

  for (let i = 0; i < idsProduct.length; i++) {
    newProduct = parseadop.find((p) => p.id == idsProduct[i]);
    if (newProduct != undefined && newProduct.stock > 0) {
      newProduct.stock--;
      const { stock, ...attrNewProduct } = newProduct;

      newProducts.push({ ...attrNewProduct, quantity: 1 });
    }
  }

  if (carritoMod != undefined) {
    for (let j = 0; j < newProducts.length; j++) {
      const existenP = carritoMod.producto.find(
        (p) => p.id == newProducts[j].id
      );
      if (existenP != undefined) {
        existenP.quantity++;
      } else {
        carritoMod.producto.push(newProducts[j]);
      }
    }
  }

  //meter dentro del producto dentro de carrito.txt
  await fs.promises.writeFile(
    "./src/database/carts.txt",
    JSON.stringify(parseadoc)
  );
  await fs.promises.writeFile(
    "./src/database/products.txt",
    JSON.stringify(parseadop)
  );

  res.send("Se agregaron los productos al carrito");
});

router.delete("/:cid/products/:pid", async (req, res) => {
  //CARRITO
  let carritoAModificar;
  const content = await leerArchivoCarrito();
  const listaDeCarritos = JSON.parse(content);
  if (req.params.cid) {
    carritoAModificar = listaDeCarritos.find((p) => p.id == req.params.cid);
  }

  //PRODUCTO
  let productoConStock;
  const reqProducto = req.params.pid;
  const contente = await leerArchivoProductos();
  const listDeProductos = JSON.parse(contente);
  if (reqProducto) {
    productoConStock = listDeProductos.find((p) => p.id == reqProducto);
  }

  const productoAModificar = carritoAModificar.producto.find(
    (p) => p.id == reqProducto
  );

  if (productoAModificar != undefined) {
    if (productoAModificar.quantity > 1) {
      productoAModificar.quantity--;
    } else {
      const productosDeCarritoActualizado = carritoAModificar.producto.filter(
        (p) => p.id != reqProducto
      );
      carritoAModificar.producto = productosDeCarritoActualizado;
    }

    // suponiendo que esto existe en el archivo products.txt
    productoConStock.stock++;
  } // sino podríamos explotar o salir porque no exite el producto

  //meter dentro del producto dentro de carrito.txt
  await fs.promises.writeFile(
    "./src/database/carts.txt",
    JSON.stringify(listaDeCarritos)
  );

  await fs.promises.writeFile(
    "./src/database/products.txt",
    JSON.stringify(listDeProductos)
  );

  res.send("Se saco el producto al carrito");
});

export default router;
