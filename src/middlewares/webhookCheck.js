import ipChecker from "../utils/ipChecker";


export default (req, res, next) => {
  const clientIp = req.ip ||
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress;

  const cleanIp = clientIp.includes('::ffff:')
    ? clientIp.split(':').pop()
    : clientIp;

  if (!ipChecker(cleanIp)) {
    return res.status(403).json({ error: 'IP not allowed' });
  }

  next();
};