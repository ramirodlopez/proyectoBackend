import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  id: { type: Number, require: true },
  timestamp: { type: String, require: true },
  producto: { type: Array, require: true },
});

export default mongoose.model("carts", cartSchema);
