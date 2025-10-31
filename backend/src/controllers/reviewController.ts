import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Review } from '../models/Review';
import { Product } from '../models/Product';
import { Order } from '../models/Order';

// Create review
export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const customerId = req.user?.id;
    const { productId, orderId, rating, title, comment, images } = req.body;

    // Check if customer has purchased this product
    const order = await Order.findOne({
      _id: orderId,
      customerId,
      'items.productId': productId,
      status: 'delivered',
    });

    const review = await Review.create({
      productId,
      customerId,
      orderId,
      rating,
      title,
      comment,
      images,
      isVerifiedPurchase: !!order,
      isApproved: true, // Auto-approve, can be changed to require moderation
    });

    // Update product rating
    await updateProductRating(productId);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product',
      });
    }

    res.status(400).json({
      success: false,
      message: 'Error creating review',
      error: error.message,
    });
  }
};

// Get product reviews
export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const [reviews, total, stats] = await Promise.all([
      Review.find({ productId, isApproved: true })
        .populate('customerId', 'name')
        .sort(sort as string)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Review.countDocuments({ productId, isApproved: true }),
      Review.aggregate([
        { $match: { productId: productId, isApproved: true } },
        {
          $group: {
            _id: '$rating',
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    // Calculate rating distribution
    const ratingDistribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    stats.forEach((stat: any) => {
      ratingDistribution[stat._id as keyof typeof ratingDistribution] = stat.count;
    });

    res.json({
      success: true,
      data: reviews,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
      stats: {
        total,
        distribution: ratingDistribution,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message,
    });
  }
};

// Update product rating (helper function)
async function updateProductRating(productId: string) {
  const result = await Review.aggregate([
    { $match: { productId, isApproved: true } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(result[0].avgRating * 10) / 10,
      reviewCount: result[0].count,
    });
  }
}

// Admin: Reply to review
export const replyToReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const userId = req.user?.id;

    const review = await Review.findByIdAndUpdate(
      id,
      {
        reply: {
          message,
          repliedBy: userId,
          repliedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    res.json({
      success: true,
      message: 'Reply added successfully',
      data: review,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error replying to review',
      error: error.message,
    });
  }
};

// Admin: Moderate review
export const moderateReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { isApproved, moderationNote } = req.body;
    const userId = req.user?.id;

    const review = await Review.findByIdAndUpdate(
      id,
      {
        isApproved,
        moderatedBy: userId,
        moderationNote,
      },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Update product rating
    await updateProductRating(review.productId.toString());

    res.json({
      success: true,
      message: 'Review moderated successfully',
      data: review,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error moderating review',
      error: error.message,
    });
  }
};
