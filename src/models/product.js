import mongoose from "mongoose";
const { Schema } = mongoose;

// Define the schema for Product
const ProductSchema = new Schema({
  name: { type: String, required: [true, "Please enter product name"] },
  description: {
    type: String,
    required: [true, "Please enter product description"],
  },
  price: { type: Number, required: [true, "Please enter product price"] },
  images: [
    {
      public_id: { type: String },
      url: { type: String },
    },
  ],
  category: {
    type: String,
    required: [true, "Please enter product category"],
    enum: {
      values: [
        "Electronics",
        "Cameras",
        "Laptops",
        "Accessories",
        "Headphones",
        "Sports",
      ],
      message: "Please select a correct category",
    },
  },
  seller: { type: String, required: [true, "Please enter product seller"] },
  stock: { type: Number, required: [true, "Please enter product stock"] },
  ratings: { type: Number, default: 0 },
  reviews: [
    {
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

// Define the Product model, or use the existing one
const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
