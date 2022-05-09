import mongoose from "mongoose";
import cartSchema from "./schema/cartSchema.js";
import Products from "./productDAO.js";

const Product = new Products();

export default class CartDAO {
  async connectMDB() {
    try {
      const URL =
        "mongodb+srv://ramiro:ramiro12345@cluster0.so7yn.mongodb.net/coder";
      let rta = await mongoose.connect(URL, {
        useNewUrlParser: true,
        useUniFiedTopology: true,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async save(carrito) {
    try {
      let tiempo = new Date();
      await this.connectMDB();
      carrito.timestamp = tiempo.toString();
      carrito.id = Date.now();
      await cartSchema.create(carrito);

      mongoose.disconnect();
      return;
    } catch (error) {
      throw Error(error.message);
    }
  }

  async saveProduct(productos, idCarrito) {
    try {
      //let tiempo = new Date();
      await this.connectMDB();
      console.log(idCarrito);
      //producto.time = tiempo.toString();
      if (productos.quantity > 0) {
        productos.quantity += 1;
      } else {
        productos.quantity = 1;
      }
      const nuevo = await cartSchema.updateOne(
        { id: idCarrito },
        {
          $push: {
            producto: productos,
          },
        }
      );
      mongoose.disconnect();
      return nuevo;
    } catch (error) {
      throw Error(error.message);
    }
  }

  async deleteProduct(product, idCarrito) {
    try {
      //let tiempo = new Date();
      await this.connectMDB();
      console.log(idCarrito);
      //producto.time = tiempo.toString();
      const nuevo = await cartSchema.deleteOne(
        {
          id: idCarrito,
        },
        {
          $pull: {
            producto: product.id,
          },
        }
      );
      mongoose.disconnect();
      return nuevo;
    } catch (error) {
      throw Error(error.message);
    }
  }

  async updateProduct(id, cambio) {
    try {
      await this.connectMDB();

      //OSEA EL ERROR ES Q LOGRO ENTRAR EN EL CARRITO Q ES PERO NO EN LOS PRODUCOT[]
      const nuevo = await cartSchema.updateOne(
        { id: id },
        {
          $set: {
            producto: cambio,
          },
        }
      );
      mongoose.disconnect();
      return nuevo;
    } catch (error) {
      throw Error(error.message);
    }
  }

  async deleteUpdateProduct(id, cambio) {
    try {
      await this.connectMDB();
      const nuevo = await cartSchema.updateOne(
        { id: id },
        {
          $set: {
            producto: cambio,
          },
        }
      );
      mongoose.disconnect();
      return nuevo;
    } catch (error) {
      throw Error(error.message);
    }
  }

  async getAll(id) {
    const filter = id ? { id } : {};
    try {
      await this.connectMDB();
      const cart = await cartSchema.find(filter);
      mongoose.disconnect();
      return cart;
    } catch (error) {
      throw Error(error.message);
    }
  }

  async getById(id) {
    try {
      await this.connectMDB();
      const cartId = await cartSchema.findById(id);
      mongoose.disconnect();
      return cartId;
    } catch (error) {
      throw Error(error.message);
    }
  }

  async changeById(id, cambio) {
    try {
      await this.connectMDB();
      const nuevo = await productSchema.updateOne({ id }, { $set: cambio });
      mongoose.disconnect();
      return nuevo;
    } catch (error) {
      throw Error(error.message);
    }
  }

  async deleteById(id) {
    try {
      await this.connectMDB();
      const borrado = await cartSchema.deleteOne({ id });
      mongoose.disconnect();
      return borrado;
    } catch (error) {
      throw Error(error.message);
    }
  }
}
