import { pdLogger } from '../utils/logger.js';

export const auditMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const sensitiveRoutes = [
      '/api/v1/auth',
      '/api/v1/users',
      '/api/v1/lawyers',
      '/api/v1/payments'
    ];

    if (sensitiveRoutes.some(route => req.originalUrl.startsWith(route))) {
      pdLogger.info({
        action: 'PD_ACCESS',
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        durationMs: Date.now() - start,
        userId: req.user?.id || null,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
      });
    }
  });

  next();
};

export default auditMiddleware;