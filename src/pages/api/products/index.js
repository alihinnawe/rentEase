import dbConnect from "../../../../src/db/connect";
import Product from "../../../../src/models/product";

export default async function handler(request, response) {
  await dbConnect();

  try {
    console.log("Request method:", request.method);
    console.log("Request body:", request.body);

    if (request.method !== "POST") {
      return response.status(405).json({ message: "Method not allowed" });
    }

    const { products } = request.body;

    // Validate that products is an array
    if (!Array.isArray(products)) {
      return response.status(400).json({ error: "products must be an array" });
    }

    if (products.length === 0) {
      return response.status(400).json({ error: "products array is empty" });
    }

    let newProductCount = 0;

    for (const singleProduct of products) {
      // Ensure each singleProduct object has the expected properties
      if (
        !singleProduct.name ||
        !singleProduct.description ||
        !singleProduct.price ||
        !singleProduct.seller ||
        !singleProduct.stock ||
        !singleProduct.category
      ) {
        return response
          .status(400)
          .json({ error: "Invalid product data structure" });
      }

      const ProductToSave = {
        name: singleProduct.name,
        description: singleProduct.description,
        price: singleProduct.price,
        seller: singleProduct.seller,
        stock: singleProduct.stock,
        category: singleProduct.category,
      };

      try {
        await new Product(ProductToSave).save();
        newProductCount++;
      } catch (error) {
        console.error(`Error saving product: ${singleProduct.name}`, error);
      }
    }

    return response
      .status(201)
      .json({ status: `Inserted ${newProductCount} new products.` });
  } catch (error) {
    console.error("Unhandled error:", error);
    return response.status(500).json({ error: error.message });
  }
}
