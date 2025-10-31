import { Request, Response } from 'express';
import { Category } from '../models/Category';
import { uploadBuffer } from '../utils/cloudinary';
import { AuthRequest } from '../middleware/auth';

// Get all categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const { includeInactive } = req.query;
    
    const query: any = {};
    if (includeInactive !== 'true') {
      query.isActive = true;
    }

    const categories = await Category.find(query)
      .populate('parentId', 'name slug')
      .sort('sortOrder name')
      .lean();

    res.json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message,
    });
  }
};

// Get category by slug
export const getCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({ slug, isActive: true })
      .populate('parentId', 'name slug')
      .lean();

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error.message,
    });
  }
};

// Admin: Create category
export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const categoryData = req.body;
    
    // Handle image upload if file is provided
    // @ts-ignore
    if (req.file) {
      // @ts-ignore
      const imageResult = await uploadBuffer(req.file.buffer, { 
        folder: 'apotekku/categories',
        transformation: [
          { width: 400, height: 400, crop: 'limit' },
          { quality: 'auto' }
        ]
      });
      categoryData.image = imageResult.secure_url;
    }

    const category = await Category.create(categoryData);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error creating category',
      error: error.message,
    });
  }
};

// Admin: Update category
export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Handle image upload if file is provided
    // @ts-ignore
    if (req.file) {
      // @ts-ignore
      const imageResult = await uploadBuffer(req.file.buffer, { 
        folder: 'apotekku/categories',
        transformation: [
          { width: 400, height: 400, crop: 'limit' },
          { quality: 'auto' }
        ]
      });
      updateData.image = imageResult.secure_url;
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error updating category',
      error: error.message,
    });
  }
};

// Admin: Delete category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting category',
      error: error.message,
    });
  }
};
