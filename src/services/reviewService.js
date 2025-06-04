import ApiError from '../exceptions/apiError.js';
import { User, LawyerProfile, Review } from '../models/index.js';


class ReviewService {
  async createReview(userId, lawyerId, reviewData) {
    const user = await User.findByPk(userId);
    const lawyerProfile = await LawyerProfile.findOne({ where: { userId: lawyerId } });

    if (!user) {
      throw ApiError.NotFound();
    }
    if (!lawyerProfile) {
      throw ApiError.NotFound();
    }

    const review = await Review.create({
      lawyerId: lawyerProfile.id,
      clientId: userId,
      ...reviewData,
    });
    await lawyerProfile.addReview(review);
    const reviews = await lawyerProfile.getReviews();
    const sum = reviews.reduce((acc, el) => acc + el.rating, 0);
    const rating = sum / reviews.length;
    lawyerProfile.rating = rating.toFixed(1);
    await lawyerProfile.save();

    return review;
  }
}

export default new ReviewService();
