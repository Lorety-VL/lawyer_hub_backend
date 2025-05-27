import ApiError from '../exceptions/apiError.js';

export default function checkRoleMiddleware(requiredRoles) {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return next(ApiError.UnauthorizedError());
      }

      if (!requiredRoles.includes(req.user.role)) {
        return next(ApiError.Forbidden);
      }

      next();
    } catch (e) {
      next(e);
    }
  };
}
