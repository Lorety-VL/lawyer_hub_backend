import ipRangeCheck from 'ip-range-check';


const allowedIps = process.env.YOOKASSA_ALLOWED_IPS.split(',');

export default (ip) => {
  return allowedIps.some(range => ipRangeCheck(ip, range));
};
