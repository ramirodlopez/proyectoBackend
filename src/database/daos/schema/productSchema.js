import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, require: true },
  price: { type: Number, require: true },
  thumbnail: { type: String, require: true },
  stock: { type: Number, require: true },
  id: { type: Number, require: true },
  quantity: { type: Number, require: false },
});

export default mongoose.model("products", productSchema);
