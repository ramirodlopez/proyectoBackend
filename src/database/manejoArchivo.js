const fs = require("fs");

const productosArr = [];

class Archivo {
  constructor(nombre) {
    this.nombre = nombre;
  }

  async leer() {
    try {
      const content = await fs.promises.readFile(this.nombre, "utf-8");
      if (content) return content;
    } catch (error) {
      console.error([]);
    }
  }

  async guardar(producto) {
    try {
      producto.id = productosArr.length + 1;
      productosArr.push(producto);
      await fs.promises.writeFile(this.nombre, JSON.stringify(productosArr));
    } catch (error) {
      console.error(`No se pudo leer el archivo. Error: ${error}`);
    }
  }
  async borrar() {
    try {
      fs.unlink(this.nombre, (err) =>
        console.error(`El archivo no existe. ${err}`)
      );
    } catch (error) {
      console.error(`Ocurrió un error. Error: ${error}`);
    }
  }
}

const archivo = new Archivo("productos.txt");

archivo.guardar({ title: "prod1", price: 500, thumbnail: "url1" });
archivo.guardar({ title: "prod2", price: 1500, thumbnail: "url2" });
archivo.guardar({ title: "prod3", price: 2000, thumbnail: "url3" });
archivo.leer();
console.log(productosArr);
