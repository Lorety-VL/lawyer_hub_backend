import ApiError from "../exceptions/apiError.js";
import { User, LawyerProfile, Review } from "../models/index.js";


class ReviewService {
  async createReview(userId, lawyerId, reviewData) {
    const user = await User.findByPk(userId);
    const lawyer = await LawyerProfile.findOne({ where: { userId: lawyerId } });

    if (!user) {
      throw ApiError.NotFound();
    }
    if (!lawyer) {
      throw ApiError.NotFound();
    }

    const review = await Review.create({
      lawyerId,
      clientId: userId,
      ...reviewData,
    });
    lawyer.addReview(review)

    return review;
  }

}

export default new ReviewService();
