import mongoose from "mongoose";
import productSchema from "./schema/productSchema.js";

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

  async save(producto) {
    try {
      await this.connectMDB();
      await productSchema.create(producto);
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
      const prod = await productSchema.find(filter);
      mongoose.disconnect();
      return prod;
    } catch (error) {
      throw Error(error.message);
    }
  }

  async getById(id) {
    try {
      await this.connectMDB();
      const prodId = await productSchema.findById(id);
      mongoose.disconnect();
      return prodId;
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
      const borrado = await productSchema.deleteOne({ id });
      mongoose.disconnect();
      return borrado;
    } catch (error) {
      throw Error(error.message);
    }
  }
}
