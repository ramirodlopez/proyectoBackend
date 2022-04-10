import fs from "fs";

export function crear(carrito) {
  let arregloOld = [];

  let idMayor = 0;
  let time = Date();

  if (fs.readFileSync("./src/database/carrito.txt", "utf-8") !== "") {
    arregloOld = JSON.parse(
      fs.readFileSync("./src/database/carrito.txt", "utf-8")
    );
  }

  for (let i = 0; i < arregloOld.length; i++) {
    if (arregloOld[i].id > idMayor) {
      idMayor = arregloOld[i].id;
    } else break;
  }
  carrito.id = idMayor + 1;
  carrito.timestamp = time.toString();
  carrito.producto = [];
  arregloOld.push(carrito);

  let carritoJSON = JSON.stringify(arregloOld);
  fs.writeFile("./src/database/carrito.txt", carritoJSON, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Carrito creado correctamente.");
    }
  });
  return carrito.id;
}
