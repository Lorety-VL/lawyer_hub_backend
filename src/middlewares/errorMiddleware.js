import ApiError from '../exceptions/apiError.js';
import { errorLogger } from '../utils/logger.js';

export default (err, req, res, next) => {
  errorLogger.error({
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id || null,
    params: req.params,
    query: req.query,
    statusCode: err instanceof ApiError ? err.status : 500,
    timestamp: new Date().toISOString()
  });

  if (err instanceof ApiError) {
    return res.status(err.status).json({
      message: err.message,
      errors: err.errors
    });
  }

  const response = process.env.NODE_ENV === 'production'
    ? { message: 'Unexpected error' }
    : { message: err.message, stack: err.stack };

  return res.status(500).json(response);
};