import express from "express";
import fs from "fs";
import ContenedorCarrito from "./database/carrito.js";

const app = express();
const PORT = 8080;
app.use(express.json());
app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});

//P R O D U C T O S

//GET
app.get("/api/productos/:pid?", async (req, res) => {
  const content = await fs.promises.readFile(
    "./src/database/productos.txt",
    "utf-8"
  );
  let parseado = JSON.parse(content);
  if (req.params.pid) {
    parseado = parseado.find((p) => p.id == req.params.pid);
  }
  res.send({ items: parseado, cantidad: parseado.length });
});

//POST
app.post("/api/productos", async (req, res) => {
  const content = await fs.promises.readFile(
    "./src/database/productos.txt",
    "utf-8"
  );
  let parseado = JSON.parse(content);
  let newProduct = req.body;
  newProduct.id = parseado.length + 1;
  parseado = [...parseado, newProduct]; // IGUAL PUSH
  //meter dentro del archivo productos.txt
  await fs.promises.writeFile(
    "./src/database/productos.txt",
    JSON.stringify(parseado)
  );
  res.send(newProduct);
});

//DELETE
app.delete("/api/productos/:pid", async (req, res) => {
  const content = await fs.promises.readFile(
    "./src/database/productos.txt",
    "utf-8"
  );
  let parseado = JSON.parse(content);
  if (req.params.pid) {
    parseado = parseado.filter((p) => p.id != req.params.pid);
  }
  //meter dentro del archivo productos.txt
  await fs.promises.writeFile(
    "./src/database/productos.txt",
    JSON.stringify(parseado)
  );
  res.send("Se borro");
});

//PUT
app.put("/api/productos/:pid", async (req, res) => {
  const content = await fs.promises.readFile(
    "./src/database/productos.txt",
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
    "./src/database/productos.txt",
    JSON.stringify(parseado)
  );

  res.send("Se actualizo");
});

// C A R R I T O

//POST
app.post("/api/carrito", async (req, res) => {
  let carrito = new Object();
  let test = new ContenedorCarrito();
  carrito.title = req.body.title;
  let id = test.crear(carrito);

  console.log(`carritoAgregadoConId: ${id}`);
  res.json({ carritoAgregadoConId: `${id}` });
});
