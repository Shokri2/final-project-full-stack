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
      return res.status(400).json({
        message: "product name already exist",
      });
    }
    const status = req.user.role === "admin" ? "approved" : "pending";
    const created = await createProduct({
      name,
      description,
      price,
      stock,
      image,
      catid,
      created_by,
      status,
    });
    if (!created) {
      return res.status(400).json({
        message: "something went wrong!",
      });
    }
    return res.status(201).json({
      message: "created successfully",
      product: created,
    });
  } catch (error) {
    console.log("CREATE PRODUCT ERROR:", error);
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};
export const getAllProductsController = async (req, res) => {
  try {
    const products = await getAllProducts();
    if (products.length === 0) {
      return res.status(200).json({
        message: "no products yet in db",
        products: [],
      });
    }
    return res.status(200).json({
      message: "gets successfully",
      products,
    });
  } catch (error) {
    console.log("GET PRODUCTS ERROR:", error);
    return res.status(500).json({
      message: "internal server error",
    });
  }
};
export const getProductByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await getProductById({ id });
    if (products.length === 0) {
      return res.status(404).json({
        message: "product not found",
      });
    }
    return res.status(200).json({
      message: "gets successfully",
      product: products[0],
    });
  } catch (error) {
    console.log("GET PRODUCT BY ID ERROR:", error);
    return res.status(500).json({
      message: "internal server error",
    });
  }
};
export const updateProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { name, description, price, stock, image, catid } = req.body;
    const theProduct = await getProductById({ id });

    if (theProduct.length === 0) {
      return res.status(404).json({
        message: "product not found!",
      });
    }
    const products = await getProductByName(name);
    if (products.length !== 0 && products[0].id != id) {
      return res.status(400).json({
        message: "product name already exist",
      });
    }
    const oldProduct = theProduct[0];
    const newProduct = {
      name: name || oldProduct.name,
      description: description || oldProduct.description,
      price: price ?? oldProduct.price,
      stock: stock ?? oldProduct.stock,
      image: image || oldProduct.image,
      catid: catid ?? oldProduct.catid,
    };
    const status = req.user.role === "admin" ? "approved" : "pending";

    const updated = await updateProduct(
      id,
      userId,
      newProduct.name,
      newProduct.description,
      newProduct.price,
      newProduct.stock,
      newProduct.image,
      newProduct.catid,
      status,
    );
    return res.status(200).json({
      message: "updated successfully",
      product: updated[0],
    });
  } catch (error) {
    console.log("UPDATE PRODUCT ERROR:", error);
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};
export const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteProduct(id);
    if (deleted.length === 0) {
      return res.status(404).json({
        message: "product not found",
      });
    }
    return res.status(200).json({
      message: "deleted successfully",
      product: deleted[0],
    });
  } catch (error) {
    console.log("DELETE PRODUCT ERROR:", error);
    return res.status(500).json({
      message: "internal server error",
    });
  }
};
export const updateProductStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const userId = req.user.id;
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "only admin can update product status",
      });
    }
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "invalid status",
      });
    }
    const product = await getProductById({ id });
    if (product.length === 0) {
      return res.status(404).json({
        message: "product not found",
      });
    }
    const updated = await updateProductStatus(id, status, userId);
    return res.status(200).json({
      message: "status updated successfully",
      product: updated[0],
    });
  } catch (error) {
    console.log("UPDATE STATUS ERROR:", error);
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};
