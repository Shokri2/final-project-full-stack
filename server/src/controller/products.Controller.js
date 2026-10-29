import {
  createProduct,
  getAllProducts,
  getProductByName,
  getProductById,
  deleteProduct,
  updateProduct,
  updateProductStatus,
} from "../model/products.Model.js";

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, stock, image, catid } = req.body;
    const created_by = req.user.id;

    const products = await getProductByName(name);

    if (products.length !== 0) {
      return res.status(409).json({
        message: "Product name already exists.",
      });
    }

    const created = await createProduct({
      name,
      description,
      price,
      stock,
      image,
      catid,
      created_by,
      status: "approved",
    });

    return res.status(201).json({
      message: "Product created successfully.",
      product: created,
    });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

export const getAllProductsController = async (req, res) => {
  try {
    const products = await getAllProducts();

    return res.status(200).json({
      message: "Products retrieved successfully.",
      products,
    });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

export const getProductByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id) || Number(id) < 1) {
      return res.status(400).json({
        message: "Invalid product ID.",
      });
    }

    const products = await getProductById({ id });

    if (products.length === 0) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      message: "Product retrieved successfully.",
      product: products[0],
    });
  } catch (error) {
    console.error("GET PRODUCT BY ID ERROR:", error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!/^\d+$/.test(id) || Number(id) < 1) {
      return res.status(400).json({
        message: "Invalid product ID.",
      });
    }

    const theProduct = await getProductById({ id });

    if (theProduct.length === 0) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    const oldProduct = theProduct[0];

    const newProduct = {
      name: req.body.name ?? oldProduct.name,
      description: req.body.description ?? oldProduct.description,
      price: req.body.price ?? oldProduct.price,
      stock: req.body.stock ?? oldProduct.stock,
      image: req.body.image ?? oldProduct.image,
      catid: req.body.catid ?? oldProduct.catid,
    };

    const products = await getProductByName(newProduct.name);

    const duplicate = products.some(
      (product) => String(product.id) !== String(id),
    );

    if (duplicate) {
      return res.status(409).json({
        message: "Product name already exists.",
      });
    }

    const updated = await updateProduct(
      id,
      userId,
      newProduct.name,
      newProduct.description,
      newProduct.price,
      newProduct.stock,
      newProduct.image,
      newProduct.catid,
      "approved",
    );

    if (updated.length === 0) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      message: "Product updated successfully.",
      product: updated[0],
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

export const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id) || Number(id) < 1) {
      return res.status(400).json({
        message: "Invalid product ID.",
      });
    }

    const deleted = await deleteProduct(id);

    if (deleted.length === 0) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      message: "Product deleted successfully.",
      product: deleted[0],
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

export const updateProductStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    if (!/^\d+$/.test(id) || Number(id) < 1) {
      return res.status(400).json({
        message: "Invalid product ID.",
      });
    }

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid product status.",
      });
    }

    const products = await getProductById({ id });

    if (products.length === 0) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    const updated = await updateProductStatus(id, status, userId);

    if (updated.length === 0) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      message: "Product status updated successfully.",
      product: updated[0],
    });
  } catch (error) {
    console.error("UPDATE PRODUCT STATUS ERROR:", error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};
