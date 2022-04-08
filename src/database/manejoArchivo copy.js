const fs = require("fs");

const carrito = [];

class Carrito {
  constructor(id) {
    this.id = id;
  }

  async crear(id) {
    try {
      id = carrito.length + 1;
      await fs.promises.writeFile(this.id, JSON.stringify(carrito));
    } catch (error) {
      console.error(`No se pudo leer el archivo. Error: ${error}`);
    }
  }
}
