import mongoose from "mongoose";
import cartSchema from "./schema/cartSchema.js";
import Products from "./productDAO.js";

const Product = new Products();

export default class ProductDAO {
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

  async save(carrito, id) {
    try {
      let tiempo = new Date();
      await this.connectMDB();
      carrito.timestamp = tiempo.toString();
      carrito.id = id;
      await cartSchema.create(carrito);

      mongoose.disconnect();
      return;
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
