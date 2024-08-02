import dbConnect from "../../../../src/db/connect";
import Product from "../../../../src/models/product";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Error fetching products" });
    }
  } else if (req.method === "POST") {
    try {
      const { products } = req.body;

      // Validate that products is an array
      if (!Array.isArray(products)) {
        return res.status(400).json({ error: "products must be an array" });
      }

      if (products.length === 0) {
        return res.status(400).json({ error: "products array is empty" });
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
          return res
            .status(400)
            .json({ error: "Invalid product data structure" });
        }

        const productToSave = {
          name: singleProduct.name,
          description: singleProduct.description,
          price: singleProduct.price,
          seller: singleProduct.seller,
          stock: singleProduct.stock,
          category: singleProduct.category,
          images: singleProduct.images,
        };

        try {
          await new Product(productToSave).save();
          newProductCount++;
        } catch (error) {
          console.error(`Error saving product: ${singleProduct.name}`, error);
          // Optionally, you might want to handle partial success and rollback if needed
        }
      }

      res
        .status(201)
        .json({ status: `Inserted ${newProductCount} new products.` });
    } catch (error) {
      console.error("Error saving products:", error);
      res.status(500).json({ error: "Error saving products" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
