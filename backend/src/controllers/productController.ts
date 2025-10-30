import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { Review } from '../models/Review';

// Get all products with filters, sorting, and pagination
export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      minPrice,
      maxPrice,
      sort = '-createdAt',
      featured,
      inStock,
    } = req.query;

    const query: any = { isActive: true };

    // Category filter
    if (category) {
      query.categoryId = category;
    }

    // Search filter
    if (search) {
      query.$text = { $search: search as string };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Featured filter
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // In stock filter
    if (inStock === 'true') {
      query.inStock = true;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('categoryId', 'name slug')
        .sort(sort as string)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message,
    });
  }
};

// Get single product by slug
export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ slug, isActive: true })
      .populate('categoryId', 'name slug')
      .lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Increment view count
    await Product.findByIdAndUpdate(product._id, { $inc: { viewCount: 1 } });

    // Get related products
    const relatedProducts = await Product.find({
      categoryId: product.categoryId,
      _id: { $ne: product._id },
      isActive: true,
    })
      .limit(4)
      .lean();

    res.json({
      success: true,
      data: {
        product,
        relatedProducts,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message,
    });
  }
};

// Get featured products
export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 8;

    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate('categoryId', 'name slug')
      .sort('-soldCount')
      .limit(limit)
      .lean();

    res.json({
      success: true,
      data: products,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching featured products',
      error: error.message,
    });
  }
};

// Get best selling products
export const getBestSellers = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 8;

    const products = await Product.find({ isActive: true })
      .populate('categoryId', 'name slug')
      .sort('-soldCount')
      .limit(limit)
      .lean();

    res.json({
      success: true,
      data: products,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching best sellers',
      error: error.message,
    });
  }
};

// Get new arrivals
export const getNewArrivals = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 8;

    const products = await Product.find({ isActive: true })
      .populate('categoryId', 'name slug')
      .sort('-createdAt')
      .limit(limit)
      .lean();

    res.json({
      success: true,
      data: products,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching new arrivals',
      error: error.message,
    });
  }
};

// Admin: Create product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error creating product',
      error: error.message,
    });
  }
};

// Admin: Update product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error updating product',
      error: error.message,
    });
  }
};

// Admin: Delete product (soft delete)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message,
    });
  }
};

// Admin: Update stock
export const updateStock = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity, operation = 'set' } = req.body; // 'set', 'add', 'subtract'

    let updateQuery: any = {};

    if (operation === 'set') {
      updateQuery = { stockQuantity: quantity };
    } else if (operation === 'add') {
      updateQuery = { $inc: { stockQuantity: quantity } };
    } else if (operation === 'subtract') {
      updateQuery = { $inc: { stockQuantity: -quantity } };
    }

    const product = await Product.findByIdAndUpdate(
      id,
      updateQuery,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: product,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error updating stock',
      error: error.message,
    });
  }
};
